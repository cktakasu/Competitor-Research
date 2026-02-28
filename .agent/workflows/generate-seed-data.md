# シードデータ生成ワークフロー

## 説明
MCBドメイン知識スキル（.agent/skills/mcb-domain-knowledge/）のresourcesを参照し、
各メーカーのシリーズデータおよび型番データのJSONファイルを生成する。

## ステップ

### Step 1: ドメイン知識の確認
`.agent/skills/mcb-domain-knowledge/resources/` 配下の該当メーカーのmdファイルを読み込む。

### Step 2: series.json の生成
resourcesに記載されたシリーズ情報をもとに、`src/data/manufacturers/{manufacturer_id}/series.json` を生成する。
スキーマは `project-requirements.md` セクション4.1に準拠。

### Step 3: 型番データの生成
各シリーズについて、代表的な型番（各トリップカーブ×主要定格電流の組み合わせ）のサンプルデータを生成する。
1シリーズにつき最低10〜20レコードを作成する。
スキーマは `project-requirements.md` セクション4.2に準拠。

### Step 4: データの検証
- 全JSONファイルがパース可能であることを確認
- TypeScriptの型定義（`src/lib/types.ts`）と整合していることを確認
- `manufacturer_id` が `manufacturers.ts` と一致していることを確認
