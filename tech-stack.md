# 技術選定書 — 2026 W杯 選手図鑑 Webアプリ

> バージョン: 0.1  
> 作成日: 2026-06-27  
> 方針: **初心者でも保守できる・無料枠で始められる・長期運営に耐える**

---

## 選定サマリー（一覧）

| カテゴリ | 採用技術 | 備考 |
|----------|----------|------|
| フロントエンド | Next.js 15 + TypeScript | App Router、SSG/ISR |
| バックエンド | Next.js Route Handlers | 同一リポジトリ、別サーバー不要 |
| データベース | Supabase (PostgreSQL) | GUI・自動型生成・無料枠あり |
| 認証 | なし（MVP） → Clerk（将来） | 閲覧専用なので不要 |
| 状態管理 | Zustand + URL パラメータ | 最小限のクライアント状態 |
| スタイリング | Tailwind CSS + shadcn/ui | コピペコンポーネント、型安全 |
| PWA | Serwist | App Router 対応の Service Worker |
| デプロイ | Vercel | Next.js 公式ホスト、CDN 込み |
| AI | Vercel AI SDK + Claude API | 将来の検索強化・要約機能 |
| キャッシュ | Next.js fetch cache + Upstash Redis | ISR でページ静的化 |
| ロギング | Sentry + Vercel Logs | エラー追跡・リアルタイムログ |
| 分析ツール | Google Analytics 4 + Vercel Analytics | AdSense 連携・Core Web Vitals |

---

## 1. フロントエンド

### 採用: **Next.js 15 (App Router) + TypeScript**

```
next@15 / react@19 / typescript@5
```

**採用理由**

| 観点 | 内容 |
|------|------|
| SEO | `generateStaticParams` で選手ページを全件 SSG 生成。Googleが最速でインデックス |
| ISR | `revalidate` を設定するだけで「一定時間後に再生成」が実現。大会中のデータ更新に使える |
| 学習コスト | 日本語ドキュメント・YouTube 解説が豊富。初心者が詰まったときに情報を見つけやすい |
| TypeScript | 型があることで「何を渡せばいいか」がエディタで即わかる。長期保守のバグを減らす |

**却下した選択肢**

| 技術 | 却下理由 |
|------|----------|
| Astro | 静的特化で爆速だが、将来の動的機能（リアルタイム成績）への拡張が難しい |
| Nuxt 3 (Vue) | 技術自体は優秀だが、Next.js より日本語の解説記事が少なく、初心者が困りやすい |
| Remix | SSR 特化で SEO は良いが、Vercel + Next.js の組み合わせほど事例が多くない |

---

## 2. バックエンド

### 採用: **Next.js Route Handlers（API Routes）**

```
app/api/players/route.ts
app/api/teams/route.ts
```

**採用理由**

- フロントと**同一リポジトリ・同一デプロイ**。別途サーバーを立てる必要がない
- 外部 API（API-Football 等）へのリクエストをサーバーサイドで行い、**APIキーをフロントに漏らさない**
- Vercel の Serverless Functions として自動デプロイされる
- このサイトの「バックエンド」は主に「DB から取得して返す」だけなので、専用フレームワークは過剰

**将来的な見直しポイント**

- スタッツ処理が複雑化した場合は **Hono**（軽量 Web フレームワーク）を別 API として切り出す選択肢がある

---

## 3. データベース

### 採用: **Supabase (PostgreSQL)**

**採用理由**

| 機能 | 内容 |
|------|------|
| GUI 管理画面 | ブラウザから SQL を書かずにデータを閲覧・編集できる。初心者に優しい |
| 型の自動生成 | `supabase gen types typescript` コマンドで DB スキーマから TypeScript 型を自動生成 |
| REST API | Next.js からは `@supabase/supabase-js` を使うだけ。ORM 不要 |
| 無料枠 | DB 容量 500MB・月間アクティブユーザー 50,000 まで無料 |
| スケール | 将来有料プランへの移行がシームレス |

**スキーマ概要（想定）**

```sql
players     -- 選手マスタ（id, name_ja, name_en, team_id, position, club, ...）
teams       -- 代表チームマスタ（id, name_ja, name_en, group_id, flag_url, ...）
groups      -- グループ情報（A〜L）
matches     -- 試合結果（試合日・スコア・グループ）
stats       -- 大会成績（player_id, goals, assists, minutes, ...）
```

**却下した選択肢**

| 技術 | 却下理由 |
|------|----------|
| Firebase Firestore | NoSQL のため JOIN 相当の処理が面倒。選手×チーム×成績の関係データに向かない |
| Neon (PostgreSQL) | 純粋な PostgreSQL で優秀だが、GUI 管理や型生成が Supabase ほど整っていない |
| PlanetScale | MySQL 系。サービス縮小の動向あり、長期運営の観点でリスク |

---

## 4. 認証

### MVP: **なし**
### 将来（Phase 4）: **Clerk**

**MVP で不要な理由**

要件定義どおり閲覧専用サイト。認証機能を入れると攻撃面が増える・コストが増える・実装が複雑になる、のデメリットしかない。

**将来 Clerk を選ぶ理由**

| 観点 | 内容 |
|------|------|
| 実装コスト | `<SignIn />` コンポーネントを置くだけでログインUIが完成する |
| Next.js 対応 | App Router ミドルウェアと完全対応 |
| 無料枠 | MAU 10,000 まで無料 |
| 用途 | お気に入り機能・コメント機能を追加する際に導入 |

---

## 5. 状態管理

### 採用: **Zustand + URL 検索パラメータ**

**設計方針**

```
サーバーサイドのデータ（選手・チーム） → Next.js Server Components が直接 DB から取得
クライアントサイドの状態（フィルタ・UI） → URL パラメータ or Zustand
```

**役割分担**

| 状態の種類 | 管理方法 | 例 |
|------------|----------|----|
| フィルタ・検索ワード | URL クエリパラメータ | `/players?team=JPN&pos=FW` |
| モーダル開閉・UIの状態 | Zustand | ハンバーガーメニュー open/close |
| グローバルな通知 | Zustand | エラートースト |

**URL パラメータを選ぶ理由**

- ブラウザの戻るボタンが機能する
- フィルタ状態をそのままブックマーク・シェアできる
- SEO 上の利点（クローラーがフィルタ状態のページを認識できる）

**Zustand を選ぶ理由**

- API：`const count = useStore(s => s.count)` の一行だけ。Redux のような定型文不要
- バンドルサイズが極めて小さい（約 1KB）

**却下した選択肢**

| 技術 | 却下理由 |
|------|----------|
| Redux Toolkit | このサイトの規模では過剰。学習コストが高い |
| React Context | 再レンダリング制御が難しく、規模が大きくなると問題が起きやすい |
| Jotai | Zustand より原子的で良いが、チームに Zustand の方が浸透している |

---

## 6. スタイリング

### 採用: **Tailwind CSS v4 + shadcn/ui**

**Tailwind CSS を選ぶ理由**

| 観点 | 内容 |
|------|------|
| 生産性 | HTML を書きながら同時にスタイリングできる。ファイル切り替えが不要 |
| 保守性 | 使われていないスタイルを探す必要がない（クラスが HTML に直書き） |
| ビルドサイズ | 使ったクラスだけが CSS に含まれる。不要なスタイルは自動削除 |
| バージョン | v4 は設定ファイル不要でさらにシンプル |

**shadcn/ui を選ぶ理由**

- コンポーネントを**プロジェクトにコピー**する方式（npm install ではない）
- Card・Button・Badge・Table・Input などが最初から WCAG 対応済み
- デザインが洗練されており、初心者でもプロっぽい見た目になる
- カスタマイズが自由（コピーしたコードを直接編集する）

**使用コンポーネントの例**

```
Card        → 選手カード
Badge       → ポジション表示（FW/MF/DF/GK）
Input       → 検索バー
Select      → 国・ポジションフィルタ
Table       → グループステージ成績表
Skeleton    → ローディング中のプレースホルダー
```

**却下した選択肢**

| 技術 | 却下理由 |
|------|----------|
| CSS Modules | コンポーネントファイルとスタイルファイルの二重管理が手間 |
| styled-components | ランタイム CSS-in-JS は App Router の Server Components と相性が悪い |
| Mantine UI | 良質なライブラリだが、Tailwind と並行使用すると設定が複雑 |

---

## 7. PWA

### 採用: **Serwist**

```
@serwist/next
```

**採用理由**

- `next-pwa` は Next.js 14 以降の App Router に対応しておらず、実質メンテ停止状態
- Serwist は `next-pwa` の後継として開発されており、App Router に正式対応
- 設定は `serwist.config.ts` 一ファイルで完結する

**PWA で実現できること**

| フェーズ | 機能 |
|----------|------|
| MVP | インストール（Add to Home Screen）・基本オフライン対応 |
| Phase 2 | 一度見た選手ページをオフラインでも閲覧可能 |
| Phase 4 | Web Push Notifications（試合前アラート） |

**注意点**: iOS Safari の Web Push は iOS 17 以降のみ対応。Android Chrome は問題なし。

---

## 8. デプロイ

### 採用: **Vercel**

**採用理由**

| 観点 | 内容 |
|------|------|
| ゼロ設定 | GitHub に push するだけでデプロイ完了。設定ファイル不要 |
| Preview Deploy | PR を作成すると自動でプレビュー URL が発行される。変更確認が簡単 |
| CDN | エッジロケーションが世界中にあり、日本からのアクセスも高速 |
| 無料枠 | 趣味・小規模サイトなら無料枠でほぼ運用可能 |
| Next.js との相性 | Vercel が Next.js の開発元。機能サポートが最速 |

**無料枠の制限（Hobby プラン）**

| 項目 | 制限 |
|------|------|
| Serverless Functions 実行時間 | 10 秒 / リクエスト |
| Edge Functions | 制限あり |
| 帯域幅 | 100 GB / 月 |
| ビルド時間 | 6000 分 / 月 |

> W杯期間中にアクセスが急増した場合は、Pro プラン（$20/月）への移行を検討する。

**却下した選択肢**

| 技術 | 却下理由 |
|------|----------|
| Cloudflare Pages | 高速・安価だが、Next.js の一部機能（ISR 等）が未サポートの場合がある |
| AWS Amplify | 設定が複雑。初心者には敷居が高い |
| Netlify | 良いサービスだが、Next.js サポートは Vercel に劣る |

---

## 9. AI

### 採用: **Vercel AI SDK + Claude API（Haiku）**

> MVP では使わない。Phase 2 以降で段階的に導入する。

**想定するAI機能**

| 機能 | 説明 | 優先度 |
|------|------|--------|
| スマート検索 | 「ベルギーのFWで長身の選手」のような自然文検索 | Phase 2 |
| 選手サマリー | 選手の特徴・見どころを日本語で自動生成 | Phase 2 |
| チャットQ&A | 「今大会の注目選手は？」に答える簡易チャット | Phase 3 |

**Claude Haiku を選ぶ理由**

- 日本語の生成精度が高い
- Haiku は最も安価（入力 $0.80/MTok・出力 $4.00/MTok）
- 短いテキスト生成（選手サマリー等）には十分な品質

**Vercel AI SDK を使う理由**

- Next.js との統合が最もシンプル（Server Actions から直接呼び出せる）
- ストリーミング対応がデフォルトで組み込まれている

**実装イメージ**

```typescript
// app/api/player-summary/route.ts
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { playerName, stats } = await req.json()
  
  const result = streamText({
    model: anthropic('claude-haiku-4-5'),
    prompt: `${playerName}（${stats}）の特徴を日本語で100字以内で説明してください。`,
  })
  
  return result.toDataStreamResponse()
}
```

---

## 10. キャッシュ

### 採用: **Next.js 内蔵キャッシュ（ISR）+ Upstash Redis**

**二層構造**

```
ブラウザ → Vercel CDN（エッジキャッシュ）→ Next.js ISR キャッシュ → Upstash Redis → Supabase
```

**Next.js の ISR（Incremental Static Regeneration）**

選手ページ・チームページは静的生成（SSG）し、一定時間後に自動再生成する。

```typescript
// app/players/[id]/page.tsx
export const revalidate = 3600 // 1時間ごとに再生成

async function PlayerPage({ params }: { params: { id: string } }) {
  const player = await getPlayer(params.id) // ビルド時に実行、1時間キャッシュ
  return <PlayerProfile player={player} />
}
```

**Upstash Redis を使う場面**

| 用途 | 内容 |
|------|------|
| API レート制限 | 外部 API（API-Football）の呼び出し上限を Redis で管理 |
| 検索結果キャッシュ | 同じ検索ワードへのリクエストを Redis に短時間キャッシュ |
| セッション横断状態 | Serverless Functions 間で共有が必要な状態 |

**Upstash Redis を選ぶ理由**: サーバーレス向けに設計されており、Vercel Functions と相性が良い。無料枠（10,000 コマンド/日）あり。

---

## 11. ロギング

### 採用: **Sentry（エラー追跡）+ Vercel Logs（アプリログ）**

**役割分担**

| ツール | 役割 | 確認するもの |
|--------|------|-------------|
| **Sentry** | エラー追跡 | JavaScript 例外・API エラー・パフォーマンス問題 |
| **Vercel Logs** | リアルタイムログ | サーバーサイドの `console.log` 出力 |

**Sentry を選ぶ理由**

- エラーが発生したときに**スタックトレース・ユーザー環境・発生頻度**を一覧で確認できる
- Next.js の公式統合があり、`withSentryConfig` を設定するだけで自動計装
- 無料枠：エラーイベント 5,000件/月・パフォーマンス 10,000件/月

**Sentry の設定例**

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% のリクエストをトレース（コスト節約）
})
```

**Vercel Logs の活用**

- ダッシュボードからリアルタイムでログを確認
- 追加費用なし・設定不要

---

## 12. 分析ツール

### 採用: **Google Analytics 4 + Vercel Analytics**

**役割分担**

| ツール | 役割 | 主な用途 |
|--------|------|---------|
| **Google Analytics 4** | 詳細な行動分析 | どの選手ページが人気か・流入元・AdSense 連携 |
| **Vercel Analytics** | Core Web Vitals 監視 | LCP・CLS・INP を実際のユーザーデータで計測 |

**GA4 を選ぶ理由**

- **AdSense と連携必須**：収益化後に広告パフォーマンスと訪問者データを紐付けられる
- 無料・業界標準
- 「どの選手ページが最も閲覧されているか」がわかり、コンテンツ戦略に活用できる

**Vercel Analytics を選ぶ理由**

- **Cookie 不要**（プライバシー規制に引っかかりにくい）
- Vercel ダッシュボードで Core Web Vitals を国別・デバイス別に確認できる
- Hobby プランでも基本機能は無料

**AdSense 導入時の注意**

```
AdSense 申請要件：
✓ 独自ドメインを所有していること
✓ プライバシーポリシーページがあること
✓ Cookie 同意バナーを設置していること（EU向け）
✓ コンテンツが十分にあること（ページ数・文字数）
```

---

## アーキテクチャ全体図

```
┌─────────────────────────────────────────────────┐
│  ユーザー（スマホ / PC）                          │
└─────────────┬───────────────────────────────────┘
              │ HTTPS
┌─────────────▼───────────────────────────────────┐
│  Vercel CDN（エッジキャッシュ・静的配信）          │
│  ├── 静的ページ (SSG) → 選手詳細・チームページ    │
│  └── 動的ページ (SSR) → 検索結果・リアルタイム    │
└─────────────┬───────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────┐
│  Next.js 15 (App Router)                        │
│  ├── Server Components（DB 直接取得）             │
│  ├── Client Components（フィルタ・UI）            │
│  ├── Route Handlers（API エンドポイント）          │
│  └── Serwist（Service Worker / PWA）             │
└──────┬──────────────────┬────────────────────────┘
       │                  │
┌──────▼──────┐   ┌───────▼──────┐
│  Supabase   │   │ Upstash Redis│
│ (PostgreSQL)│   │   (キャッシュ) │
└─────────────┘   └──────────────┘
       │
┌──────▼──────────────────┐
│  外部 API               │
│  ├── API-Football       │
│  └── Claude API (AI)    │
└─────────────────────────┘
```

---

## 月額コスト見込み（MVP 〜 Phase 2）

| サービス | 無料枠 | 超過時の概算 |
|----------|--------|-------------|
| Vercel (Hobby) | 無料 | Pro: $20/月 |
| Supabase (Free) | 無料 | Pro: $25/月 |
| Upstash Redis | 10,000 cmd/日まで無料 | Pay-as-you-go |
| Sentry | 無料 | Team: $26/月 |
| API-Football | 100 req/日まで無料 | Basic: $10/月 |
| Claude API | 使った分だけ | Haiku: 〜$1〜3/月（小規模） |
| **合計（MVP）** | **ほぼ $0** | **Phase 2: 約 $35〜60/月** |

---

*このドキュメントは要件定義書 `requirements.md` と対になっています。実装着手前に両方を確認してください。*
