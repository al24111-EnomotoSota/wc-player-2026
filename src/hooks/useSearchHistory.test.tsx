import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSearchHistory } from './useSearchHistory'

beforeEach(() => localStorage.clear())

describe('useSearchHistory', () => {
  it('新しい順に追加し、重複は先頭へ繰り上げる', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => result.current.addHistory('Messi'))
    act(() => result.current.addHistory('Ronaldo'))
    act(() => result.current.addHistory('Messi'))
    expect(result.current.history).toEqual(['Messi', 'Ronaldo'])
  })

  it('最新 10 件のみ保持する', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      for (let i = 1; i <= 12; i++) result.current.addHistory(`q${i}`)
    })
    expect(result.current.history).toHaveLength(10)
    expect(result.current.history[0]).toBe('q12')
    expect(result.current.history).not.toContain('q1')
    expect(result.current.history).not.toContain('q2')
  })

  it('空白のみの入力は無視する', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => result.current.addHistory('   '))
    expect(result.current.history).toEqual([])
  })

  it('個別削除と全削除ができる', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => {
      result.current.addHistory('a')
      result.current.addHistory('b')
    })
    act(() => result.current.removeHistory('a'))
    expect(result.current.history).toEqual(['b'])
    act(() => result.current.clearHistory())
    expect(result.current.history).toEqual([])
  })

  it('LocalStorage に永続化される', () => {
    const { result } = renderHook(() => useSearchHistory())
    act(() => result.current.addHistory('persist'))
    expect(JSON.parse(localStorage.getItem('search-history') ?? '[]')).toEqual(['persist'])
  })
})
