# 2026 W杯 選手図鑑

2026 FIFA ワールドカップ出場選手の情報を閲覧できる日本語の「選手図鑑」Web サイトです。

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 + shadcn/ui |
| データベース | Supabase (PostgreSQL) |
| PWA | Serwist |
| デプロイ | Vercel |
| リント/フォーマット | ESLint + Prettier |

## セットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/your-username/wc-player-2026.git
cd wc-player-2026
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開き、Supabase の URL・キーなどを入力してください。
各変数の取得方法は [tech-stack.md](./tech-stack.md) を参照してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 利用可能なコマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（ホットリロード有効） |
| `npm run build` | 本番用ビルドを生成 |
| `npm run start` | 本番ビルドを起動 |
| `npm run lint` | ESLint でコードチェック |
| `npm run format` | Prettier でコードフォーマット |
| `npm run format:check` | フォーマットのチェックのみ（変更なし） |

## プロジェクト構成

```
src/
├── app/              # App Router ページ・レイアウト
│   ├── layout.tsx    # ルートレイアウト
│   ├── page.tsx      # トップページ
│   ├── manifest.ts   # PWA マニフェスト
│   └── globals.css   # グローバルスタイル（デザイントークン）
├── components/       # 共有コンポーネント（今後追加）
├── lib/              # ユーティリティ・DB クライアント（今後追加）
└── sw.ts             # Serwist Service Worker エントリーポイント
public/
├── icons/            # PWA アイコン（今後追加）
└── sw.js             # ビルド後に生成される Service Worker
```

## 設計ドキュメント

- [requirements.md](./requirements.md) — 要件定義書
- [tech-stack.md](./tech-stack.md) — 技術選定書
- [system-design.md](./system-design.md) — システム設計書
- [ui-design.md](./ui-design.md) — UI デザイン設計書

## デプロイ

Vercel にデプロイするには以下の手順：

1. [Vercel](https://vercel.com) でリポジトリをインポート
2. 環境変数を Vercel ダッシュボードに設定
3. `main` ブランチへのプッシュで自動デプロイ

## ライセンス

MIT
