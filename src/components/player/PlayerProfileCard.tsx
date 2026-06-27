import Image from 'next/image'
import { POSITION_LABEL } from '@/constants/positions'
import type { PlayerDetail } from '@/types/player'

export function PlayerProfileCard({ player }: { player: PlayerDetail }) {
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: '年齢', value: player.age != null ? `${player.age}歳` : '—' },
    { label: '身長', value: player.height != null ? `${player.height} cm` : '—' },
    { label: '体重', value: player.weight != null ? `${player.weight} kg` : '—' },
    {
      label: 'ポジション',
      value: player.position ? POSITION_LABEL[player.position] : (player.positionRaw ?? '—'),
    },
    {
      label: '代表',
      value: (
        <span className="flex items-center justify-end gap-2">
          {player.flagUrl && (
            <Image
              src={player.flagUrl}
              alt=""
              width={20}
              height={14}
              className="rounded-sm"
              unoptimized
            />
          )}
          {player.nationality ?? '—'}
        </span>
      ),
    },
    {
      label: 'クラブ',
      value: (
        <span className="flex items-center justify-end gap-2">
          {player.clubLogo && (
            <Image
              src={player.clubLogo}
              alt=""
              width={18}
              height={18}
              className="object-contain"
              sizes="18px"
            />
          )}
          {player.clubName ?? '—'}
        </span>
      ),
    },
  ]

  return (
    <section className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5">
      <h2 className="mb-3 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--color-text-primary)]">
        プロフィール
      </h2>
      <dl>
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex items-center justify-between py-3 ${
              i < rows.length - 1 ? 'border-b border-[var(--color-border-subtle)]' : ''
            }`}
          >
            <dt className="text-sm text-[var(--color-text-secondary)]">{label}</dt>
            <dd className="text-sm font-medium text-[var(--color-text-primary)]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
