'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa-install-dismissed'

/**
 * ホーム画面への追加（インストール）を促すバナー。
 * - Chrome/Edge/Android: beforeinstallprompt をフックし、ネイティブのインストールを起動
 * - iOS Safari: beforeinstallprompt 非対応のため、手動手順を案内
 * 一度閉じると LocalStorage に記録して再表示しない。
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 既に閉じられている / インストール済み（standalone）なら表示しない
    if (localStorage.getItem(DISMISS_KEY)) return
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return

    // iOS 判定
    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua)
    if (ios) {
      setIsIOS(true)
      setVisible(true)
      return
    }

    // Android/デスクトップ
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // インストール完了したらバナーを消す
    const installed = () => {
      setVisible(false)
      localStorage.setItem(DISMISS_KEY, '1')
    }
    window.addEventListener('appinstalled', installed)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(DISMISS_KEY, '1')
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') localStorage.setItem(DISMISS_KEY, '1')
    setDeferred(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="ホーム画面に追加"
      className="fixed inset-x-3 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] z-50 mx-auto max-w-md rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-overlay)] lg:bottom-4 lg:left-auto lg:right-4 lg:mx-0"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          🏆
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--color-text-primary)]">ホーム画面に追加</p>
          {isIOS ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              共有ボタンから「ホーム画面に追加」を選ぶと、アプリとして使えます
            </p>
          ) : (
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              アプリのようにすばやく起動。オフラインでも閲覧できます。
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="閉じる"
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-overlay)] hover:text-[var(--color-text-primary)]"
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
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {!isIOS && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={install}
            className="flex-1 rounded-full bg-[var(--color-gold-400)] px-4 py-2 text-sm font-bold text-[var(--color-text-inverse)] transition-colors duration-200 hover:bg-[var(--color-gold-300)]"
          >
            追加する
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)]"
          >
            あとで
          </button>
        </div>
      )}
    </div>
  )
}
