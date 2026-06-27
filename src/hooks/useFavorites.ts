'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FavoritePlayer } from '@/types/favorite'

const STORAGE_KEY = 'favorites'
// 同一タブ内の複数コンポーネントを同期するためのカスタムイベント
const SYNC_EVENT = 'favorites-changed'

function read(): FavoritePlayer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FavoritePlayer[]) : []
  } catch {
    return []
  }
}

function write(list: FavoritePlayer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  // 同一タブ内の他インスタンスへ通知
  window.dispatchEvent(new Event(SYNC_EVENT))
}

/**
 * お気に入り選手を LocalStorage で管理するフック。
 * 同一タブ内（カスタムイベント）・別タブ間（storage イベント）の両方で同期する。
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([])

  // 初期読み込み + 同期購読
  useEffect(() => {
    setFavorites(read())
    const sync = () => setFavorites(read())
    window.addEventListener(SYNC_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYNC_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites],
  )

  /** 追加（既に存在すれば何もしない） */
  const add = useCallback((player: Omit<FavoritePlayer, 'addedAt'>) => {
    const list = read()
    if (list.some((f) => f.id === player.id)) return
    write([{ ...player, addedAt: Date.now() }, ...list])
  }, [])

  const remove = useCallback((id: number) => {
    write(read().filter((f) => f.id !== id))
  }, [])

  /** 追加/削除のトグル。追加された場合は true を返す */
  const toggle = useCallback((player: Omit<FavoritePlayer, 'addedAt'>): boolean => {
    const list = read()
    if (list.some((f) => f.id === player.id)) {
      write(list.filter((f) => f.id !== player.id))
      return false
    }
    write([{ ...player, addedAt: Date.now() }, ...list])
    return true
  }, [])

  const clear = useCallback(() => write([]), [])

  return { favorites, isFavorite, add, remove, toggle, clear }
}
