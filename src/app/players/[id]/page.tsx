import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPlayerDetail } from '@/services/playerService'
import { PlayerHeroCard } from '@/components/player/PlayerHeroCard'
import { PlayerStatsCard } from '@/components/player/PlayerStatsCard'
import { PlayerProfileCard } from '@/components/player/PlayerProfileCard'
import { PlayerTransfersCard } from '@/components/player/PlayerTransfersCard'
import { PlayerAICard, PlayerAICardSkeleton } from '@/components/player/PlayerAICard'
import { ErrorState } from '@/components/common/ErrorState'
import { infoForError } from '@/lib/errorMessage'
import type { PlayerDetail } from '@/types/player'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const playerId = Number(id)
  if (!Number.isInteger(playerId)) return { title: '選手が見つかりません' }

  try {
    const player = await getPlayerDetail(playerId)
    return { title: player?.name ?? '選手が見つかりません' }
  } catch {
    return { title: '選手情報' }
  }
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id } = await params
  const playerId = Number(id)
  if (!Number.isInteger(playerId) || playerId < 1) notFound()

  let player: PlayerDetail | null
  try {
    player = await getPlayerDetail(playerId)
  } catch (err) {
    // API キー未設定・タイムアウト・レート制限・上流障害などをステータス別に表示
    const info = infoForError(err)
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
        <BackLink />
        <div className="mt-6">
          <ErrorState title={info.title} message={info.message} />
        </div>
      </div>
    )
  }

  if (!player) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
      <BackLink />

      <div className="mt-4 space-y-5">
        <PlayerHeroCard player={player} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PlayerStatsCard stats={player.stats} />
          <PlayerProfileCard player={player} />
        </div>

        <Suspense fallback={<PlayerAICardSkeleton />}>
          <PlayerAICard player={player} />
        </Suspense>

        <PlayerTransfersCard transfers={player.transfers} />
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/search"
      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      検索に戻る
    </Link>
  )
}
