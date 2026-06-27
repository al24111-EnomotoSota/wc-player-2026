import Link from 'next/link'
import { Countdown } from '@/components/home/Countdown'

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
      {/* ヒーロー */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-gradient-to-b from-[var(--color-bg-elevated)] to-[var(--color-bg-surface)] px-6 py-12 text-center shadow-[var(--shadow-gold)]">
        <p className="font-[family-name:var(--font-numeric)] text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-400)]">
          FIFA WORLD CUP
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-bold text-[var(--color-text-primary)] sm:text-5xl">
          2026
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          出場選手をまるごと調べられる、日本語の選手図鑑
        </p>
        <p className="mt-6 text-sm text-[var(--color-text-primary)]">
          <Countdown />
        </p>
        <Link
          href="/search"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-gold-400)] px-7 py-3 text-sm font-bold text-[var(--color-text-inverse)] transition-colors duration-200 hover:bg-[var(--color-gold-300)]"
        >
          ✦ 選手を探す
        </Link>
      </section>

      {/* 機能カード */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FeatureCard
          href="/search"
          icon="🔍"
          title="選手を検索"
          desc="国名・背番号から出場選手を探す"
        />
        <FeatureCard
          href="/favorites"
          icon="⭐"
          title="お気に入り"
          desc="気になる選手を保存して見返す"
        />
      </section>

      <p className="mt-8 text-center text-xs text-[var(--color-text-tertiary)]">
        データ提供: API-Football / Wikidata ・ AI 分析: Google Gemini
      </p>
    </div>
  )
}

function FeatureCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string
  icon: string
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-gold)]"
    >
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-[family-name:var(--font-heading)] font-bold text-[var(--color-text-primary)]">
          {title}
        </p>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{desc}</p>
      </div>
    </Link>
  )
}
