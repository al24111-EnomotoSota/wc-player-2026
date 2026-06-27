import { POSITION_COLOR, type Position } from '@/constants/positions'

export function PositionBadge({
  position,
  size = 'md',
}: {
  position: Position
  size?: 'sm' | 'md'
}) {
  const { bg, text } = POSITION_COLOR[position]
  return (
    <span
      className={`inline-flex items-center justify-center rounded font-[family-name:var(--font-numeric)] font-bold uppercase tracking-[0.1em] ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
      style={{ backgroundColor: bg, color: text }}
    >
      {position}
    </span>
  )
}
