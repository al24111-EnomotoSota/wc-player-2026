import { getPlayerAnalysis } from '@/services/aiService'
import { infoForError } from '@/lib/errorMessage'
import type { PlayerDetail } from '@/types/player'

/**
 * AI による選手分析カード（async Server Component）。
 * 生成は時間がかかるため、ページ側で <Suspense> でラップして
 * スケルトンを表示しつつストリーミングする想定。
 */
export async function PlayerAICard({ player }: { player: PlayerDetail }) {
  let analysis
  try {
    analysis = await getPlayerAnalysis(player)
  } catch (err) {
    const info = infoForError(err)
    return (
      <CardShell>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {info.code === 'RATE_LIMIT'
            ? 'AI 分析は現在混み合っています。しばらくして再度お試しください。'
            : 'AI 分析を生成できませんでした。'}
        </p>
      </CardShell>
    )
  }

  return (
    <CardShell>
      <div className="space-y-4">
        {/* プレースタイル */}
        <div>
          <h3 className="mb-1.5 text-xs font-medium tracking-wide text-[var(--color-gold-400)]">
            プレースタイル
          </h3>
          <p className="font-[family-name:var(--font-heading)] text-sm leading-loose text-[var(--color-text-primary)]">
            {analysis.playStyle}
          </p>
        </div>

        {/* 特徴 */}
        {analysis.traits.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-medium tracking-wide text-[var(--color-gold-400)]">
              特徴
            </h3>
            <ul className="flex flex-wrap gap-2">
              {analysis.traits.map((t, i) => (
                <li
                  key={i}
                  className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 text-xs text-[var(--color-text-primary)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-4 text-[10px] text-[var(--color-text-tertiary)]">
        ※ この分析は AI（Google Gemini）が生成したものです
      </p>
    </CardShell>
  )
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border-l-2 border-[var(--color-gold-400)] border-y border-r border-y-[var(--color-border-default)] border-r-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5">
      <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-text-primary)]">
        <span className="text-[var(--color-gold-400)]" aria-hidden="true">
          ✦
        </span>
        AI 選手分析
      </h2>
      {children}
    </section>
  )
}

/** Suspense フォールバック用スケルトン */
export function PlayerAICardSkeleton() {
  return (
    <section
      className="rounded-2xl border-l-2 border-[var(--color-gold-400)] border-y border-r border-y-[var(--color-border-default)] border-r-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-5"
      aria-busy="true"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-[var(--color-gold-400)]" aria-hidden="true">
          ✦
        </span>
        <span className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-text-primary)]">
          AI 選手分析
        </span>
        <span className="text-xs text-[var(--color-text-tertiary)]">生成中...</span>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-11/12 rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-6 w-16 rounded-full" />
        ))}
      </div>
    </section>
  )
}
