---
activation: always
---

# コーディング規約

## 一般ルール
- TypeScriptのstrict modeを有効にする
- `any` 型の使用を禁止する。必ず適切な型定義を行う
- コンポーネントは全てfunction componentで記述する（classは使わない）
- ファイル名はkebab-case（例: `series-card.tsx`）
- コンポーネント名はPascalCase（例: `SeriesCard`）
- 1ファイル1コンポーネントを原則とする

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 大分類選択（トップ）
│   ├── mcb/
│   │   ├── page.tsx        # 中分類シリーズ一覧
│   │   └── compare/
│   │       └── page.tsx    # 詳細データグリッド
│   └── layout.tsx
├── components/
│   ├── ui/                 # shadcn/ui のコンポーネント
│   ├── layout/             # Header, Footer, Navigation等
│   ├── cards/              # シリーズカード関連
│   └── grid/               # TanStack Table関連
├── config/
│   └── manufacturers.ts    # メーカー設定（カラー等）
├── data/
│   ├── market-categories.json
│   └── manufacturers/
│       └── schneider/
│           ├── series.json
│           └── mcb/
│               ├── acti9-ic60n.json
│               ├── acti9-ic60h.json
│               ├── acti9-ic60l.json
│               ├── acti9-ic40n.json
│               ├── multi9-c60sp.json
│               ├── resi9.json
│               ├── easy9.json
│               └── domae.json
├── lib/
│   ├── types.ts            # 全型定義
│   └── utils.ts            # ユーティリティ関数
└── hooks/                  # カスタムフック
```

## コメント
- 各コンポーネントファイルの冒頭にJSDocコメントで目的を記述
- 複雑なビジネスロジック（遮断容量の規格別表示ロジック等）には必ずインラインコメントを付与
- 日本語コメントを使用して構わない

## インポート順序
1. React / Next.js
2. 外部ライブラリ
3. 内部コンポーネント
4. 型定義
5. データ / 設定ファイル
