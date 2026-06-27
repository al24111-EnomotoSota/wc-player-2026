'use client'

import dynamic from 'next/dynamic'

/**
 * InstallPrompt を初期バンドルから切り離して遅延読み込みする。
 * - ssr: false … サーバー描画に含めない（window/navigator 依存のクライアント専用）
 * - 初回ペイントに不要な PWA バナーのコードを別チャンク化し、初期 JS を削減
 */
const InstallPrompt = dynamic(
  () => import('./InstallPrompt').then((m) => m.InstallPrompt),
  { ssr: false },
)

export function InstallPromptLoader() {
  return <InstallPrompt />
}
