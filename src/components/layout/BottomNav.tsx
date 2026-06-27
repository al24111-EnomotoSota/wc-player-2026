'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/lib/nav'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-[var(--color-bg-surface)]/90 backdrop-blur-md border-t border-[var(--color-border-subtle)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(3.5rem + env(safe-area-inset-bottom))' }}
      aria-label="メインナビゲーション"
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors duration-200 ${
              active ? 'text-[var(--color-gold-400)]' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {active && (
              <span
                className="absolute top-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-gold-400)]"
                aria-hidden="true"
              />
            )}
            {icon(active)}
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
