'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * ルートセグメントのエラーバウンダリ（500 系・予期せぬ例外）。
 * Server Component から throw された例外は本番では digest のみが渡され、
 * 詳細メッセージはクライアントに露出しない。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 将来 Sentry などへ送信する箇所
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-5xl" aria-hidden="true">
        ⚠️
      </span>
      <h1 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--color-text-primary)]">
        エラーが発生しました
      </h1>
      <p className="max-w-xs text-sm leading-loose text-[var(--color-text-secondary)]">
        問題が発生しました。時間をおいて再試行してください。
      </p>
      {error.digest && (
        <p className="text-[10px] text-[var(--color-text-tertiary)]">
          エラーID: {error.digest}
        </p>
      )}
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[var(--color-gold-400)] px-6 py-2.5 text-sm font-bold text-[var(--color-text-inverse)] transition-colors duration-200 hover:bg-[var(--color-gold-300)]"
        >
          再試行
        </button>
        <Link
          href="/"
          className="rounded-full border border-[var(--color-border-default)] px-6 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
        >
          ホームへ
        </Link>
      </div>
    </div>
  )
}
