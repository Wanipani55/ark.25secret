# 賞与計算ツール — Bonus Calculator

> 社内賃金規程（第５章・別紙１）に準拠した賞与計算Webアプリ  
> **アクセスURLを知っている人のみ利用可能**（パスワード認証付き）

---

## フォルダ構成

```
bonus-calculator/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Calculator.tsx      # メイン画面（フォーム＋レイアウト）
│   │   ├── FormInputs.tsx      # 入力コンポーネント群
│   │   ├── PasswordGate.tsx    # パスワード認証画面
│   │   └── ResultPanel.tsx     # 計算結果表示
│   ├── lib/
│   │   └── bonus.ts            # 賞与計算ロジック（賃金規程準拠）
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## インストール手順

### 前提条件
- Node.js 18以上
- npm または pnpm

```bash
# 1. リポジトリをクローン（またはフォルダに移動）
cd bonus-calculator

# 2. 依存パッケージをインストール
npm install

# 3. 環境変数ファイルを作成
cp .env.example .env.local
# .env.local を開き、VITE_APP_PASSWORD を任意のパスワードに変更
```

---

## 起動手順（ローカル開発）

```bash
npm run dev
# → http://localhost:5173 でアクセス可能
```

---

## ビルド手順

```bash
npm run build
# dist/ フォルダにビルド成果物が生成される

npm run preview
# ビルド結果をローカルでプレビュー
```

---

## Vercel デプロイ手順

### 前提
- GitHubアカウント・Vercelアカウント（無料プランでOK）

### 手順

#### 1. GitHubリポジトリを作成
```bash
cd bonus-calculator
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-org>/bonus-calculator.git
git push -u origin main
```

#### 2. Vercelにインポート
1. [vercel.com](https://vercel.com) にログイン
2. 「Add New Project」→ 「Import Git Repository」
3. `bonus-calculator` リポジトリを選択
4. Framework Preset: **Vite** が自動検出されます

#### 3. 環境変数を設定（重要）
Vercelの「Environment Variables」セクションで以下を追加：

| Name | Value |
|------|-------|
| `VITE_APP_PASSWORD` | 任意のパスワード（英数字推奨）|

> ⚠️ この設定をしないとデフォルトパスワード `bonus2024` が使われます

#### 4. Deploy
「Deploy」ボタンを押す → 数十秒でデプロイ完了

#### 5. アクセス制限について
Vercelの「Settings」→「Deployment Protection」で  
**Vercel Authentication（SSO）** をOFFのまま運用し、  
**URLを知っている人のみ** にURLを共有する運用となります。

> より厳密なアクセス制限が必要な場合は、Vercel Pro/Enterprise の  
> **Password Protection** 機能（有料）か、社内VPN経由のアクセスをご検討ください。

---

## 計算ロジックの概要

| 支給月 | 計算方式 |
|--------|---------|
| **6月** | 暫定賞与（上期・変動指数はD1固定） |
| **12月** | 暫定賞与（下期・変動指数はD1固定） |
| **翌年2月** | 本賞与 − 6月暫定 − 12月暫定 |

- **賞与係数** = 指数単価 ÷ 基準単価（250,000円）
  - 例）係数1.0 → 指数単価250,000円（基準単価に等しい）
  - 例）係数1.2 → 指数単価300,000円（基準単価超）
- 係数 > 1.0：一律単価＝基準単価、変動単価＝指数単価
- 係数 ≤ 1.0：一律単価＝変動単価＝指数単価

詳細は `src/lib/bonus.ts` を参照。
