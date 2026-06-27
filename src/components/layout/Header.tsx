'use client'

import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-[var(--color-bg-surface)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
      <Link
        href="/"
        className="flex items-center gap-2"
        aria-label="ホームへ戻る"
      >
        <span className="text-[var(--color-gold-400)] text-xl" aria-hidden="true">
          🏆
        </span>
        <span
          className="font-[family-name:var(--font-heading)] text-sm font-bold leading-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          W杯<br />
          <span className="text-[var(--color-gold-400)]">選手図鑑</span>
        </span>
      </Link>
      <ThemeToggle />
    </header>
  )
}
