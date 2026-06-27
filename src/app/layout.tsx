import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, Noto_Serif_JP, Barlow_Condensed } from 'next/font/google'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { InstallPromptLoader } from '@/components/pwa/InstallPromptLoader'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: false,
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-noto-serif',
  display: 'swap',
  preload: false,
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | 2026 W杯 選手図鑑',
    default: '2026 W杯 選手図鑑',
  },
  description: '2026 FIFA ワールドカップ出場選手の情報を閲覧できる日本語の選手図鑑',
  keywords: ['ワールドカップ', '2026', 'FIFA', '選手', 'サッカー'],
  applicationName: '2026 W杯 選手図鑑',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'W杯図鑑',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#08080A',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${notoSansJP.variable} ${notoSerifJP.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <head>
        {/* テーマのフラッシュ防止: 描画前に localStorage を読んで data-theme をセット */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})()`,
          }}
        />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          {/* モバイルヘッダー（lg 以上で非表示） */}
          <Header />

          {/* デスクトップサイドバー（lg 未満で非表示） */}
          <Sidebar />

          {/* メインコンテンツエリア */}
          <div className="lg:ml-56">
            <main
              className="min-h-screen pt-14 pb-14 lg:pt-0 lg:pb-0 animate-[page-enter_200ms_ease-out]"
            >
              {children}
            </main>
            <Footer />
          </div>

          {/* モバイルボトムナビ（lg 以上で非表示） */}
          <BottomNav />

          {/* PWA インストール促進バナー（遅延読み込み） */}
          <InstallPromptLoader />
        </ThemeProvider>
      </body>
    </html>
  )
}
