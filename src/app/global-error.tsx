'use client'

import { useEffect } from 'react'

/**
 * ルートレイアウト自体で発生した致命的エラーのフォールバック。
 * 独自に <html>/<body> を描画する必要があるため、最小限のインラインスタイルで構成。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: '#08080A',
          color: '#F2F2F7',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '1.5rem',
        }}
      >
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          エラーが発生しました
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#8E8E9A', maxWidth: '20rem' }}>
          アプリの読み込み中に問題が発生しました。ページを再読み込みしてください。
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: '0.5rem',
            border: 'none',
            borderRadius: '9999px',
            backgroundColor: '#D4AF37',
            color: '#08080A',
            fontWeight: 700,
            fontSize: '0.875rem',
            padding: '0.625rem 1.5rem',
            cursor: 'pointer',
          }}
        >
          再読み込み
        </button>
      </body>
    </html>
  )
}
