/**
 * 選手詳細のビジネスロジック層。
 * API-Football の生データを取得し、画面表示用の PlayerDetail に正規化する。
 * サーバーサイド専用。
 */
import { unstable_cache } from 'next/cache'
import { apiFootball, type AFPlayerEntry, type AFTransferEntry } from './apiFootball'
import { normalizePosition } from '@/constants/positions'
import { flagUrl } from '@/constants/countries'
import type { PlayerDetail, PlayerStats, TransferRecord } from '@/types/player'

/** "170 cm" や "1.70 m" のような文字列を cm の数値へ */
function parseHeight(raw: string | null): number | null {
  if (!raw) return null
  const n = Number.parseFloat(raw)
  if (Number.isNaN(n)) return null
  return n < 3 ? Math.round(n * 100) : Math.round(n)
}

/** "72 kg" のような文字列を kg の数値へ */
function parseWeight(raw: string | null): number | null {
  if (!raw) return null
  const n = Number.parseFloat(raw)
  return Number.isNaN(n) ? null : Math.round(n)
}

/** 複数シーズン/大会のスタッツを合算 */
function aggregateStats(entry: AFPlayerEntry): PlayerStats {
  return entry.statistics.reduce<PlayerStats>(
    (acc, s) => ({
      appearances: acc.appearances + (s.games.appearences ?? 0),
      goals: acc.goals + (s.goals.total ?? 0),
      assists: acc.assists + (s.goals.assists ?? 0),
      minutes: acc.minutes + (s.games.minutes ?? 0),
      yellowCards: acc.yellowCards + (s.cards.yellow ?? 0),
      redCards: acc.redCards + (s.cards.red ?? 0),
    }),
    { appearances: 0, goals: 0, assists: 0, minutes: 0, yellowCards: 0, redCards: 0 },
  )
}

function normalizeTransfers(entries: AFTransferEntry[]): TransferRecord[] {
  const list = entries[0]?.transfers ?? []
  return list
    .map((t) => ({
      date: t.date,
      type: t.type,
      fromClub: t.teams.out.name,
      fromLogo: t.teams.out.logo || null,
      toClub: t.teams.in.name,
      toLogo: t.teams.in.logo || null,
    }))
    .sort((a, b) => b.date.localeCompare(a.date)) // 新しい順
}

/** キャッシュ前の生処理 */
async function fetchPlayerDetail(playerId: number): Promise<PlayerDetail | null> {
  const [entry, transferEntries] = await Promise.all([
    apiFootball.getPlayerById(playerId),
    apiFootball.getPlayerTransfers(playerId).catch(() => [] as AFTransferEntry[]),
  ])

  if (!entry) return null

  const p = entry.player
  const stat = entry.statistics[0]
  const transfers = normalizeTransfers(transferEntries)

  // クラブは最新スタッツのチーム → なければ最新移籍先
  const clubName = stat?.team.name ?? transfers[0]?.toClub ?? null
  const clubLogo = stat?.team.logo ?? transfers[0]?.toLogo ?? null

  return {
    id: p.id,
    name: p.name,
    photo: p.photo || null,
    position: normalizePosition(p.position ?? stat?.games.position),
    positionRaw: p.position ?? stat?.games.position ?? null,
    number: p.number ?? stat?.games.number ?? null,
    age: p.age,
    height: parseHeight(p.height),
    weight: parseWeight(p.weight),
    nationality: p.nationality,
    flagUrl: flagUrl(p.nationality),
    clubName,
    clubLogo,
    stats: aggregateStats(entry),
    transfers,
  }
}

/**
 * 選手詳細を取得（結果キャッシュ付き）。見つからなければ null。
 * 組み立て済みの PlayerDetail を Data Cache に 1 時間保持する。
 */
export async function getPlayerDetail(playerId: number): Promise<PlayerDetail | null> {
  const cached = unstable_cache(
    () => fetchPlayerDetail(playerId),
    ['player-detail', String(playerId)],
    { tags: [`player-detail-${playerId}`], revalidate: 60 * 60 }, // 1 時間
  )
  return cached()
}
