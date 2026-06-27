'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/nav'
import { ThemeToggle } from './ThemeToggle'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-56 flex-col bg-[var(--color-bg-surface)] border-r border-[var(--color-border-subtle)]"
      aria-label="サイドバーナビゲーション"
    >
      {/* ロゴ */}
      <div className="h-16 flex items-center px-5 border-b border-[var(--color-border-subtle)] shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="ホームへ戻る">
          <span className="text-2xl" aria-hidden="true">🏆</span>
          <div className="font-[family-name:var(--font-heading)] leading-tight">
            <div className="text-xs text-[var(--color-text-secondary)] font-normal">2026 FIFA</div>
            <div className="text-sm font-bold text-[var(--color-gold-400)] group-hover:text-[var(--color-gold-300)] transition-colors duration-200">
              W杯 選手図鑑
            </div>
          </div>
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[var(--color-bg-overlay)] text-[var(--color-gold-400)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {icon(active)}
              <span>{label}</span>
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full bg-[var(--color-gold-400)]" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* テーマ切替 */}
      <div className="p-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between shrink-0">
        <span className="text-xs text-[var(--color-text-tertiary)]">テーマ</span>
        <ThemeToggle />
      </div>
    </aside>
  )
}
