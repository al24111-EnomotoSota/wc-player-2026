/**
 * API-Football クライアント（https://www.api-football.com/）
 *
 * - 無料枠は 100 req/日。呼び出し回数に注意（将来 Redis でレート制限管理）。
 * - サーバーサイド専用。API_FOOTBALL_KEY をクライアントへ漏らさないこと。
 * - FIFA ワールドカップ = league 1。2026 大会は season 2026。
 */
import { ExternalApiError, fetchJson } from './http'

const WORLD_CUP_LEAGUE_ID = 1
const DEFAULT_SEASON = 2026

// --- API-Football の生レスポンス型（必要分のみ） ---

interface AFEnvelope<T> {
  get: string
  parameters: Record<string, string>
  errors: unknown[] | Record<string, string>
  results: number
  paging: { current: number; total: number }
  response: T
}

export interface AFTeamEntry {
  team: {
    id: number
    name: string
    code: string | null
    country: string
    founded: number | null
    national: boolean
    logo: string
  }
  venue: {
    id: number | null
    name: string | null
    city: string | null
  }
}

export interface AFPlayerEntry {
  player: {
    id: number
    name: string
    firstname: string | null
    lastname: string | null
    age: number | null
    birth: { date: string | null; place: string | null; country: string | null }
    nationality: string | null
    height: string | null
    weight: string | null
    number: number | null
    position: string | null
    photo: string
  }
  statistics: Array<{
    team: { id: number; name: string; logo: string }
    games: {
      appearences: number | null
      minutes: number | null
      position: string | null
      number: number | null
    }
    goals: { total: number | null; assists: number | null }
    cards: { yellow: number | null; red: number | null }
  }>
}

export interface AFFixtureEntry {
  fixture: {
    id: number
    date: string
    venue: { name: string | null; city: string | null }
    status: { long: string; short: string }
  }
  league: { id: number; season: number; round: string }
  teams: {
    home: { id: number; name: string; logo: string }
    away: { id: number; name: string; logo: string }
  }
  goals: { home: number | null; away: number | null }
}

export interface AFTransferEntry {
  player: { id: number; name: string }
  update: string
  transfers: Array<{
    date: string
    type: string | null
    teams: {
      in: { id: number; name: string; logo: string }
      out: { id: number; name: string; logo: string }
    }
  }>
}

// --- クライアント設定 ---

function getConfig() {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) {
    throw new ExternalApiError(
      'API_FOOTBALL_KEY が設定されていません（.env.local を確認）',
      500,
      'api-football',
    )
  }
  const host = process.env.API_FOOTBALL_HOST ?? 'v3.football.api-sports.io'
  const isRapidApi = host.includes('rapidapi')

  // 直接版(api-sports)は x-apisports-key、RapidAPI 版は別ヘッダー
  const headers: Record<string, string> = isRapidApi
    ? { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': host }
    : { 'x-apisports-key': apiKey }

  return { baseUrl: `https://${host}`, headers }
}

async function afGet<T>(
  path: string,
  params: Record<string, string | number>,
  revalidate: number,
): Promise<T[]> {
  const { baseUrl, headers } = getConfig()
  const search = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)]),
  )
  const url = `${baseUrl}${path}?${search.toString()}`

  const data = await fetchJson<AFEnvelope<T[]>>(url, {
    headers,
    source: 'api-football',
    revalidate,
  })

  // API-Football はエラーを body.errors に入れて 200 を返すことがある
  const hasErrors = Array.isArray(data.errors)
    ? data.errors.length > 0
    : Object.keys(data.errors ?? {}).length > 0
  if (hasErrors) {
    throw new ExternalApiError(
      `API-Football がエラーを返しました: ${JSON.stringify(data.errors)}`,
      400,
      'api-football',
      data.errors,
    )
  }

  return data.response
}

// --- 公開メソッド ---

export const apiFootball = {
  /** ワールドカップ出場国チーム一覧 */
  async getWorldCupTeams(season = DEFAULT_SEASON): Promise<AFTeamEntry[]> {
    return afGet<AFTeamEntry>(
      '/teams',
      { league: WORLD_CUP_LEAGUE_ID, season },
      60 * 60 * 24, // チームは変動が少ないので 1 日キャッシュ
    )
  },

  /** 指定チームの大会登録選手一覧 */
  async getTeamPlayers(teamId: number, season = DEFAULT_SEASON): Promise<AFPlayerEntry[]> {
    return afGet<AFPlayerEntry>(
      '/players',
      { team: teamId, league: WORLD_CUP_LEAGUE_ID, season },
      60 * 60, // スタッツ込みなので 1 時間キャッシュ
    )
  },

  /** 選手単体の情報＋スタッツ */
  async getPlayerById(playerId: number, season = DEFAULT_SEASON): Promise<AFPlayerEntry | null> {
    const res = await afGet<AFPlayerEntry>(
      '/players',
      { id: playerId, season },
      60 * 60,
    )
    return res[0] ?? null
  },

  /** 大会の試合日程・結果 */
  async getFixtures(season = DEFAULT_SEASON): Promise<AFFixtureEntry[]> {
    return afGet<AFFixtureEntry>(
      '/fixtures',
      { league: WORLD_CUP_LEAGUE_ID, season },
      60 * 30, // 試合は 30 分キャッシュ
    )
  },

  /** 得点ランキング（トップスコアラー） */
  async getTopScorers(season = DEFAULT_SEASON): Promise<AFPlayerEntry[]> {
    return afGet<AFPlayerEntry>(
      '/players/topscorers',
      { league: WORLD_CUP_LEAGUE_ID, season },
      60 * 60,
    )
  },

  /** 選手の移籍履歴 */
  async getPlayerTransfers(playerId: number): Promise<AFTransferEntry[]> {
    return afGet<AFTransferEntry>(
      '/transfers',
      { player: playerId },
      60 * 60 * 24, // 移籍履歴は変動が少ないので 1 日キャッシュ
    )
  },
}
