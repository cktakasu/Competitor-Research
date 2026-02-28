# メーカー追加ワークフロー

## 説明
新しいメーカー（ABBまたはSIEMENS）のデータを追加する際の手順。

## ステップ

### Step 1: メーカー設定の追加
`src/config/manufacturers.ts` に新メーカーのエントリを追加する。
- id, displayName, accentColor, status ("active" or "coming_soon") を定義

### Step 2: シリーズデータの作成
`src/data/manufacturers/{manufacturer_id}/series.json` を作成する。
既存のSchneiderのスキーマに完全準拠すること。
各シリーズの market_category は `src/data/market-categories.json` の id と一致させる。

### Step 3: 型番データの作成
`src/data/manufacturers/{manufacturer_id}/mcb/` 配下にシリーズ別JSONファイルを作成する。
ファイル名はシリーズIDに一致させる（例: `s200.json`）。
全フィールドは `src/lib/types.ts` の `ProductModel` 型に準拠すること。

### Step 4: メーカータブの有効化
`manufacturers.ts` の当該メーカーの status を "active" に変更。
UIタブが自動的に有効化されることを確認する。

### Step 5: 動作確認
以下を確認する:
- シリーズカード画面でメーカータブ切替が機能すること
- 新メーカーのカードが正しい市場カテゴリに表示されること
- データグリッドに正しくデータが表示されること
- フィルタリング・ソートが正常に動作すること
- 既存のSchneiderデータに影響がないこと
