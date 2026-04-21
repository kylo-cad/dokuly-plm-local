// AI Spec Assistant - Mock Data for UI Testing

export const mockProjects = [
  {
    id: 1,
    name: "スマートウォッチ v1",
    spec_requirement_id: 101,
    similarity_score: 0.92,
    estimated_cost: 3450,
    created_at: "2025-12-15"
  },
  {
    id: 2,
    name: "フィットネストラッカー Pro",
    spec_requirement_id: 102,
    similarity_score: 0.87,
    estimated_cost: 2980,
    created_at: "2025-10-20"
  },
  {
    id: 3,
    name: "ウェアラブルデバイス Alpha",
    spec_requirement_id: 103,
    similarity_score: 0.79,
    estimated_cost: 4200,
    created_at: "2025-08-05"
  }
];

export const mockSpecifications = {
  current: {
    "基本仕様": {
      "材料": { value: "SUS304", confidence: 0.95, page: 3 },
      "サイズ": { value: "45mm × 38mm × 12mm", confidence: 0.92, page: 3 },
      "重量": { value: "52g", confidence: 0.88, page: 3 }
    },
    "性能仕様": {
      "バッテリー容量": { value: "500mAh", confidence: 0.96, page: 5 },
      "ディスプレイ": { value: "1.5インチ OLED", confidence: 0.94, page: 5 },
      "防水性能": { value: "IP68", confidence: 0.91, page: 6 },
      "動作温度": { value: "-10℃〜50℃", confidence: 0.89, page: 6 }
    },
    "通信仕様": {
      "Bluetooth": { value: "5.2", confidence: 0.93, page: 8 },
      "NFC": { value: "対応", confidence: 0.90, page: 8 }
    },
    "規格・認証": {
      "CE": { value: "取得済み", confidence: 0.97, page: 12 },
      "RoHS": { value: "準拠", confidence: 0.95, page: 12 }
    }
  },
  project_101: {
    "基本仕様": {
      "材料": { value: "SUS304", confidence: 0.95, page: 2 },
      "サイズ": { value: "42mm × 36mm × 11mm", confidence: 0.92, page: 2 },
      "重量": { value: "48g", confidence: 0.88, page: 2 }
    },
    "性能仕様": {
      "バッテリー容量": { value: "300mAh", confidence: 0.96, page: 4 },
      "ディスプレイ": { value: "1.3インチ OLED", confidence: 0.94, page: 4 },
      "防水性能": { value: "IP68", confidence: 0.91, page: 5 },
      "動作温度": { value: "-10℃〜50℃", confidence: 0.89, page: 5 }
    },
    "通信仕様": {
      "Bluetooth": { value: "5.0", confidence: 0.93, page: 7 },
      "NFC": { value: "非対応", confidence: 0.90, page: 7 }
    },
    "規格・認証": {
      "CE": { value: "取得済み", confidence: 0.97, page: 10 },
      "RoHS": { value: "準拠", confidence: 0.95, page: 10 }
    }
  }
};

export const mockSpecDifferences = {
  project_101: {
    "サイズ": {
      current: "45mm × 38mm × 12mm",
      similar: "42mm × 36mm × 11mm",
      impact: "medium"
    },
    "重量": {
      current: "52g",
      similar: "48g",
      impact: "low"
    },
    "バッテリー容量": {
      current: "500mAh",
      similar: "300mAh",
      impact: "high"
    },
    "ディスプレイ": {
      current: "1.5インチ OLED",
      similar: "1.3インチ OLED",
      impact: "medium"
    },
    "Bluetooth": {
      current: "5.2",
      similar: "5.0",
      impact: "low"
    },
    "NFC": {
      current: "対応",
      similar: "非対応",
      impact: "high"
    }
  }
};

export const mockRiskAssessment = {
  change_points: [
    {
      item: "バッテリー容量",
      from: "300mAh",
      to: "500mAh",
      concern: "発熱リスク増加、ケース内スペース不足の可能性",
      severity: "high",
      color: "danger"
    },
    {
      item: "ディスプレイサイズ",
      from: "1.3インチ",
      to: "1.5インチ",
      concern: "消費電力増加、コスト上昇",
      severity: "medium",
      color: "warning"
    },
    {
      item: "NFC追加",
      from: "非対応",
      to: "対応",
      concern: "新規部品追加による実装リスク、認証取得が必要",
      severity: "high",
      color: "danger"
    },
    {
      item: "Bluetoothバージョン",
      from: "5.0",
      to: "5.2",
      concern: "チップ変更による互換性リスク",
      severity: "low",
      color: "info"
    }
  ],

  quality_risks: [
    {
      category: "発熱",
      severity: "high",
      description: "バッテリー容量増加により発熱リスクが上昇。過去案件 #456 で同様の変更により温度5℃上昇を確認。",
      source: "過去案件 #456 不具合報告書",
      recommendation: "熱シミュレーション実施、放熱設計の見直し推奨",
      cost_impact: "+¥150,000（熱対策部品追加）"
    },
    {
      category: "電磁干渉",
      severity: "medium",
      description: "NFC追加によりBluetooth通信への干渉の可能性。",
      source: "DRBFM分析結果",
      recommendation: "EMC試験の実施、アンテナ配置の最適化",
      cost_impact: "+¥80,000（EMC試験費用）"
    },
    {
      category: "防水性",
      severity: "medium",
      description: "サイズ変更によりシーリング設計の変更が必要。",
      source: "設計レビュー記録 #234",
      recommendation: "防水試験の再実施、Oリング仕様の見直し",
      cost_impact: "+¥30,000（試験費用）"
    }
  ],

  delivery_risks: [
    {
      item: "NFC部品",
      risk: "リードタイム12週間、調達遅延の可能性",
      mitigation: "早期発注、代替サプライヤーの確保"
    },
    {
      item: "認証取得",
      risk: "NFCのCE認証取得に4-6週間必要",
      mitigation: "認証機関への早期相談、スケジュール調整"
    }
  ],

  cost_risks: [
    {
      category: "部品コスト",
      baseline: "¥2,800",
      estimated: "¥3,450",
      difference: "+¥650 (+23%)",
      breakdown: [
        { item: "バッテリー", baseline: 300, estimated: 480, diff: 180 },
        { item: "ディスプレイ", baseline: 800, estimated: 1050, diff: 250 },
        { item: "NFC module", baseline: 0, estimated: 220, diff: 220 }
      ]
    },
    {
      category: "試験・認証費用",
      baseline: "¥200,000",
      estimated: "¥460,000",
      difference: "+¥260,000",
      breakdown: [
        { item: "熱試験", baseline: 0, estimated: 150000, diff: 150000 },
        { item: "EMC試験", baseline: 100000, estimated: 180000, diff: 80000 },
        { item: "NFC認証", baseline: 0, estimated: 130000, diff: 130000 }
      ]
    }
  ],

  compliance_alerts: [
    {
      type: "warning",
      category: "環境規制",
      message: "ディスプレイ部品に含まれるフタル酸エステルの含有率を確認してください（EU REACH規制）",
      action_required: "サプライヤーへの成分証明書請求"
    }
  ],

  failure_predictions: [
    {
      failure_mode: "バッテリー膨張",
      probability: "medium",
      occurrence_count: 3,
      past_cases: [
        { project: "スマートウォッチ v1", date: "2025-06-15", description: "高温環境でバッテリー膨張" },
        { project: "フィットネストラッカー", date: "2025-03-20", description: "充電サイクル500回後に膨張" }
      ],
      countermeasure: "バッテリーセルの品質グレード向上、過充電保護回路の強化"
    },
    {
      failure_mode: "ディスプレイ剥離",
      probability: "low",
      occurrence_count: 1,
      past_cases: [
        { project: "ウェアラブルデバイス Alpha", date: "2025-09-10", description: "落下衝撃でディスプレイ剥離" }
      ],
      countermeasure: "接着剤の変更、落下試験の追加"
    }
  ]
};

export const mockBOMData = {
  base_model: {
    name: "スマートウォッチ v1 (基準モデル)",
    total_cost: 2800,
    parts: [
      { id: 1, name: "バッテリー LiPo 300mAh", qty: 1, unit_cost: 300, total: 300, category: "電源" },
      { id: 2, name: "ディスプレイ 1.3インチ OLED", qty: 1, unit_cost: 800, total: 800, category: "表示" },
      { id: 3, name: "マイクロコントローラ STM32", qty: 1, unit_cost: 450, total: 450, category: "制御" },
      { id: 4, name: "Bluetooth 5.0 モジュール", qty: 1, unit_cost: 280, total: 280, category: "通信" },
      { id: 5, name: "ケース（プラスチック）", qty: 1, unit_cost: 520, total: 520, category: "筐体" },
      { id: 6, name: "ストラップ（シリコン）", qty: 1, unit_cost: 150, total: 150, category: "付属品" },
      { id: 7, name: "センサーモジュール", qty: 1, unit_cost: 300, total: 300, category: "センサー" }
    ]
  },

  proposed_model: {
    name: "新製品（変更後）",
    total_cost: 3450,
    parts: [
      { id: 1, name: "バッテリー LiPo 500mAh", qty: 1, unit_cost: 480, total: 480, category: "電源", changed: true },
      { id: 2, name: "ディスプレイ 1.5インチ OLED", qty: 1, unit_cost: 1050, total: 1050, category: "表示", changed: true },
      { id: 3, name: "マイクロコントローラ STM32", qty: 1, unit_cost: 450, total: 450, category: "制御", changed: false },
      { id: 4, name: "Bluetooth 5.2 モジュール", qty: 1, unit_cost: 320, total: 320, category: "通信", changed: true },
      { id: 8, name: "NFCモジュール", qty: 1, unit_cost: 220, total: 220, category: "通信", changed: true, new: true },
      { id: 5, name: "ケース（プラスチック）", qty: 1, unit_cost: 580, total: 580, category: "筐体", changed: true },
      { id: 6, name: "ストラップ（シリコン）", qty: 1, unit_cost: 150, total: 150, category: "付属品", changed: false },
      { id: 7, name: "センサーモジュール", qty: 1, unit_cost: 300, total: 300, category: "センサー", changed: false }
    ]
  }
};

export const mockReviewComments = [
  {
    id: 1,
    author: "山田太郎（品質管理）",
    date: "2026-04-20 14:30",
    comment: "バッテリー容量増加による発熱リスクについて、熱シミュレーション結果を添付してください。",
    status: "resolved",
    response: "熱シミュレーション実施済み。放熱フィン追加により温度上昇を3℃以内に抑制できることを確認しました。結果を添付ファイルに追加しました。",
    response_date: "2026-04-20 16:45"
  },
  {
    id: 2,
    author: "佐藤花子（設計）",
    date: "2026-04-20 15:15",
    comment: "NFCアンテナの配置について、Bluetoothとの干渉を考慮した設計図面を確認したいです。",
    status: "resolved",
    response: "アンテナ配置図を更新しました。NFCとBluetoothのアンテナ間距離を15mm確保し、干渉リスクを最小化しています。",
    response_date: "2026-04-20 17:20"
  },
  {
    id: 3,
    author: "鈴木一郎（調達）",
    date: "2026-04-21 09:00",
    comment: "NFCモジュールのサプライヤーとリードタイムを確認しました。代替サプライヤーも確保済みです。承認します。",
    status: "approved"
  }
];

export const mockApprovalHistory = [
  {
    id: 1,
    reviewer: "鈴木一郎（調達）",
    role: "調達部門承認者",
    date: "2026-04-21 10:30",
    status: "approved",
    comment: "部品調達の観点から問題ありません。NFCモジュールの代替サプライヤーも確保済みです。"
  },
  {
    id: 2,
    reviewer: "山田太郎（品質管理）",
    role: "品質管理承認者",
    date: "2026-04-21 11:15",
    status: "approved",
    comment: "熱シミュレーション結果を確認しました。対策が適切に実施されており、品質リスクは許容範囲内です。"
  },
  {
    id: 3,
    reviewer: "佐藤花子（設計）",
    role: "設計部門承認者",
    date: "2026-04-21 14:00",
    status: "pending",
    comment: null
  },
  {
    id: 4,
    reviewer: "田中次郎（部門長）",
    role: "最終承認者",
    date: null,
    status: "pending",
    comment: null
  }
];

export const mockFinalSummary = {
  project_name: "新型スマートウォッチ v2",
  created_date: "2026-04-18",
  approved_date: "2026-04-21",
  base_model: "スマートウォッチ v1",

  changes: {
    total_parts: 8,
    changed_parts: 4,
    new_parts: 1,
    removed_parts: 0
  },

  cost: {
    base_model: 2800,
    new_model: 3450,
    difference: 650,
    percentage: 23.2
  },

  risks: {
    high: 2,
    medium: 3,
    low: 1
  },

  timeline: {
    design_review: "2026-04-25",
    prototype: "2026-05-15",
    mass_production: "2026-06-30"
  },

  approvers: [
    { name: "鈴木一郎", role: "調達", status: "approved" },
    { name: "山田太郎", role: "品質管理", status: "approved" },
    { name: "佐藤花子", role: "設計", status: "approved" },
    { name: "田中次郎", role: "部門長", status: "approved" }
  ]
};

export const mockWorkflowSteps = [
  { step: 1, name: "要求仕様入力", status: "completed", date: "2026-04-18" },
  { step: 2, name: "類似案件検索", status: "completed", date: "2026-04-18" },
  { step: 3, name: "基準モデル選定", status: "completed", date: "2026-04-19" },
  { step: 4, name: "変更部品決定", status: "completed", date: "2026-04-19" },
  { step: 5, name: "リスク評価", status: "completed", date: "2026-04-20" },
  { step: 6, name: "レビュー中", status: "in_progress", date: "2026-04-20" },
  { step: 7, name: "承認待ち", status: "pending", date: null },
  { step: 8, name: "完了", status: "pending", date: null }
];
