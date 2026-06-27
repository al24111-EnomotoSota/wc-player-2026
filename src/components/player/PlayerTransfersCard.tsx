import Image from 'next/image'
import type { TransferRecord } from '@/types/player'

function formatDate(date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return date
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

function ClubChip({ name, logo }: { name: string; logo: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 truncate">
      {logo && (
        <Image src={logo} alt="" width={18} height={18} className="object-contain" sizes="18px" />
      )}
      <span className="truncate text-sm text-[var(--color-text-primary)]">{name}</span>
    </span>
  )
}

export function PlayerTransfersCard({ transfers }: { transfers: TransferRecord[] }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5">
      <h2 className="mb-4 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-text-primary)]">
        移籍履歴
      </h2>

      {transfers.length === 0 ? (
        <p className="py-4 text-center text-sm text-[var(--color-text-secondary)]">
          移籍履歴のデータがありません
        </p>
      ) : (
        <ol className="space-y-4">
          {transfers.map((t, i) => (
            <li key={`${t.date}-${i}`} className="relative flex gap-3 pl-4">
              {/* タイムライン縦線 */}
              <span
                className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-[var(--color-gold-400)]"
                aria-hidden="true"
              />
              {i < transfers.length - 1 && (
                <span
                  className="absolute left-[3px] top-3.5 bottom-[-1rem] w-px bg-[var(--color-border-default)]"
                  aria-hidden="true"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {formatDate(t.date)}
                  </span>
                  {t.type && (
                    <span className="rounded bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-secondary)]">
                      {t.type}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <ClubChip name={t.fromClub} logo={t.fromLogo} />
                  <span className="text-[var(--color-text-tertiary)]" aria-hidden="true">
                    →
                  </span>
                  <ClubChip name={t.toClub} logo={t.toLogo} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
