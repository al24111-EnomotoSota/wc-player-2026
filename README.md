# ⚽ 2026 W杯 選手図鑑

2026 FIFA ワールドカップ出場選手を、国名・背番号から検索できる日本語の「選手図鑑」Web アプリです。
スマホにインストールして使える PWA で、AI による選手分析も表示します。

## 主な機能

- 🔍 **選手検索** — 国名・背番号でしぼり込み
- 👤 **選手詳細** — 名前・身長・体重・国旗・代表・クラブ・成績・移籍履歴
- ✦ **AI 選手分析** — プレースタイル・特徴を自動生成（Google Gemini）
- ⭐ **お気に入り** — 端末に保存して一覧表示
- 🕐 **検索履歴** — 直近 10 件を保存
- 📱 **PWA** — ホーム画面に追加・オフライン表示対応

---

## 🚀 はじめての方へ：デプロイまでの全体像

このアプリを「自分専用の公開サイト」にする流れは、ざっくり次の 4 ステップです。

```
① 必要なものを準備（Node.js・アカウント類）
        ↓
② API キーを 2 つ取得（無料）
        ↓
③ GitHub にコードを置く
        ↓
④ Vercel で公開（数分・無料）
```

> 急ぐ場合：すでに Node.js・GitHub・Vercel に慣れているなら、[最短デプロイ手順](#-最短デプロイ手順上級者向け)へ。

---

## ① 必要なものを準備

| 必要なもの | 用途 | 入手先 |
|------------|------|--------|
| **Node.js 20 以上** | ローカルで動かす・ビルドする | [nodejs.org](https://nodejs.org/)（LTS版を推奨） |
| **Git** | コードを GitHub に送る | [git-scm.com](https://git-scm.com/) |
| **GitHub アカウント** | コードの保管場所 | [github.com](https://github.com/)（無料） |
| **Vercel アカウント** | サイトの公開先 | [vercel.com](https://vercel.com/)（無料・GitHub でログイン可） |

> Node.js が入っているか確認するには、ターミナル（Windows は PowerShell）で `node -v` と入力します。`v20.x` 以上が表示されれば OK です。

---

## ② API キーを 2 つ取得（どちらも無料）

このアプリは外部サービスを 2 つ使います。**どちらもクレジットカード不要**です。

### (A) API-Football（選手データ）

1. [https://dashboard.api-football.com/register](https://dashboard.api-football.com/register) にアクセスして登録
2. 確認メールのリンクをクリックして有効化
3. ログイン後、ダッシュボードの **「Account」→「My Access」** に表示される **API キー**をコピー
   - 無料プランは **1 日 100 リクエスト**まで（個人利用なら十分）

### (B) Google Gemini（AI 分析）

1. [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) に Google アカウントでログイン
2. **「Create API key」**（API キーを作成）をクリック
3. 表示された **API キー**をコピー
   - 無料枠で利用できます（クレカ登録不要）

> 取得した 2 つのキーは、このあと「ローカル」と「Vercel」の両方で使います。メモしておきましょう。

---

## ③ ローカルで動かしてみる（任意・おすすめ）

公開前に、自分のパソコンで動作を確認できます。

### 1. コードを入手

```bash
git clone https://github.com/＜あなたのユーザー名＞/wc-player-2026.git
cd wc-player-2026
```

### 2. 必要なライブラリをインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.example` をコピーして `.env.local` を作ります。

```bash
# Mac / Linux
cp .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local
```

`.env.local` をテキストエディタで開き、②で取得したキーを貼り付けます。

```bash
API_FOOTBALL_KEY=ここに API-Football のキー
GEMINI_API_KEY=ここに Gemini のキー
```

### 4. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開けば動作確認できます。

> `.env.local` は Git に含まれません（キーが外部に漏れない設計）。安心して書き込んでください。

---

## ④ Vercel で公開する（初心者向け詳細手順）

### ステップ 1：コードを GitHub に置く

GitHub で空のリポジトリを作成します。

1. [github.com/new](https://github.com/new) を開く
2. **Repository name** に `wc-player-2026` などを入力
3. 「Add a README file」などの**チェックは付けない**（このプロジェクトに既にあるため）
4. **「Create repository」**をクリック

次に、手元のコードを送ります（プロジェクトのフォルダ内で実行）。

```bash
git add .
git commit -m "初回コミット"
git branch -M main
git remote add origin https://github.com/＜あなたのユーザー名＞/wc-player-2026.git
git push -u origin main
```

> `remote add` で「already exists」と出たら、`git remote set-url origin ＜URL＞` に置き換えて実行してください。

### ステップ 2：Vercel にインポート

1. [vercel.com](https://vercel.com/) に **GitHub アカウントでログイン**
2. ダッシュボードで **「Add New…」→「Project」** をクリック
3. 先ほどの GitHub リポジトリの **「Import」** を押す
4. フレームワークは **Next.js が自動で選ばれます**（ビルド設定は変更不要 ※[vercel.json](./vercel.json) が自動適用）

### ステップ 3：環境変数を登録（重要）

インポート画面の **「Environment Variables」** を開き、②のキーを登録します。

| Name（名前） | Value（値） |
|--------------|-------------|
| `API_FOOTBALL_KEY` | API-Football のキー |
| `GEMINI_API_KEY` | Gemini のキー |

> 任意で `WIKIDATA_USER_AGENT`（連絡先入りの文字列）も登録できます。
> **ここで登録を忘れると、公開後に検索や AI が動きません**（あとから追加も可能。後述）。

### ステップ 4：デプロイ

**「Deploy」** をクリックして 1〜2 分待つと、公開 URL（`https://～.vercel.app`）が発行されます。 🎉

以降は **`main` ブランチに push するたびに自動で再デプロイ**されます。

---

## ✅ 公開後の動作チェック

発行された URL をスマホ／PC で開いて確認しましょう。

- **検索**：トップ →「選手を探す」→ 国名（例：`Japan`）で検索 → 一覧が出る
- **選手詳細**：検索結果をタップ → プロフィール・成績・移籍・AI 分析が表示される
- **お気に入り**：詳細の ⭐ をタップ →「お気に入り」タブに表示される
- **PWA**：スマホのブラウザメニュー →「ホーム画面に追加」でアプリ化

---

## 🔧 よくあるトラブルと対処

| 症状 | 原因 | 対処 |
|------|------|------|
| 検索で「API キーが設定されていません」 | `API_FOOTBALL_KEY` 未登録 | Vercel の Settings → Environment Variables に追加し、**再デプロイ** |
| AI 分析が出ない / 「生成できません」 | `GEMINI_API_KEY` 未登録、または無料枠の上限 | キーを登録、または時間をおいて再読み込み |
| 環境変数を足したのに反映されない | 変数は**デプロイ時に取り込まれる** | Vercel の Deployments → 最新の「…」→ **Redeploy** |
| 検索しても「該当なし」 | 国名は英語で部分一致（例：`Japan` `Brazil`） | 英語表記で試す |
| ビルドが Node のバージョンで失敗 | 古い Node | このプロジェクトは Node 20+ 指定済み（[.nvmrc](./.nvmrc)）。通常 Vercel は自動で適切な版を選択 |
| PWA がインストールできない | http や開発サーバーで開いている | 本番 URL（`https://～.vercel.app`）で開く |

> **環境変数を変更したら必ず「Redeploy」** が必要です（変数はビルド時に読み込まれるため）。

---

## 🧑‍💻 最短デプロイ手順（上級者向け）

```bash
# 1. GitHub に push
git add . && git commit -m "deploy" && git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main

# 2. vercel.com でリポジトリを Import
# 3. Environment Variables に API_FOOTBALL_KEY と GEMINI_API_KEY を登録
# 4. Deploy
```

ビルドは `next build --webpack` に固定済み（[vercel.json](./vercel.json)）。Node は `>=20`（[package.json](./package.json) / [.nvmrc](./.nvmrc)）。

---

## 環境変数リファレンス

| 変数 | 区分 | 用途 |
|------|------|------|
| `API_FOOTBALL_KEY` | **必須** | 選手・チーム・スタッツ・移籍データ |
| `GEMINI_API_KEY` | **必須** | AI 選手分析 |
| `WIKIDATA_USER_AGENT` | 任意 | Wikidata 連携の User-Agent（連絡先入り） |
| `API_FOOTBALL_HOST` | 任意 | RapidAPI 版を使う場合のみ（既定は直接版） |
| `GEMINI_MODEL` | 任意 | 使用モデル（既定 `gemini-2.0-flash`） |

- `NEXT_PUBLIC_` が付かない変数は**サーバー専用**で、ブラウザには露出しません（キーは安全）。
- Supabase / GA4 / Sentry / Upstash は **将来用**で現在のコードでは未使用です（[.env.example](./.env.example) 参照）。
- 必須が未設定でも**ビルド・起動は成功**します（検索・AI のみエラー表示になります）。

---

## 利用可能なコマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（Turbopack・ホットリロード） |
| `npm run build` | 本番ビルド（**webpack**。Serwist が Service Worker を生成） |
| `npm run build:turbo` | Turbopack ビルド（高速・**SW は生成されません**） |
| `npm run start` | 本番ビルドを起動 |
| `npm run test` | テストを実行（Vitest） |
| `npm run test:watch` | テストをウォッチ実行 |
| `npm run lint` | ESLint でコードチェック |
| `npm run format` | Prettier でコードフォーマット |

---

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フレームワーク | Next.js 16 (App Router) + TypeScript |
| スタイリング | Tailwind CSS v4 |
| データ取得 | API-Football / Wikidata |
| AI | Google Gemini |
| PWA | Serwist |
| テスト | Vitest + Testing Library |
| デプロイ | Vercel |
| リント/フォーマット | ESLint + Prettier |

> Supabase（DB）は設計上は採用予定ですが、現在のコードでは未使用です。

---

## プロジェクト構成

```
src/
├── app/                    # App Router（ページ・API・特殊ファイル）
│   ├── page.tsx            # トップページ
│   ├── layout.tsx          # 共通レイアウト（ヘッダー/ナビ/テーマ）
│   ├── search/             # 検索画面
│   ├── players/[id]/       # 選手詳細
│   ├── favorites/          # お気に入り一覧
│   ├── offline/            # オフライン時のフォールバック
│   ├── api/search/         # 検索 API（外部 API をサーバー側で呼ぶ）
│   ├── not-found.tsx       # 404
│   ├── error.tsx           # エラー境界（500 系）
│   ├── manifest.ts         # PWA マニフェスト
│   └── globals.css         # デザイントークン
├── components/             # UI コンポーネント（layout/player/common/pwa/home）
├── services/               # 外部 API クライアント（API-Football / Wikidata / Gemini）
├── hooks/                  # useFavorites / useSearchHistory / useSearch
├── constants/              # ポジション・国名マッピング
├── lib/                    # エラーメッセージ等のユーティリティ
├── types/                  # 型定義
└── sw.ts                   # Serwist Service Worker
public/
├── icons/                  # PWA アイコン
└── sw.js                   # ビルド時に生成される Service Worker（Git 管理外）
```

---

## 設計ドキュメント

- [requirements.md](./requirements.md) — 要件定義書
- [tech-stack.md](./tech-stack.md) — 技術選定書
- [system-design.md](./system-design.md) — システム設計書
- [ui-design.md](./ui-design.md) — UI デザイン設計書

---

## ライセンス

MIT
