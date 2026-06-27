import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'オフライン',
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-5xl opacity-60" aria-hidden="true">
        📡
      </span>
      <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-text-primary)]">
        オフラインです
      </h1>
      <p className="max-w-xs text-sm leading-loose text-[var(--color-text-secondary)]">
        インターネットに接続されていません。
        <br />
        接続を確認してから、もう一度お試しください。
      </p>
      <p className="text-xs text-[var(--color-text-tertiary)]">
        一度表示したページはオフラインでも閲覧できます。
      </p>
    </div>
  )
}
