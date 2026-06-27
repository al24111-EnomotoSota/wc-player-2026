'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'
import type { FavoritePlayer } from '@/types/favorite'

export default function FavoritesPage() {
  const { favorites, remove, clear } = useFavorites()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-text-primary)]">
          ⭐ お気に入り
          {favorites.length > 0 && (
            <span className="ml-2 font-[family-name:var(--font-numeric)] text-base font-bold text-[var(--color-gold-400)]">
              {favorites.length}人
            </span>
          )}
        </h1>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-[var(--color-text-tertiary)] transition-colors duration-200 hover:text-[var(--color-error)]"
          >
            すべて削除
          </button>
        )}
      </div>

      {favorites.length === 0 ? <EmptyState /> : <FavoriteList favorites={favorites} onRemove={remove} />}
    </div>
  )
}

function FavoriteList({
  favorites,
  onRemove,
}: {
  favorites: FavoritePlayer[]
  onRemove: (id: number) => void
}) {
  return (
    <ul className="space-y-3">
      {favorites.map((p) => (
        <li key={p.id} className="flex items-center gap-2">
          <Link
            href={`/players/${p.id}`}
            className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-3 transition-shadow duration-200 hover:shadow-[var(--shadow-gold)]"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
              {p.photo ? (
                <Image
                  src={p.photo}
                  alt={p.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg text-[var(--color-text-tertiary)]">
                  ⚽
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-[var(--color-text-primary)]">{p.name}</p>
              <p className="truncate text-xs text-[var(--color-text-secondary)]">
                {p.teamName || p.country}
                {p.position && ` ・ ${p.position}`}
              </p>
            </div>

            {p.number != null && (
              <span className="shrink-0 font-[family-name:var(--font-numeric)] text-2xl font-bold text-[var(--color-text-secondary)]">
                #{p.number}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => onRemove(p.id)}
            aria-label={`${p.name} をお気に入りから削除`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--color-gold-400)] transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <span className="text-5xl text-[var(--color-gold-400)] opacity-40" aria-hidden="true">
        ⭐
      </span>
      <p className="text-base font-medium text-[var(--color-text-primary)]">
        まだお気に入りがいません
      </p>
      <p className="text-sm text-[var(--color-text-secondary)]">
        選手詳細の ⭐ をタップして追加できます
      </p>
      <Link
        href="/search"
        className="mt-2 rounded-full bg-[var(--color-gold-400)] px-6 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors duration-200 hover:bg-[var(--color-gold-300)]"
      >
        ✦ 選手を探す
      </Link>
    </div>
  )
}
