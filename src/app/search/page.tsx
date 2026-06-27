'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearch } from '@/hooks/useSearch'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import type { SearchPlayerResult } from '@/types/search'

export default function SearchPage() {
  const [country, setCountry] = useState('')
  const [number, setNumber] = useState('')
  const { status, results, error, search } = useSearch()
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistory()

  const canSubmit = country.trim() !== '' || number.trim() !== ''

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || status === 'loading') return

    const num = number.trim() ? Number(number.trim()) : undefined
    search({ country: country.trim() || undefined, number: num })

    // 履歴には人が読める形で保存
    const label = [country.trim(), number.trim() && `#${number.trim()}`]
      .filter(Boolean)
      .join(' ')
    addHistory(label)
  }

  // 履歴クリックで条件を復元して再検索
  const handleHistoryClick = (label: string) => {
    const numMatch = label.match(/#(\d+)/)
    const num = numMatch ? numMatch[1] : ''
    const ctry = label.replace(/#\d+/, '').trim()
    setCountry(ctry)
    setNumber(num)
    search({ country: ctry || undefined, number: num ? Number(num) : undefined })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="mb-5 font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--color-text-primary)]">
        選手を検索
      </h1>

      {/* 検索条件フォーム */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* 国名 */}
          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
              国名
            </span>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="例: 日本 / Japan"
              aria-label="国名"
              className="h-11 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-shadow duration-200 focus:border-[var(--color-gold-400)] focus:shadow-[var(--shadow-gold)]"
            />
          </label>

          {/* 背番号 */}
          <label className="sm:w-32">
            <span className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
              背番号
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={99}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="例: 10"
              aria-label="背番号"
              className="h-11 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition-shadow duration-200 focus:border-[var(--color-gold-400)] focus:shadow-[var(--shadow-gold)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>
        </div>

        {/* 検索ボタン */}
        <button
          type="submit"
          disabled={!canSubmit || status === 'loading'}
          className="h-11 w-full rounded-full bg-[var(--color-gold-400)] px-6 text-sm font-bold text-[var(--color-text-inverse)] transition-all duration-200 hover:bg-[var(--color-gold-300)] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[160px]"
        >
          {status === 'loading' ? '検索中...' : '検索'}
        </button>
      </form>

      {/* 結果エリア */}
      <div className="mt-8">
        {status === 'loading' && <LoadingSkeleton />}

        {status === 'error' && <ErrorState message={error} onRetry={handleSubmit} />}

        {status === 'success' &&
          (results.length > 0 ? (
            <ResultList results={results} />
          ) : (
            <NoResults />
          ))}

        {status === 'idle' && (
          <SearchHistory
            history={history}
            onSelect={handleHistoryClick}
            onRemove={removeHistory}
            onClear={clearHistory}
          />
        )}
      </div>
    </div>
  )
}

/* === 検索結果リスト === */
function ResultList({ results }: { results: SearchPlayerResult[] }) {
  return (
    <section aria-label="検索結果">
      <p className="mb-3 text-xs text-[var(--color-text-secondary)]">
        <span className="font-[family-name:var(--font-numeric)] text-base font-bold text-[var(--color-gold-400)]">
          {results.length}
        </span>{' '}
        件の選手が見つかりました
      </p>
      <ul className="space-y-3">
        {results.map((p) => (
          <li key={p.id}>
            <Link
              href={`/players/${p.id}`}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-3 transition-shadow duration-200 hover:shadow-[var(--shadow-gold)]"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
                {p.photo ? (
                  <Image
                    src={p.photo}
                    alt={p.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg text-[var(--color-text-tertiary)]">
                    ⚽
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--color-text-primary)]">{p.name}</p>
                <p className="truncate text-xs text-[var(--color-text-secondary)]">
                  {p.teamName || p.country}
                  {p.position && ` ・ ${p.position}`}
                </p>
              </div>

              {p.number != null && (
                <span className="shrink-0 font-[family-name:var(--font-numeric)] text-2xl font-bold text-[var(--color-text-secondary)]">
                  #{p.number}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* === 該当なし === */
function NoResults() {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center">
      <span className="text-3xl opacity-40" aria-hidden="true">
        🔍
      </span>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">
        該当する選手が見つかりませんでした
      </p>
      <p className="text-xs text-[var(--color-text-secondary)]">
        国名や背番号を変えて、もう一度お試しください
      </p>
    </div>
  )
}

/* === エラー表示 === */
function ErrorState({
  message,
  onRetry,
}: {
  message: string | null
  onRetry: (e: React.FormEvent) => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 px-4 py-10 text-center"
    >
      <span className="text-3xl" aria-hidden="true">
        ⚠️
      </span>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">
        {message ?? 'エラーが発生しました'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 rounded-full border border-[var(--color-border-default)] px-5 py-2 text-xs font-medium text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
      >
        再試行
      </button>
    </div>
  )
}

/* === ローディング（シマースケルトン） === */
function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <span className="sr-only">検索中...</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-3"
        >
          <div className="skeleton h-14 w-14 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3 rounded" />
            <div className="skeleton h-3 w-1/4 rounded" />
          </div>
          <div className="skeleton h-7 w-8 rounded" />
        </div>
      ))}
    </div>
  )
}

/* === 検索履歴 === */
function SearchHistory({
  history,
  onSelect,
  onRemove,
  onClear,
}: {
  history: string[]
  onSelect: (label: string) => void
  onRemove: (label: string) => void
  onClear: () => void
}) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <span className="text-3xl opacity-40" aria-hidden="true">
          🕐
        </span>
        <p className="text-sm text-[var(--color-text-secondary)]">検索履歴はまだありません</p>
      </div>
    )
  }

  return (
    <section aria-label="検索履歴">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          最近の検索
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-[var(--color-text-tertiary)] transition-colors duration-200 hover:text-[var(--color-error)]"
        >
          全削除
        </button>
      </div>

      <ul className="divide-y divide-[var(--color-border-subtle)] overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]">
        {history.map((label) => (
          <li key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => onSelect(label)}
              className="flex flex-1 items-center gap-3 px-4 py-3 text-left text-sm text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
            >
              <span className="text-[var(--color-text-tertiary)]" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span className="truncate">{label}</span>
            </button>
            <button
              type="button"
              onClick={() => onRemove(label)}
              aria-label={`「${label}」を履歴から削除`}
              className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-colors duration-200 hover:bg-[var(--color-bg-overlay)] hover:text-[var(--color-text-primary)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
