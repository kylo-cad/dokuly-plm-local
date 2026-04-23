// Mock data for AI Tools

export const aiTools = [
  {
    id: "bom-composer",
    name: "BOM Composer",
    name_ja: "BOM Composer",
    icon: "cpu",
    description: "設計意図を明確化し後工程と同期",
    phase: 1,
    phase_name: "商品企画",
    is_active: true,
    usage_count: 12,
    related_artifacts_count: 0,
    last_used: "2026-04-21",
    route: "/ai-tools/bom-composer",
    required_artifacts: [
      { name: "要求仕様書", type: "document", required: true },
    ],
    required_inputs: [
      { name: "目標原価", type: "number", unit: "円", required: true },
      { name: "数量", type: "number", unit: "個", required: false },
    ],
    output_artifacts: [
      { name: "商品企画書", type: "document", format: "PDF" },
      { name: "初期BOM", type: "spreadsheet", format: "Excel" },
    ],
    output_kpis: [
      { name: "推定部品点数", unit: "点" },
      { name: "初期原価見積", unit: "円" },
      { name: "目標との乖離率", unit: "%" },
    ],
  },
  {
    id: "design-review",
    name: "Design Review",
    name_ja: "Design Review",
    icon: "eye",
    description: "検図効率化とナレッジ活用",
    phase: 2,
    phase_name: "製品設計",
    is_active: true,
    usage_count: 8,
    related_artifacts_count: 3,
    last_used: "2026-04-18",
    route: "/ai-tools/design-review",
    required_artifacts: [
      { name: "図面/CAD", type: "cad", required: true },
      { name: "EBOM", type: "spreadsheet", required: true },
      { name: "要求仕様書", type: "document", required: false },
    ],
    required_inputs: [
      { name: "レビュー観点", type: "select", options: ["全般", "コスト", "品質", "製造性"], required: true },
    ],
    output_artifacts: [
      { name: "DRBFM分析表", type: "spreadsheet", format: "Excel" },
      { name: "DR議事録", type: "document", format: "PDF" },
      { name: "指摘事項リスト", type: "document", format: "PDF" },
    ],
    output_kpis: [
      { name: "検出リスク数", unit: "件" },
      { name: "重大リスク数", unit: "件" },
      { name: "コスト削減提案額", unit: "円" },
    ],
  },
  {
    id: "cost-estimation",
    name: "AI Cost Estimation",
    name_ja: "AI原価査定",
    icon: "dollar-sign",
    description: "原価のモノサシを持ち上流で適正化",
    phase: 3,
    phase_name: "原価企画",
    is_active: true,
    usage_count: 24,
    related_artifacts_count: 5,
    last_used: "2026-04-23",
    route: "/ai-cost-estimation",
    required_artifacts: [
      { name: "図面", type: "document", required: true },
      { name: "EBOM", type: "spreadsheet", required: false },
      { name: "仕様書", type: "document", required: false },
    ],
    required_inputs: [
      { name: "生産数量", type: "number", unit: "個/年", required: true },
      { name: "納期", type: "date", required: false },
    ],
    output_artifacts: [
      { name: "見積明細", type: "spreadsheet", format: "Excel" },
      { name: "原価分析レポート", type: "document", format: "PDF" },
      { name: "調達先推奨リスト", type: "spreadsheet", format: "Excel" },
    ],
    output_kpis: [
      { name: "総原価", unit: "円" },
      { name: "材料費比率", unit: "%" },
      { name: "加工費比率", unit: "%" },
      { name: "類似案件との乖離", unit: "%" },
    ],
  },
  {
    id: "process-risk",
    name: "Process Risk Management",
    name_ja: "AI工程リスク管理",
    icon: "alert-triangle",
    description: "工程設計の予見を組織知に",
    phase: 4,
    phase_name: "生産準備",
    is_active: false,
    usage_count: 0,
    related_artifacts_count: 0,
    last_used: null,
    route: "/ai-tools/process-risk",
    required_artifacts: [
      { name: "MBOM/BOP", type: "spreadsheet", required: true },
      { name: "設備仕様書", type: "document", required: true },
      { name: "EBOM", type: "spreadsheet", required: false },
    ],
    required_inputs: [
      { name: "タクトタイム目標", type: "number", unit: "秒/個", required: true },
      { name: "稼働率目標", type: "number", unit: "%", required: false },
    ],
    output_artifacts: [
      { name: "PFMEA分析表", type: "spreadsheet", format: "Excel" },
      { name: "工程リスクレポート", type: "document", format: "PDF" },
      { name: "作業指示書案", type: "document", format: "PDF" },
    ],
    output_kpis: [
      { name: "工程リスク数", unit: "件" },
      { name: "推定不良率", unit: "%" },
      { name: "ボトルネック工程", unit: "箇所" },
    ],
  },
  {
    id: "maintenance-assist",
    name: "Maintenance Assistant",
    name_ja: "AI保全アシスト",
    icon: "tool",
    description: "生まれよく育ち続ける設備に",
    phase: 5,
    phase_name: "生産/保全",
    is_active: false,
    usage_count: 0,
    related_artifacts_count: 0,
    last_used: null,
    route: "/ai-tools/maintenance-assist",
    required_artifacts: [
      { name: "保全計画", type: "spreadsheet", required: true },
      { name: "設備履歴", type: "spreadsheet", required: true },
      { name: "故障記録", type: "document", required: false },
    ],
    required_inputs: [
      { name: "分析期間", type: "daterange", required: true },
      { name: "対象設備", type: "select", required: true },
    ],
    output_artifacts: [
      { name: "保全推奨スケジュール", type: "spreadsheet", format: "Excel" },
      { name: "改修提案書", type: "document", format: "PDF" },
      { name: "予防保全チェックリスト", type: "document", format: "PDF" },
    ],
    output_kpis: [
      { name: "故障予測数", unit: "件" },
      { name: "保全コスト削減", unit: "円" },
      { name: "稼働率改善", unit: "%" },
    ],
  },
];

export const dataFlowLinks = [
  // BOM Composer → Design Review
  { from: "bom-composer", to: "design-review", artifact: "初期BOM" },
  { from: "bom-composer", to: "design-review", artifact: "要求仕様書" },

  // Design Review → Cost Estimation
  { from: "design-review", to: "cost-estimation", artifact: "図面/CAD" },
  { from: "design-review", to: "cost-estimation", artifact: "EBOM" },

  // Cost Estimation → Process Risk
  { from: "cost-estimation", to: "process-risk", artifact: "見積明細" },
  { from: "cost-estimation", to: "process-risk", artifact: "調達先記録" },
];

export const toolExecutionHistory = {
  "bom-composer": [
    {
      id: 1,
      date: "2026-04-20",
      product_name: "スマートウォッチX",
      status: "success",
      artifacts_generated: 2,
    },
    {
      id: 2,
      date: "2026-04-15",
      product_name: "IoTセンサー",
      status: "success",
      artifacts_generated: 2,
    },
  ],
  "design-review": [
    {
      id: 1,
      date: "2026-04-18",
      product_name: "スマートウォッチX",
      status: "success",
      artifacts_generated: 2,
    },
  ],
  "cost-estimation": [
    {
      id: 1,
      date: "2026-04-23",
      product_name: "産業用ロボットアーム",
      status: "success",
      artifacts_generated: 3,
    },
  ],
};

// Mock uploaded artifacts in the system
export const uploadedArtifacts = [
  {
    id: 1,
    name: "要求仕様書_スマートウォッチX.pdf",
    artifact_type: "要求仕様書",
    uploaded_date: "2026-04-15",
    product: "スマートウォッチX",
    file_size: "2.3MB",
  },
  {
    id: 2,
    name: "初期BOM_スマートウォッチX.xlsx",
    artifact_type: "初期BOM",
    uploaded_date: "2026-04-20",
    product: "スマートウォッチX",
    file_size: "156KB",
    generated_by: "bom-composer",
  },
  {
    id: 3,
    name: "CAD図面_ロボットアーム.dwg",
    artifact_type: "図面/CAD",
    uploaded_date: "2026-04-22",
    product: "産業用ロボットアーム",
    file_size: "8.7MB",
  },
  {
    id: 4,
    name: "EBOM_ロボットアーム.xlsx",
    artifact_type: "EBOM",
    uploaded_date: "2026-04-22",
    product: "産業用ロボットアーム",
    file_size: "245KB",
  },
  {
    id: 5,
    name: "要求仕様書_IoTセンサー.pdf",
    artifact_type: "要求仕様書",
    uploaded_date: "2026-04-10",
    product: "IoTセンサー",
    file_size: "1.8MB",
  },
];

// Helper function to check if tool has required data
export const checkToolDataAvailability = (toolId) => {
  const tool = aiTools.find((t) => t.id === toolId);
  if (!tool) return { ready: false, missing: [] };

  const missingArtifacts = [];

  tool.required_artifacts.forEach((required) => {
    if (required.required) {
      const hasArtifact = uploadedArtifacts.some(
        (artifact) => artifact.artifact_type === required.name
      );
      if (!hasArtifact) {
        missingArtifacts.push(required.name);
      }
    }
  });

  return {
    ready: missingArtifacts.length === 0,
    missing: missingArtifacts,
    available: tool.required_artifacts.filter((req) =>
      uploadedArtifacts.some((a) => a.artifact_type === req.name)
    ).map((req) => req.name),
  };
};
