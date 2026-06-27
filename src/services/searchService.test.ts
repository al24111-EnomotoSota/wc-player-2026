import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AFTeamEntry, AFPlayerEntry } from './apiFootball'

// unstable_cache はラップした関数をそのまま実行する形にモック
vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}))

// API-Football クライアントをモック
vi.mock('./apiFootball', () => ({
  apiFootball: {
    getWorldCupTeams: vi.fn(),
    getTeamPlayers: vi.fn(),
  },
}))

import { searchPlayers } from './searchService'
import { apiFootball } from './apiFootball'

const team = (id: number, name: string, country: string): AFTeamEntry => ({
  team: { id, name, code: null, country, founded: null, national: true, logo: '' },
  venue: { id: null, name: null, city: null },
})

const player = (id: number, name: string, number: number | null): AFPlayerEntry => ({
  player: {
    id,
    name,
    firstname: null,
    lastname: null,
    age: 30,
    birth: { date: null, place: null, country: 'Argentina' },
    nationality: 'Argentina',
    height: null,
    weight: null,
    number,
    position: 'Attacker',
    photo: 'photo.png',
  },
  statistics: [
    {
      team: { id: 1, name: 'Argentina', logo: 'logo.png' },
      games: { appearences: 1, minutes: 90, position: 'Attacker', number },
      goals: { total: 1, assists: 0 },
      cards: { yellow: 0, red: 0 },
    },
  ],
})

const teamsMock = vi.mocked(apiFootball.getWorldCupTeams)
const playersMock = vi.mocked(apiFootball.getTeamPlayers)

beforeEach(() => vi.clearAllMocks())

describe('searchPlayers', () => {
  it('国名で部分一致・大文字小文字を無視してチームを絞り込む', async () => {
    teamsMock.mockResolvedValue([team(1, 'Argentina', 'Argentina'), team(2, 'Brazil', 'Brazil')])
    playersMock.mockResolvedValue([player(10, 'Messi', 10)])

    const res = await searchPlayers({ country: 'argent' })

    expect(playersMock).toHaveBeenCalledTimes(1)
    expect(playersMock).toHaveBeenCalledWith(1)
    expect(res).toHaveLength(1)
    expect(res[0].name).toBe('Messi')
  })

  it('背番号で絞り込む', async () => {
    teamsMock.mockResolvedValue([team(1, 'Argentina', 'Argentina')])
    playersMock.mockResolvedValue([player(10, 'Messi', 10), player(9, 'Alvarez', 9)])

    const res = await searchPlayers({ country: 'Argentina', number: 10 })

    expect(res).toHaveLength(1)
    expect(res[0].number).toBe(10)
  })

  it('該当チームがなければ選手取得せず空配列を返す', async () => {
    teamsMock.mockResolvedValue([team(1, 'Argentina', 'Argentina')])

    const res = await searchPlayers({ country: 'Japan' })

    expect(res).toEqual([])
    expect(playersMock).not.toHaveBeenCalled()
  })

  it('国名未指定時はチーム取得を 8 件に制限する（レート制限対策）', async () => {
    const many = Array.from({ length: 12 }, (_, i) => team(i + 1, `T${i}`, `C${i}`))
    teamsMock.mockResolvedValue(many)
    playersMock.mockResolvedValue([])

    await searchPlayers({})

    expect(playersMock).toHaveBeenCalledTimes(8)
  })
})
