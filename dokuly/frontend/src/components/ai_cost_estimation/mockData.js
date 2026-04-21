// AI原価査定機能のモックデータ

// プロジェクト一覧
export const mockProjects = [
  {
    id: 1,
    project_number: "CE-2026-001",
    title: "新型センサーブラケット 原価査定",
    estimation_type: "procurement",
    status: "analyzing",
    quote_round: 1,
    assignee: "田中太郎",
    target_cost: 1500,
    currency: "JPY",
    created_at: "2026-04-15",
    item_count: 1,
    reviewers: ["佐藤次郎", "鈴木花子"],
  },
  {
    id: 2,
    project_number: "CE-2026-002",
    title: "電源カバー 2回目見積査定",
    estimation_type: "procurement",
    status: "quote_waiting",
    quote_round: 2,
    assignee: "山田一郎",
    target_cost: 850,
    currency: "JPY",
    created_at: "2026-04-10",
    item_count: 1,
    reviewers: ["佐藤次郎"],
  },
  {
    id: 3,
    project_number: "CE-2026-003",
    title: "モーターハウジング 原価企画",
    estimation_type: "cost_planning",
    status: "draft",
    quote_round: 1,
    assignee: "高橋美咲",
    target_cost: 3200,
    currency: "JPY",
    created_at: "2026-04-18",
    item_count: 1,
    reviewers: [],
  },
];

// 査定対象品目
export const mockProjectItem = {
  id: 1,
  project_id: 1,
  item_number: "BKT-2026-S001",
  item_name: "センサーブラケット",
  manufacturing_category: "sheet_metal",
  material: "SPCC-SD (冷延鋼板)",
  surface_treatment: "電気亜鉛メッキ (クロメート処理)",
  max_dimension_x: 120,
  max_dimension_y: 80,
  max_dimension_z: 15,
  weight: 0.085,
  quantity: 5000,
  unit: "pcs",
  ai_analyzed_specs: {
    material_thickness: 1.6,
    bend_count: 3,
    hole_count: 8,
    thread_count: 4,
    tolerance_grade: "中級（±0.2mm）",
    complexity_score: 0.62,
  },
};

// 図面情報
export const mockDrawing = {
  id: 1,
  item_id: 1,
  file_name: "BKT-2026-S001_Rev.A.pdf",
  drawing_type: "2d",
  ai_analysis_status: "completed",
  ai_analysis_result: {
    material: "SPCC-SD",
    surface_treatment: "電気亜鉛メッキ",
    dimensions: { x: 120, y: 80, z: 15 },
    tolerances: [
      { type: "寸法公差", value: "±0.2" },
      { type: "曲げ公差", value: "±1°" },
      { type: "平面度", value: "0.3" },
    ],
    features: ["曲げ加工", "穴あけ", "タップ加工", "バリ取り"],
    complexity_score: 0.62,
    estimated_processes: [
      "ブランク抜き",
      "曲げ成形（3箇所）",
      "穴あけ（φ5×4, φ6×4）",
      "タップ加工（M5×4）",
      "バリ取り",
      "電気亜鉛メッキ",
    ],
  },
  uploaded_at: "2026-04-15 09:30",
};

// 見積情報
export const mockQuotations = [
  {
    id: 1,
    item_id: 1,
    quotation_number: "Q-2026-0415-A001",
    supplier_name: "A金属工業（現サプライヤ）",
    quotation_date: "2026-04-16",
    unit_price: 1680,
    quoted_quantity: 5000,
    total_amount: 8400000,
    lead_time_days: 30,
    currency: "JPY",
    supplier_comment: "材質変更により単価上昇。量産実績あり、品質安定。",
    is_selected: true,
  },
  {
    id: 2,
    item_id: 1,
    quotation_number: "Q-2026-0416-B002",
    supplier_name: "B製作所",
    quotation_date: "2026-04-17",
    unit_price: 1550,
    quoted_quantity: 5000,
    total_amount: 7750000,
    lead_time_days: 45,
    currency: "JPY",
    supplier_comment: "新規取引のため初回は試作費別途。量産移行後この価格。",
    is_selected: false,
  },
  {
    id: 3,
    item_id: 1,
    quotation_number: "Q-2026-0417-C003",
    supplier_name: "C精密",
    quotation_date: "2026-04-18",
    unit_price: 1720,
    quoted_quantity: 5000,
    total_amount: 8600000,
    lead_time_days: 25,
    currency: "JPY",
    supplier_comment: "短納期対応可能。品質保証体制万全。",
    is_selected: false,
  },
];

// 見積明細（A社の詳細）
export const mockQuotationLines = [
  {
    id: 1,
    quotation_id: 1,
    line_number: 1,
    cost_category: "material",
    item_description: "SPCC-SD 板材 (1.6t)",
    unit_price: 420,
    quantity: 1,
    amount: 420,
  },
  {
    id: 2,
    quotation_id: 1,
    line_number: 2,
    cost_category: "processing",
    process_name: "ブランク抜き",
    item_description: "NCプレス加工",
    unit_price: 180,
    quantity: 1,
    amount: 180,
  },
  {
    id: 3,
    quotation_id: 1,
    line_number: 3,
    cost_category: "processing",
    process_name: "曲げ成形",
    item_description: "ベンダー加工 3箇所",
    unit_price: 280,
    quantity: 1,
    amount: 280,
  },
  {
    id: 4,
    quotation_id: 1,
    line_number: 4,
    cost_category: "processing",
    process_name: "穴あけ・タップ",
    item_description: "ボール盤・タップ加工",
    unit_price: 320,
    quantity: 1,
    amount: 320,
  },
  {
    id: 5,
    quotation_id: 1,
    line_number: 5,
    cost_category: "surface_treatment",
    item_description: "電気亜鉛メッキ + クロメート",
    unit_price: 180,
    quantity: 1,
    amount: 180,
  },
  {
    id: 6,
    quotation_id: 1,
    line_number: 6,
    cost_category: "inspection",
    item_description: "寸法検査・外観検査",
    unit_price: 80,
    quantity: 1,
    amount: 80,
  },
  {
    id: 7,
    quotation_id: 1,
    line_number: 7,
    cost_category: "overhead",
    item_description: "管理費・梱包費",
    unit_price: 120,
    quantity: 1,
    amount: 120,
  },
  {
    id: 8,
    quotation_id: 1,
    line_number: 8,
    cost_category: "profit",
    item_description: "利益",
    unit_price: 100,
    quantity: 1,
    amount: 100,
  },
];

// 類似品候補
export const mockSimilarItems = [
  {
    id: 1,
    rank: 1,
    item_number: "BKT-2024-S089",
    item_name: "センサーブラケット（旧型）",
    total_similarity_score: 0.92,
    shape_similarity_score: 0.95,
    metadata_similarity_score: 0.88,
    process_similarity_score: 0.93,
    latest_unit_price: 1420,
    supplier_name: "A金属工業",
    quotation_date: "2024-11-20",
    differences: {
      dimension_diff: { x: 0, y: -5, z: 0 },
      dimension_diff_percent: { x: 0, y: -0.06, z: 0 },
      material_diff: "同一 (SPCC-SD)",
      surface_treatment_diff: "同一 (電気亜鉛メッキ)",
      feature_diffs: ["穴径変更 φ6→φ5 (2箇所)", "板厚変更 1.4t→1.6t"],
    },
    estimated_cost_impact: 60,
    cost_impact_reasoning:
      "板厚1.4t→1.6tにより材料費+50円、穴径変更による加工費+10円と推定",
    is_selected_for_comparison: true,
    is_user_added: false,
  },
  {
    id: 2,
    rank: 2,
    item_number: "BKT-2025-S112",
    item_name: "アクチュエータブラケット",
    total_similarity_score: 0.85,
    shape_similarity_score: 0.88,
    metadata_similarity_score: 0.82,
    process_similarity_score: 0.85,
    latest_unit_price: 1580,
    supplier_name: "B製作所",
    quotation_date: "2025-08-15",
    differences: {
      dimension_diff: { x: 10, y: 15, z: 3 },
      dimension_diff_percent: { x: 0.09, y: 0.23, z: 0.25 },
      material_diff: "同一 (SPCC-SD)",
      surface_treatment_diff: "ユニクロメッキ → 電気亜鉛メッキ",
      feature_diffs: ["曲げ箇所 2→3", "タップ数 2→4"],
    },
    estimated_cost_impact: -80,
    cost_impact_reasoning:
      "サイズ縮小により材料費-30円、タップ数増加+50円、メッキ変更-100円と推定",
    is_selected_for_comparison: true,
    is_user_added: false,
  },
  {
    id: 3,
    rank: 3,
    item_number: "BKT-2025-S098",
    item_name: "コントローラーブラケット",
    total_similarity_score: 0.78,
    shape_similarity_score: 0.75,
    metadata_similarity_score: 0.85,
    process_similarity_score: 0.76,
    latest_unit_price: 1350,
    supplier_name: "D板金",
    quotation_date: "2025-06-10",
    differences: {
      dimension_diff: { x: -20, y: -10, z: -2 },
      dimension_diff_percent: { x: -0.14, y: -0.11, z: -0.12 },
      material_diff: "同一 (SPCC-SD)",
      surface_treatment_diff: "三価クロメート → クロメート",
      feature_diffs: ["形状簡略化", "穴数 8→6"],
    },
    estimated_cost_impact: 130,
    cost_impact_reasoning:
      "サイズ・形状簡素化で-100円だが、当該品目は複雑形状のため+230円と推定",
    is_selected_for_comparison: false,
    is_user_added: false,
  },
];

// AI原価分析結果
export const mockCostAnalysis = {
  id: 1,
  project_id: 1,
  item_id: 1,
  analysis_type: "validity",
  ai_estimated_cost: 1480,
  ai_cost_range_min: 1380,
  ai_cost_range_max: 1580,
  ai_confidence: 0.78,
  reasoning:
    "類似品目の実績価格（1,350円〜1,580円）および図面差分から推定。材質がSPCC-SDで板厚1.6mm、曲げ3箇所、穴あけ8箇所、タップ4箇所の加工内容を考慮。電気亜鉛メッキの表面処理費を含む。量産数量5,000個を前提とした単価。",
  similar_items_cost_stats: {
    min: 1350,
    q1: 1400,
    median: 1480,
    q3: 1550,
    max: 1720,
    mean: 1490,
    count: 8,
  },
  status: "completed",
  analyzed_at: "2026-04-20 14:25",
};

// 原価内訳
export const mockCostBreakdown = [
  {
    id: 1,
    cost_category: "material",
    process_name: "材料費",
    amount: 400,
    calculation_logic: "SPCC-SD 1.6t 板材 120×80mm 材料単価",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 2,
    cost_category: "processing",
    process_name: "ブランク抜き",
    amount: 160,
    calculation_logic: "プレス加工 チャージ800円/h × 工数0.2h",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 3,
    cost_category: "processing",
    process_name: "曲げ成形",
    amount: 250,
    calculation_logic: "ベンダー加工 チャージ1,000円/h × 工数0.25h",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 4,
    cost_category: "processing",
    process_name: "穴あけ・タップ",
    amount: 300,
    calculation_logic: "穴あけ8箇所@20円 + タップM5×4箇所@55円",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 5,
    cost_category: "surface_treatment",
    process_name: "電気亜鉛メッキ",
    amount: 150,
    calculation_logic: "メッキ単価 150円/個 (外注)",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 6,
    cost_category: "inspection",
    process_name: "検査・梱包",
    amount: 70,
    calculation_logic: "寸法検査・外観検査 50円 + 梱包 20円",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 7,
    cost_category: "overhead",
    process_name: "管理費",
    amount: 100,
    calculation_logic: "製造原価の8%",
    is_ai_estimated: true,
    is_user_modified: false,
  },
  {
    id: 8,
    cost_category: "profit",
    process_name: "利益",
    amount: 50,
    calculation_logic: "製造原価の4%",
    is_ai_estimated: true,
    is_user_modified: false,
  },
];

// 原価比較
export const mockCostComparisons = [
  {
    id: 1,
    similar_item_id: 1,
    similar_item_name: "BKT-2024-S089（旧型）",
    current_cost: 1680,
    reference_cost: 1420,
    cost_difference: 260,
    cost_difference_percent: 18.3,
    validity_judgment: "high",
    judgment_reasoning:
      "板厚変更（1.4t→1.6t）で材料費+50円、穴径変更で加工費+10円が妥当。しかし差分260円は過大。AI推定では+60円が妥当であり、約200円の割高と判断。",
    process_comparison: [
      {
        process: "材料費",
        current: 420,
        reference: 380,
        diff: 40,
        diff_percent: 10.5,
        reasoning: "板厚1.4t→1.6tで約10%増は妥当",
      },
      {
        process: "ブランク抜き",
        current: 180,
        reference: 160,
        diff: 20,
        diff_percent: 12.5,
        reasoning: "板厚増加による加工時間増は妥当",
      },
      {
        process: "曲げ成形",
        current: 280,
        reference: 250,
        diff: 30,
        diff_percent: 12.0,
        reasoning: "板厚増加で曲げ負荷増、やや割高だが許容範囲",
      },
      {
        process: "穴あけ・タップ",
        current: 320,
        reference: 280,
        diff: 40,
        diff_percent: 14.3,
        reasoning: "穴径変更の影響は軽微。40円増は過大",
      },
      {
        process: "表面処理",
        current: 180,
        reference: 150,
        diff: 30,
        diff_percent: 20.0,
        reasoning: "同一メッキ処理で30円増は不明瞭",
      },
      {
        process: "検査",
        current: 80,
        reference: 70,
        diff: 10,
        diff_percent: 14.3,
        reasoning: "妥当",
      },
      {
        process: "管理費・利益",
        current: 220,
        reference: 130,
        diff: 90,
        diff_percent: 69.2,
        reasoning: "管理費・利益率が大幅増。要交渉",
      },
    ],
  },
  {
    id: 2,
    similar_item_id: 2,
    similar_item_name: "BKT-2025-S112（アクチュエータ）",
    current_cost: 1680,
    reference_cost: 1580,
    cost_difference: 100,
    cost_difference_percent: 6.3,
    validity_judgment: "appropriate",
    judgment_reasoning:
      "サイズが若干小さいが、タップ数が多く曲げ箇所も多い類似品。差分100円は妥当な範囲。",
  },
];

// 改善提案
export const mockImprovementProposals = [
  {
    id: 1,
    proposal_type: "supplier_change",
    title: "サプライヤをB製作所に変更",
    description:
      "B製作所は見積単価1,550円を提示。A社より130円安価。新規取引のため初回試作費が必要だが、量産移行後は安定供給可能。",
    current_state: {
      supplier: "A金属工業",
      unit_price: 1680,
      lead_time: 30,
    },
    proposed_state: {
      supplier: "B製作所",
      unit_price: 1550,
      lead_time: 45,
    },
    estimated_cost_reduction: 130,
    cost_reduction_percent: 7.7,
    feasibility: "high",
    feasibility_reasoning:
      "B製作所は板金加工の実績が豊富で品質面の懸念は低い。納期が15日長いが、発注計画の調整で対応可能。",
    risks:
      "初回取引のため品質確認に時間を要する。試作費約50,000円が別途必要。量産移行まで2〜3ヶ月。",
    ai_confidence: 0.82,
    is_selected: true,
    rank: 1,
  },
  {
    id: 2,
    proposal_type: "process_change",
    title: "メッキ処理を三価クロメートに変更",
    description:
      "電気亜鉛メッキ + クロメートから三価クロメートに変更することで、環境負荷を低減しつつコスト削減。",
    current_state: {
      surface_treatment: "電気亜鉛メッキ + クロメート",
      cost: 180,
    },
    proposed_state: {
      surface_treatment: "電気亜鉛メッキ + 三価クロメート",
      cost: 130,
    },
    estimated_cost_reduction: 50,
    cost_reduction_percent: 3.0,
    feasibility: "medium",
    feasibility_reasoning:
      "三価クロメートは環境規制対応済みで、多くのサプライヤが対応可能。ただし、耐食性がやや劣るため使用環境の確認が必要。",
    risks:
      "耐食性が6価クロメートより劣る。屋外使用や高湿度環境では推奨されない。設計部門との調整が必要。",
    ai_confidence: 0.65,
    is_selected: false,
    rank: 2,
  },
  {
    id: 3,
    proposal_type: "step_change",
    title: "タップ加工を外部委託から内製化",
    description:
      "現在外注しているタップ加工を、サプライヤの内製工程に変更することで中間マージンを削減。",
    current_state: {
      process: "タップ加工（外注）",
      cost: 220,
    },
    proposed_state: {
      process: "タップ加工（内製）",
      cost: 150,
    },
    estimated_cost_reduction: 70,
    cost_reduction_percent: 4.2,
    feasibility: "medium",
    feasibility_reasoning:
      "A社は社内にタップ加工設備を保有。ただし、現在の生産計画では稼働率が高く、追加受注が可能かは要確認。",
    risks: "A社の設備稼働状況によっては対応不可。納期延長の可能性。",
    ai_confidence: 0.58,
    is_selected: false,
    rank: 3,
  },
  {
    id: 4,
    proposal_type: "combined",
    title: "【複合提案】B社 + 三価クロメート + 工程集約",
    description:
      "サプライヤをB製作所に変更し、メッキを三価クロメートに変更、さらに穴あけ・タップを一括加工することで大幅コスト削減。",
    current_state: {
      supplier: "A金属工業",
      unit_price: 1680,
    },
    proposed_state: {
      supplier: "B製作所",
      unit_price: 1380,
    },
    estimated_cost_reduction: 300,
    cost_reduction_percent: 17.9,
    feasibility: "medium",
    feasibility_reasoning:
      "B製作所は複数提案を一括対応可能と回答。ただし、設計変更承認と品質確認が必要。",
    risks:
      "複数変更を同時実施するため、品質リスクが高まる。段階的導入を推奨。三価クロメートの耐食性確認が必須。",
    ai_confidence: 0.71,
    is_selected: false,
    rank: 4,
  },
];

// 改善シナリオ
export const mockImprovementScenarios = [
  {
    id: 1,
    scenario_name: "シナリオ1: B社変更のみ（保守的）",
    description: "サプライヤをB製作所に変更。その他は現状維持。",
    proposal_ids: [1],
    baseline_cost: 1680,
    simulated_cost: 1550,
    total_cost_reduction: 130,
    cost_reduction_percent: 7.7,
    cost_breakdown: {
      material: 400,
      processing: 690,
      surface_treatment: 180,
      inspection: 80,
      overhead: 120,
      profit: 80,
    },
    is_selected: true,
  },
  {
    id: 2,
    scenario_name: "シナリオ2: A社継続 + 工程改善",
    description: "A社との取引を継続し、メッキ変更とタップ内製化で改善。",
    proposal_ids: [2, 3],
    baseline_cost: 1680,
    simulated_cost: 1560,
    total_cost_reduction: 120,
    cost_reduction_percent: 7.1,
    cost_breakdown: {
      material: 420,
      processing: 660,
      surface_treatment: 130,
      inspection: 80,
      overhead: 150,
      profit: 120,
    },
    is_selected: false,
  },
  {
    id: 3,
    scenario_name: "シナリオ3: 最大削減（複合提案）",
    description: "B社変更 + 三価クロメート + 工程集約で最大削減。",
    proposal_ids: [4],
    baseline_cost: 1680,
    simulated_cost: 1380,
    total_cost_reduction: 300,
    cost_reduction_percent: 17.9,
    cost_breakdown: {
      material: 380,
      processing: 600,
      surface_treatment: 130,
      inspection: 70,
      overhead: 120,
      profit: 80,
    },
    is_selected: false,
  },
];

// 稟議書データ
export const mockApprovalDocument = {
  id: 1,
  project_id: 1,
  document_title: "センサーブラケット 調達先決定の件",
  document_number: "RIN-2026-0420-001",
  selected_comparison_ids: [1, 2],
  selected_scenario_id: 1,
  overall_comment:
    "新型センサーブラケットの調達先として、B製作所を選定したい。A社（現サプライヤ）の見積1,680円に対し、B社は1,550円と130円（7.7%）安価。品質面でも問題なく、納期調整も可能と判断。",
  process_comments: {
    material:
      "材料費は各社ほぼ同等。SPCC-SD 1.6t板材の市場相場から妥当な水準。",
    processing:
      "B社は最新設備を導入しており、加工効率が高い。曲げ・穴あけ工程で優位性あり。",
    surface_treatment:
      "電気亜鉛メッキは外注だが、B社は協力メーカーとの長期契約により安定価格を実現。",
    overall:
      "総合的に見てB社が最適。初回試作費50,000円は必要だが、年間調達数量60,000個を考慮すると十分にペイする。",
  },
  selection_reasoning:
    "品質・価格・納期のバランスを総合評価した結果、B製作所を選定。\n\n【選定理由】\n1. 価格: 130円/個の削減（年間780万円のコスト削減）\n2. 品質: ISO9001認証取得済み、板金加工の豊富な実績\n3. 納期: 45日と長めだが、発注計画の前倒しで対応可能\n4. 取引安定性: 財務状況良好、長期取引実績多数\n\n【A社を選定しなかった理由】\n現サプライヤーであるA社は、管理費・利益率が前回見積から大幅に上昇（130円→220円）しており、コスト競争力が低下。価格交渉を実施したが、「材料高騰と人件費増加」を理由に値下げ困難との回答。",
  future_cost_reduction_plan:
    "【今後のコストダウン施策】\n\n1. 量産安定後の再交渉（6ヶ月後）\n   - 数量増加（5,000→10,000個/月）を前提とした価格交渉\n   - 目標: 1,550円 → 1,450円（▲100円）\n\n2. VA/VE提案の推進\n   - 三価クロメート化による環境対応とコスト削減（▲50円）\n   - タップ加工の最適化（▲30円）\n\n3. 複数社購買体制の構築\n   - D板金との取引開始を検討（競争原理の維持）\n   - 2社購買体制でリスク分散とコスト最適化\n\n4. 設計部門との連携強化\n   - 次期モデルでの形状簡略化検討\n   - DFM（Design for Manufacturing）の推進",
  status: "draft",
  created_at: "2026-04-20 15:30",
};

// レビューコメント
export const mockReviewComments = [
  {
    id: 1,
    project_id: 1,
    reviewer: "佐藤次郎（調達部長）",
    comment_target: "supplier_selection",
    comment:
      "B社選定は妥当と判断。ただし、初回取引のため品質確認を徹底すること。試作品の寸法測定結果と表面処理の耐食性試験結果を必ず提出すること。",
    judgment: "conditional",
    is_resolved: false,
    created_at: "2026-04-20 16:15",
  },
  {
    id: 2,
    project_id: 1,
    reviewer: "鈴木花子（品質保証）",
    comment_target: "process_assessment",
    comment:
      "メッキ処理の品質が重要。B社の協力メーカーのメッキ品質実績を確認したい。可能であれば、事前にサンプル品での耐食性試験（塩水噴霧試験96時間）を実施してほしい。",
    judgment: "revision_required",
    is_resolved: false,
    created_at: "2026-04-20 16:30",
  },
  {
    id: 3,
    project_id: 1,
    reviewer: "佐藤次郎（調達部長）",
    comment_target: "cost_reduction_plan",
    comment:
      "6ヶ月後の再交渉計画は良い。ただし、数量増加の前提条件を明確にすること。販売計画との整合性を確認の上、確実に達成できる数量を提示すること。",
    judgment: "approved",
    is_resolved: true,
    resolution_note: "販売部門と調整し、数量増加計画を確認済み。",
    created_at: "2026-04-20 16:45",
  },
];

// ワークフローステップ
export const mockWorkflowSteps = [
  { step: 1, name: "起案", icon: "edit" },
  { step: 2, name: "類似検索", icon: "search" },
  { step: 3, name: "原価査定", icon: "calculator" },
  { step: 4, name: "改善提案", icon: "lightbulb" },
  { step: 5, name: "見積回収", icon: "inbox" },
  { step: 6, name: "稟議作成", icon: "file-text" },
  { step: 7, name: "レビュー", icon: "check-circle" },
  { step: 8, name: "完了", icon: "check" },
];
