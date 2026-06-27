import type { PlayerStats } from '@/types/player'

const ITEMS: Array<{ key: keyof PlayerStats; label: string; icon: string; accent?: boolean }> = [
  { key: 'goals', label: 'ゴール', icon: '⚽', accent: true },
  { key: 'assists', label: 'アシスト', icon: '🎯' },
  { key: 'appearances', label: '試合数', icon: '📋' },
  { key: 'minutes', label: '出場分', icon: '⏱' },
  { key: 'yellowCards', label: '警告', icon: '🟨' },
  { key: 'redCards', label: '退場', icon: '🟥' },
]

export function PlayerStatsCard({ stats }: { stats: PlayerStats }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5">
      <h2 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-text-primary)]">
        成績
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map(({ key, label, icon, accent }) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 rounded-xl bg-[var(--color-bg-elevated)] py-4"
          >
            <span className="text-base" aria-hidden="true">
              {icon}
            </span>
            <span
              className="font-[family-name:var(--font-numeric)] text-2xl font-bold"
              style={{ color: accent ? 'var(--color-green-500)' : 'var(--color-text-primary)' }}
            >
              {stats[key]}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
