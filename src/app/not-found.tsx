import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ページが見つかりません',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-[family-name:var(--font-numeric)] text-6xl font-bold text-[var(--color-gold-400)]">
        404
      </span>
      <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-text-primary)]">
        ページが見つかりません
      </h1>
      <p className="max-w-xs text-sm leading-loose text-[var(--color-text-secondary)]">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div className="mt-2 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-[var(--color-gold-400)] px-6 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors duration-200 hover:bg-[var(--color-gold-300)]"
        >
          ホームへ
        </Link>
        <Link
          href="/search"
          className="rounded-full border border-[var(--color-border-default)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
        >
          選手を探す
        </Link>
      </div>
    </div>
  )
}
