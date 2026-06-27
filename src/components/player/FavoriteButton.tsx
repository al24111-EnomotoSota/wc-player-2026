'use client'

import { useState } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import type { FavoritePlayer } from '@/types/favorite'

interface Props {
  player: Omit<FavoritePlayer, 'addedAt'>
  /** 表示サイズ */
  size?: 'sm' | 'md'
}

/**
 * お気に入りトグルボタン（★）。
 * 追加時にゴールドのポップアニメーションと触覚フィードバック（対応端末）を行う。
 */
export function FavoriteButton({ player, size = 'md' }: Props) {
  const { isFavorite, toggle } = useFavorites()
  const [pop, setPop] = useState(false)
  const active = isFavorite(player.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggle(player)
    if (added) {
      setPop(true)
      navigator.vibrate?.(10)
      setTimeout(() => setPop(false), 300)
    }
  }

  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 18 : 22

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'お気に入りから削除' : 'お気に入りに追加'}
      className={`flex shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${dim} ${
        active
          ? 'text-[var(--color-gold-400)]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-gold-400)]'
      } ${pop ? 'animate-[heart-pop_300ms_cubic-bezier(0.34,1.56,0.64,1)]' : ''} hover:bg-[var(--color-bg-elevated)]`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  )
}
