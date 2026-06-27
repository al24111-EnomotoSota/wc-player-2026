/**
 * 選手検索のビジネスロジック層。
 * API-Football を呼んで正規化し、結果を unstable_cache で
 * Next.js Data Cache に保持する（API レスポンスのキャッシュ）。
 * サーバーサイド専用。
 */
import { unstable_cache } from 'next/cache'
import { apiFootball, type AFPlayerEntry } from './apiFootball'
import type { SearchParams, SearchPlayerResult } from '@/types/search'

const TEAM_LIMIT = 8

function normalizePlayer(entry: AFPlayerEntry): SearchPlayerResult {
  const stat = entry.statistics[0]
  return {
    id: entry.player.id,
    name: entry.player.name,
    photo: entry.player.photo || null,
    position: entry.player.position ?? stat?.games.position ?? null,
    number: entry.player.number ?? stat?.games.number ?? null,
    teamName: stat?.team.name ?? '',
    teamLogo: stat?.team.logo ?? null,
    country: entry.player.birth?.country ?? entry.player.nationality ?? '',
    nationality: entry.player.nationality ?? null,
  }
}

/** キャッシュ前の生処理: チーム取得 → 選手取得 → 正規化 → 絞り込み */
async function runSearch(params: SearchParams): Promise<SearchPlayerResult[]> {
  const { country, number } = params

  const teams = await apiFootball.getWorldCupTeams()
  const matchedTeams = country
    ? teams.filter((t) => {
        const haystack = `${t.team.name} ${t.team.country}`.toLowerCase()
        return haystack.includes(country.toLowerCase())
      })
    : teams

  if (matchedTeams.length === 0) return []

  const targetTeams = matchedTeams.slice(0, TEAM_LIMIT)
  const playerLists = await Promise.all(
    targetTeams.map((t) => apiFootball.getTeamPlayers(t.team.id)),
  )

  return playerLists
    .flat()
    .map(normalizePlayer)
    .filter((p) => (number === undefined ? true : p.number === number))
}

/**
 * 選手を検索（結果キャッシュ付き）。
 * 同一条件の結果は Data Cache に 5 分保持し、API 呼び出し（無料枠）を節約する。
 */
export async function searchPlayers(params: SearchParams): Promise<SearchPlayerResult[]> {
  const cacheKey = `${params.country ?? ''}|${params.number ?? ''}`
  const cached = unstable_cache(
    () => runSearch(params),
    ['player-search', cacheKey],
    { tags: ['player-search'], revalidate: 60 * 5 }, // 5 分
  )
  return cached()
}
