export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10" aria-busy="true">
      <div className="skeleton h-5 w-24 rounded" />
      <div className="mt-4 space-y-5">
        {/* ヒーロー */}
        <div className="flex items-center gap-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-6">
          <div className="skeleton h-28 w-28 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="skeleton h-7 w-1/2 rounded" />
            <div className="skeleton h-4 w-1/3 rounded" />
          </div>
        </div>
        {/* スタッツ / プロフィール */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
        {/* 移籍履歴 */}
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    </div>
  )
}
