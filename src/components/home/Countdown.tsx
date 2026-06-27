'use client'

import { useEffect, useState } from 'react'

// 開幕日（2026 FIFA ワールドカップ）
const KICKOFF = new Date('2026-06-11T00:00:00Z').getTime()

export function Countdown() {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      const diff = KICKOFF - Date.now()
      setDays(Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }
    update()
    const timer = setInterval(update, 1000 * 60 * 60) // 1時間ごと
    return () => clearInterval(timer)
  }, [])

  if (days === null) {
    return <span className="text-[var(--color-text-tertiary)]">— </span>
  }

  if (days > 0) {
    return (
      <span>
        開幕まで{' '}
        <span className="font-[family-name:var(--font-numeric)] text-2xl font-bold text-[var(--color-gold-400)]">
          {days}
        </span>{' '}
        日
      </span>
    )
  }

  return <span className="font-bold text-[var(--color-green-500)]">開催中</span>
}
