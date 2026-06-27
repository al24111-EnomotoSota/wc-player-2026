/**
 * 共通エラー表示コンポーネント（プレゼンテーション）。
 * 検索・選手詳細・AI など各所のエラー UI を統一する。
 */
export function ErrorState({
  title,
  message,
  onRetry,
  icon = '⚠️',
}: {
  title?: string
  message: string
  onRetry?: () => void
  icon?: string
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-10 text-center"
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      {title && (
        <p className="text-sm font-bold text-[var(--color-text-primary)]">{title}</p>
      )}
      <p className="max-w-xs text-sm text-[var(--color-text-secondary)]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-full border border-[var(--color-border-default)] px-5 py-2 text-xs font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
        >
          再試行
        </button>
      )}
    </div>
  )
}
