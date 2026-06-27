'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'search-history'
const MAX_ITEMS = 10

/**
 * 検索履歴を LocalStorage で管理するフック。
 * 最新 10 件を保持し、古いものから削除する。
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  // 初回マウント時に読み込み
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setHistory(JSON.parse(raw) as string[])
    } catch {
      // パース失敗時は無視
    }
  }, [])

  const persist = useCallback((next: string[]) => {
    setHistory(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  // 履歴追加（重複は先頭に繰り上げ、上限超過は末尾削除）
  const addHistory = useCallback(
    (keyword: string) => {
      const trimmed = keyword.trim()
      if (!trimmed) return
      setHistory((prev) => {
        const next = [trimmed, ...prev.filter((k) => k !== trimmed)].slice(0, MAX_ITEMS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  // 1件削除
  const removeHistory = useCallback(
    (keyword: string) => {
      setHistory((prev) => {
        const next = prev.filter((k) => k !== keyword)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  // 全削除
  const clearHistory = useCallback(() => persist([]), [persist])

  return { history, addHistory, removeHistory, clearHistory }
}
