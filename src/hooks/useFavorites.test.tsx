import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'
import type { FavoritePlayer } from '@/types/favorite'

const player = (id: number, name = 'X'): Omit<FavoritePlayer, 'addedAt'> => ({
  id,
  name,
  photo: null,
  position: 'FW',
  number: 10,
  teamName: 'Argentina',
  country: 'Argentina',
})

beforeEach(() => localStorage.clear())

describe('useFavorites', () => {
  it('toggle で追加/削除し、isFavorite が状態を返す', () => {
    const { result } = renderHook(() => useFavorites())

    let added: boolean | undefined
    act(() => {
      added = result.current.toggle(player(1))
    })
    expect(added).toBe(true)
    expect(result.current.isFavorite(1)).toBe(true)
    expect(result.current.favorites).toHaveLength(1)

    act(() => {
      added = result.current.toggle(player(1))
    })
    expect(added).toBe(false)
    expect(result.current.isFavorite(1)).toBe(false)
    expect(result.current.favorites).toHaveLength(0)
  })

  it('add は冪等（同じ ID は重複追加しない）', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.add(player(1))
      result.current.add(player(1))
    })
    expect(result.current.favorites).toHaveLength(1)
  })

  it('新しく追加したものが先頭に来る', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.add(player(1, 'A'))
      result.current.add(player(2, 'B'))
    })
    expect(result.current.favorites[0].id).toBe(2)
  })

  it('個別削除と全削除ができる', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      result.current.add(player(1))
      result.current.add(player(2))
    })
    act(() => result.current.remove(1))
    expect(result.current.favorites.map((f) => f.id)).toEqual([2])
    act(() => result.current.clear())
    expect(result.current.favorites).toEqual([])
  })
})
