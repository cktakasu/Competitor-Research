---
activation: always
---

# Competitive Intelligence Dashboard — 要件定義書

## 1. プロジェクト概要

### 1.1 目的
海外市場における低圧遮断器（MCB/MCCB/ACB）の競合メーカー製品ラインナップを
一元管理・可視化し、組織内の情報共有ハブとして機能させるWebアプリケーションを構築する。

最上位の目的は「競合のラインナップ戦略（誰に・何を・なぜ売ろうとしているか）を
組織全体で理解し、自社の機種戦略立案に直結するインサイトを得ること」である。

### 1.2 フェーズ構成
- **Phase 1（本フェーズ）**: 競合メーカーの製品ラインナップ理解ダッシュボード
  - 初期対象: Schneider Electric のMCBラインナップ
  - 拡張対象: ABB、SIEMENS（Schneider実装後に順次追加）
- **Phase 2（将来）**: 自社製品との比較機能、バトルカード生成、その他分析機能

### 1.3 ユーザー
- 低圧遮断器事業の海外市場マーケティング担当者
- 営業部門（海外案件担当）
- 製品企画・R&D部門（機種戦略検討時）

### 1.4 利用環境
- メインモニター: LG UltraGear 34WP60C-B（3440x1440 ウルトラワイド 21:9）
- サブモニター: DELL（2560x1440 16:9）
- ウルトラワイドの横幅を最大限に活かしたUI設計を必須とする

## 2. 技術スタック

### 2.1 フレームワーク
- **Next.js** (App Router) + **React 19** + **TypeScript**
- スタイリング: **Tailwind CSS** + **shadcn/ui**
- データグリッド: **TanStack Table v8**（列固定・フィルタリング・ソート必須）
- チャート: **Recharts**（散布図・バブルチャート・エリアチャート）
- 状態管理: **Zustand** または React Context（軽量に保つ）

### 2.2 データ管理
- Phase 1では **JSONファイル** をデータソースとする（DBは不要）
- `src/data/manufacturers/schneider/` 配下にシリーズ別JSONを配置
- 将来ABB・Siemens追加時は同構造で `abb/`、`siemens/` を追加
- JSONスキーマはセクション4で定義

### 2.3 デプロイ
- **Vercel** への静的デプロイを前提とする
- 認証: Phase 1では不要（社内IP制限またはVercel Password Protectionで対応）

## 3. 画面構成とUIフロー

### 3.1 全体構成（3階層のドリルダウン）

```
[大分類選択] → [中分類：シリーズ一覧] → [詳細：データグリッド]
```

### 3.2 画面1: 大分類選択（トップページ）
- `/` にアクセスすると表示
- 3つの大きなカードタイルを横並びで配置:
  - **ACB**（気中遮断器）— Phase 1では「Coming Soon」表示
  - **MCCB**（配線用遮断器）— Phase 1では「Coming Soon」表示
  - **MCB**（ミニチュアサーキットブレーカー）— アクティブ
- 各カードには製品カテゴリのアイコンまたはイラストを配置
- カードクリックで画面2へ遷移

### 3.3 画面2: 中分類 — シリーズ・ターゲティングビュー
- `/mcb` にアクセスすると表示
- 画面上部にメーカー切替タブを配置:
  - `[Schneider Electric]` `[ABB (Coming Soon)]` `[SIEMENS (Coming Soon)]`
- タブの下にシリーズ別の **カードUI** を市場カテゴリ別に配置

#### カードのグルーピング（市場カテゴリ）
カードは以下の市場カテゴリヘッダーの下にグループ化して並べる:

**Industrial / Commercial（産業・商業）:**
- Acti9 iC60 シリーズ（iC60N / iC60H / iC60L / iC40N）

**Global OEM / Multi-Standard（装置組込・グローバル）:**
- Multi9 C60SP シリーズ

**Residential / Small Business（住宅・小規模）:**
- Resi9 シリーズ

**Economy / Emerging Markets（エコノミー・新興国）:**
- Easy9 シリーズ
- Domae シリーズ

#### 各カードに表示する情報
1. **シリーズ名**（例: Acti9 iC60N）
2. **ターゲット市場タグ** — バッジ形式で表示
   例: `[商業ビル]` `[産業]` `[IEC 60947-2]`
3. **対応規格**（例: IEC 60947-2 / IEC 60898-1）
4. **遮断容量レンジ**
   - IEC 60947-2 Icu: XX kA @ 415V
   - IEC 60898-1 Icn: XXXX A
5. **定格電流レンジ**（例: 0.5A〜63A）
6. **トリップカーブ**（例: B, C, D）
7. **1行のコンセプト要約**（例:「産業・商業向けフラッグシップ。ダブルスタンダード対応で高い汎用性」）

#### カード操作
- 各カードにチェックボックスを配置（複数選択可）
- 画面下部に固定フッター:「選択したシリーズの詳細を比較する →」ボタン
- ボタンクリックで画面3へ遷移（選択シリーズのデータのみ表示）
- カード単体クリックでもそのシリーズ単独の画面3へ遷移可能

### 3.4 画面3: 詳細データグリッド
- `/mcb/compare?series=acti9-ic60n,multi9` のようなURLパラメータで表示
- TanStack Table を使用した高機能データグリッド

#### グリッドの列構成

**左側固定列:**

| # | 列名 | 備考 |
|---|---|---|
| 1 | メーカー名 | |
| 2 | シリーズ名 | |
| 3 | サブシリーズ名 | iC60N, iC60H等 |
| 4 | 型番 | |

**スクロール可能な列:**

| # | 列名 | 備考 |
|---|---|---|
| 5 | 極数 | 1P, 1P+N, 2P, 3P, 3P+N, 4P |
| 6 | 定格電流 In (A) | |
| 7 | トリップカーブ | B, C, D, K, Z |
| 8 | Icu @ 220-240V (kA) | IEC 60947-2 |
| 9 | Icu @ 380-415V (kA) | IEC 60947-2 |
| 10 | Icu @ 440V (kA) | IEC 60947-2 |
| 11 | Icn @ 230V (A) | IEC 60898-1 |
| 12 | Icn @ 400V (A) | IEC 60898-1 |
| 13 | Uimp (kV) | 定格インパルス耐電圧 |
| 14 | Ui (V) | 定格絶縁電圧 |
| 15 | DC対応 | 対応/非対応/専用モデル名 |
| 16 | DC最大電圧 (V) | |
| 17 | 端子タイプ | ネジ式/スクリューレス/EverLink等 |
| 18 | 最大接続電線サイズ (mm²) | |
| 19 | 1極あたりの幅 (mm) | |
| 20 | 使用温度範囲 (°C) | |
| 21 | 対応アクセサリー概要 | 漏電ブロック/補助接点/モーターオペレータ等 |
| 22 | スマート機能 | PowerTag/VisiTrip等 |
| 23 | 主要認証 | CE, KEMA, CCC, UL等 |

#### グリッドのインタラクション
- 全列でソート可能
- 列ヘッダーにフィルター（ドロップダウン or テキスト入力）
- 極数・トリップカーブ・定格電流は特にフィルタリング頻度が高い
- 行ホバーでハイライト
- 列の表示/非表示をトグルできるカラムセレクター

## 4. データスキーマ（JSON）

### 4.1 シリーズレベルデータ（カード表示用）

ファイル: `src/data/manufacturers/schneider/series.json`

```json
[
  {
    "id": "acti9-ic60n",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Acti9",
    "sub_series": "iC60N",
    "display_name": "Acti9 iC60N",
    "market_category": "industrial_commercial",
    "target_tags": ["商業ビル", "産業", "標準用途"],
    "concept_summary": "産業・商業向けスタンダード。IEC 60947-2とIEC 60898-1のダブルスタンダード対応で高い汎用性。",
    "standards": {
      "primary": ["IEC 60947-2"],
      "additional": ["IEC 60898-1", "EN 61009-1"]
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": 20,
      "icn_230v_a": 6000
    },
    "rated_current_range": { "min": 0.5, "max": 63, "unit": "A" },
    "trip_curves": ["B", "C", "D"],
    "poles_available": ["1P", "1P+N", "2P", "3P", "3P+N", "4P"],
    "dc_capable": true,
    "dc_dedicated_model": "C60H-DC",
    "regional_availability": ["Global"],
    "status": "active"
  },
  {
    "id": "acti9-ic60h",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Acti9",
    "sub_series": "iC60H",
    "display_name": "Acti9 iC60H",
    "market_category": "industrial_commercial",
    "target_tags": ["産業", "高遮断", "変圧器近傍"],
    "concept_summary": "高遮断容量モデル。短絡電流が大きい産業設備に最適。iC60Nの上位互換。",
    "standards": {
      "primary": ["IEC 60947-2"],
      "additional": ["IEC 60898-1"]
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": 30,
      "icn_230v_a": 10000
    },
    "rated_current_range": { "min": 0.5, "max": 63, "unit": "A" },
    "trip_curves": ["B", "C", "D"],
    "poles_available": ["1P", "1P+N", "2P", "3P", "3P+N", "4P"],
    "dc_capable": true,
    "dc_dedicated_model": "C60H-DC",
    "regional_availability": ["Global"],
    "status": "active"
  },
  {
    "id": "acti9-ic60l",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Acti9",
    "sub_series": "iC60L",
    "display_name": "Acti9 iC60L",
    "market_category": "industrial_commercial",
    "target_tags": ["大規模産業", "プラント", "超高遮断"],
    "concept_summary": "超高遮断容量（Icu 100kA）。大規模産業プラント・変電設備直近での使用に対応。",
    "standards": {
      "primary": ["IEC 60947-2"],
      "additional": []
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": 100,
      "icn_230v_a": 15000
    },
    "rated_current_range": { "min": 0.5, "max": 63, "unit": "A" },
    "trip_curves": ["B", "C", "D", "K", "Z"],
    "poles_available": ["1P", "2P", "3P", "4P"],
    "dc_capable": false,
    "dc_dedicated_model": null,
    "regional_availability": ["Global"],
    "status": "active"
  },
  {
    "id": "acti9-ic40n",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Acti9",
    "sub_series": "iC40N",
    "display_name": "Acti9 iC40N",
    "market_category": "industrial_commercial",
    "target_tags": ["商業", "軽工業", "コスト重視"],
    "concept_summary": "Acti9のコスト最適化モデル。遮断容量10kAで商業・軽工業向け。",
    "standards": {
      "primary": ["IEC 60947-2"],
      "additional": ["IEC 60898-1"]
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": 10,
      "icn_230v_a": 6000
    },
    "rated_current_range": { "min": 1, "max": 63, "unit": "A" },
    "trip_curves": ["B", "C"],
    "poles_available": ["1P", "1P+N", "2P", "3P", "4P"],
    "dc_capable": false,
    "dc_dedicated_model": null,
    "regional_availability": ["Global"],
    "status": "active"
  },
  {
    "id": "multi9-c60sp",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Multi9",
    "sub_series": "C60SP",
    "display_name": "Multi9 C60SP",
    "market_category": "global_oem",
    "target_tags": ["OEM", "制御盤", "北米規格", "UL489"],
    "concept_summary": "UL489/IEC 60947-2マルチ規格対応。北米輸出向け制御盤・装置メーカー専用。",
    "standards": {
      "primary": ["IEC 60947-2"],
      "additional": ["UL489", "CSA C22.2 No.5"]
    },
    "ul_approval": true,
    "breaking_capacity_summary": {
      "icu_415v_ka": 15,
      "icn_230v_a": null
    },
    "rated_current_range": { "min": 0.5, "max": 63, "unit": "A" },
    "trip_curves": ["B", "C", "D"],
    "poles_available": ["1P", "2P", "3P", "4P"],
    "dc_capable": true,
    "dc_dedicated_model": "C60H-DC",
    "regional_availability": ["Global"],
    "status": "active"
  },
  {
    "id": "resi9",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Resi9",
    "sub_series": null,
    "display_name": "Resi9",
    "market_category": "residential",
    "target_tags": ["住宅", "集合住宅", "プラグオン"],
    "concept_summary": "先進国住宅向け。プラグオンバスバー対応で施工時間を大幅短縮。",
    "standards": {
      "primary": ["IEC 60898-1"],
      "additional": ["BS EN 60898-1"]
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": null,
      "icn_230v_a": 6000
    },
    "rated_current_range": { "min": 6, "max": 40, "unit": "A" },
    "trip_curves": ["B", "C"],
    "poles_available": ["1P", "1P+N", "2P"],
    "dc_capable": false,
    "dc_dedicated_model": null,
    "regional_availability": ["Europe", "UK", "Middle East"],
    "status": "active"
  },
  {
    "id": "easy9",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Easy9",
    "sub_series": null,
    "display_name": "Easy9",
    "market_category": "economy_emerging",
    "target_tags": ["新興国", "コスト最優先", "住宅"],
    "concept_summary": "新興国市場向けベーシックモデル。最小限の機能でコスト最適化を実現。",
    "standards": {
      "primary": ["IEC 60898-1"],
      "additional": []
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": null,
      "icn_230v_a": 6000
    },
    "rated_current_range": { "min": 6, "max": 63, "unit": "A" },
    "trip_curves": ["B", "C"],
    "poles_available": ["1P", "1P+N", "2P", "3P", "4P"],
    "dc_capable": false,
    "dc_dedicated_model": null,
    "regional_availability": ["ASEAN", "Middle East", "Africa", "South Asia"],
    "status": "active"
  },
  {
    "id": "domae",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Domae",
    "sub_series": null,
    "display_name": "Domae",
    "market_category": "economy_emerging",
    "target_tags": ["新興国", "超コスト重視", "地域限定"],
    "concept_summary": "特定地域限定の超コスト重視モデル。Cカーブのみで機能を絞り込み。",
    "standards": {
      "primary": ["IEC 60898-1"],
      "additional": []
    },
    "ul_approval": false,
    "breaking_capacity_summary": {
      "icu_415v_ka": null,
      "icn_230v_a": 6000
    },
    "rated_current_range": { "min": 6, "max": 40, "unit": "A" },
    "trip_curves": ["C"],
    "poles_available": ["1P", "1P+N", "2P", "3P", "4P"],
    "dc_capable": false,
    "dc_dedicated_model": null,
    "regional_availability": ["ASEAN"],
    "status": "active"
  }
]
```

### 4.2 型番レベルデータ（データグリッド用）

ファイル: `src/data/manufacturers/schneider/mcb/acti9-ic60n.json`

```json
[
  {
    "id": "A9F44206",
    "manufacturer": "Schneider Electric",
    "manufacturer_id": "schneider",
    "series": "Acti9",
    "sub_series": "iC60N",
    "model_number": "A9F44206",
    "poles": "2P",
    "rated_current_in_a": 6,
    "trip_curve": "C",
    "breaking_capacity": {
      "iec_60947_2": {
        "icu_220_240v_ka": 36,
        "icu_380_415v_ka": 20,
        "icu_440v_ka": 10
      },
      "iec_60898_1": {
        "icn_230v_a": 6000,
        "icn_400v_a": 6000
      }
    },
    "uimp_kv": 6,
    "ui_v": 500,
    "dc_compatible": false,
    "dc_max_voltage_v": null,
    "terminal_type": "Screw cage",
    "max_wire_size_mm2": 25,
    "width_per_pole_mm": 9,
    "total_width_mm": 18,
    "operating_temp_min_c": -25,
    "operating_temp_max_c": 70,
    "accessories": {
      "rcd_addon": "Vigi iC60",
      "auxiliary_contact": true,
      "shunt_trip": true,
      "motor_operator": true,
      "arc_fault_detection": "Acti9 iARC"
    },
    "smart_features": {
      "energy_monitoring": "PowerTag (optional)",
      "trip_indicator": "VisiTrip",
      "contact_position_indicator": "VisiSafe"
    },
    "certifications": ["CE", "KEMA", "CCC"],
    "source_url": "https://www.se.com/ww/en/product/A9F44206/",
    "last_updated": "2026-02-20"
  }
]
```

### 4.3 メーカー共通の市場カテゴリ定義

ファイル: `src/data/market-categories.json`

```json
[
  {
    "id": "industrial_commercial",
    "label_ja": "産業・商業",
    "label_en": "Industrial / Commercial",
    "description": "IEC 60947-2準拠を主軸とする産業設備・大規模商業ビル向け",
    "sort_order": 1
  },
  {
    "id": "global_oem",
    "label_ja": "装置組込・OEM",
    "label_en": "Global OEM / Multi-Standard",
    "description": "UL489等グローバル規格対応。制御盤・装置メーカー向け",
    "sort_order": 2
  },
  {
    "id": "residential",
    "label_ja": "住宅・小規模",
    "label_en": "Residential / Small Business",
    "description": "IEC 60898-1準拠の住宅・小規模店舗向け",
    "sort_order": 3
  },
  {
    "id": "economy_emerging",
    "label_ja": "エコノミー・新興国",
    "label_en": "Economy / Emerging Markets",
    "description": "コスト最適化を最優先とする新興国市場向け",
    "sort_order": 4
  }
]
```

### 4.4 メーカー設定ファイル

ファイル: `src/config/manufacturers.ts`

```typescript
export interface ManufacturerConfig {
  id: string;
  displayName: string;
  accentColor: string;
  accentColorTailwind: string;
  status: "active" | "coming_soon";
  logoPath?: string;
}

export const manufacturers: ManufacturerConfig[] = [
  {
    id: "schneider",
    displayName: "Schneider Electric",
    accentColor: "#3DCD58",
    accentColorTailwind: "green-500",
    status: "active",
  },
  {
    id: "abb",
    displayName: "ABB",
    accentColor: "#FF000F",
    accentColorTailwind: "red-500",
    status: "coming_soon",
  },
  {
    id: "siemens",
    displayName: "SIEMENS",
    accentColor: "#009999",
    accentColorTailwind: "teal-500",
    status: "coming_soon",
  },
];
```

## 5. デザイン要件

### 5.1 全体方針
- ダーク基調のプロフェッショナルUI（shadcn/ui の dark テーマベース）
- 情報密度が高いため、余白を最小限にしてデータ量を最大化
- ウルトラワイド（3440px幅）での使用を一義的に最適化しつつ、1920px幅でも破綻しないレスポンシブ対応

### 5.2 カラーパレット
- 背景: `zinc-950` / `zinc-900`
- カード背景: `zinc-800`
- アクセントカラー: メーカーごとに差別化
  - Schneider Electric: `#3DCD58`（シュナイダーグリーン）
  - ABB: `#FF000F`（ABBレッド）— 将来用
  - SIEMENS: `#009999`（シーメンスティール）— 将来用
- 市場カテゴリバッジカラー:
  - Industrial: `blue-500`
  - OEM: `purple-500`
  - Residential: `green-500`
  - Economy: `amber-500`

### 5.3 フォント
- 見出し: `Inter` (sans-serif)
- データグリッド内数値: `JetBrains Mono` (monospace)

## 6. 拡張性の担保（ABB・SIEMENS追加への備え）

### 6.1 データ構造
- 全てのJSONスキーマは `manufacturer_id` フィールドを持つ
- シリーズ/型番データは `src/data/manufacturers/{manufacturer_id}/` に格納
- UIコンポーネントはメーカー固有のロジックをハードコードしない
- `market-categories.json` の共通タグで3社を横断的に分類

### 6.2 UI
- メーカー切替タブは配列から動的生成する設計
- Coming Soonのタブはdisabled状態で表示しクリック不可
- メーカー別アクセントカラーは `src/config/manufacturers.ts` で一元管理

### 6.3 将来のメーカー対応マッピング

| 共通カテゴリ | Schneider | ABB | Siemens |
|---|---|---|---|
| Industrial/Commercial | Acti9 iC60 (N/H/L) | S200, S200M, S800 | 5SY4, 5SY7, 5SY8 |
| Global OEM | Multi9 C60SP | S200 M UC, SU200M | 5SJ4 |
| Residential | Resi9 | SH200 | 5SL6 |
| Economy/Emerging | Easy9, Domae | SH200L | 5SL3 |

## 7. Phase 2 への接続ポイント（参考情報）

Phase 2では以下の機能を追加予定。Phase 1の設計時に考慮しておくこと:

- データグリッドの左端に「自社製品列」を挿入可能な構造
- シリーズカード画面に「自社対抗製品」のオーバーレイ表示機能
- ヒートマップ型の勝敗スコアリング表示
- 営業向けバトルカード（PDF/Slack共有）のエクスポート機能

## 8. 初期実装の優先順位

1. プロジェクトセットアップ（Next.js + Tailwind + shadcn/ui）
2. 大分類選択画面（トップページ）
3. データスキーマのJSONファイル作成（Schneider MCBのシードデータ）
4. 中分類シリーズカード画面（市場カテゴリ別グルーピング）
5. 詳細データグリッド画面（TanStack Table）
6. フィルタリング・ソート機能
7. レスポンシブ対応の微調整
8. Vercelデプロイ設定
