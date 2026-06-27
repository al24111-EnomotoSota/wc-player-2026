import Image from 'next/image'
import { PositionBadge } from '@/components/common/PositionBadge'
import { FavoriteButton } from '@/components/player/FavoriteButton'
import type { PlayerDetail } from '@/types/player'

export function PlayerHeroCard({ player }: { player: PlayerDetail }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-gold)]">
      {/* 背番号（右上の大きな装飾） */}
      {player.number != null && (
        <span
          className="pointer-events-none absolute right-4 top-2 select-none font-[family-name:var(--font-numeric)] text-7xl font-bold text-[var(--color-text-primary)]/5"
          aria-hidden="true"
        >
          {player.number}
        </span>
      )}

      {/* お気に入りボタン（右上） */}
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton
          player={{
            id: player.id,
            name: player.name,
            photo: player.photo,
            position: player.positionRaw,
            number: player.number,
            teamName: player.clubName ?? '',
            country: player.nationality ?? '',
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-end sm:gap-6">
        {/* 選手写真 */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-gold-400)] bg-[var(--color-bg-elevated)]">
          {player.photo ? (
            <Image
              src={player.photo}
              alt={player.name}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-3xl text-[var(--color-text-tertiary)]">
              ⚽
            </span>
          )}
        </div>

        {/* 名前・国籍・ポジション */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            {player.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {player.flagUrl && (
              <Image
                src={player.flagUrl}
                alt={player.nationality ?? ''}
                width={22}
                height={15}
                className="rounded-sm"
                unoptimized
              />
            )}
            {player.nationality && (
              <span className="text-sm text-[var(--color-text-secondary)]">
                {player.nationality}
              </span>
            )}
            {player.position && <PositionBadge position={player.position} />}
            {player.number != null && (
              <span className="font-[family-name:var(--font-numeric)] text-sm font-bold text-[var(--color-text-secondary)]">
                #{player.number}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
