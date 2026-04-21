# AI類似仕様アシスト - 実装計画

## アーキテクチャ概要

### システム構成

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - 要求仕様書アップロードUI                               │
│  - 類似案件検索・選択UI                                   │
│  - リスク評価ダッシュボード                               │
└─────────────────────────────────────────────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────┐
│                 Backend (Django REST API)                │
│  - 要求仕様書管理 API                                     │
│  - 類似度計算 API                                        │
│  - リスク評価 API                                        │
└─────────────────────────────────────────────────────────┘
                           ↓↑
┌──────────────────┬──────────────────┬──────────────────┐
│  AI Pipeline     │  Knowledge Graph │  Risk Engine     │
│  (Gemini API)    │  (RFLP)          │  (DRBFM)         │
│  - OCR           │  - 要求(R)       │  - 不具合予測     │
│  - 構造化        │  - 機能(F)       │  - コスト推論     │
│  - 類似度計算    │  - 論理(L)       │  - 環境規制       │
│                  │  - 物理(P)       │                  │
└──────────────────┴──────────────────┴──────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────┐
│                PostgreSQL Database                       │
│  - spec_requirements (要求仕様)                          │
│  - spec_similarity_index (類似度インデックス)            │
│  - rflp_knowledge_graph (RFLPグラフ)                     │
│  - risk_assessments (リスク評価)                         │
│  - failure_modes (故障モード)                            │
└─────────────────────────────────────────────────────────┘
```

## ディレクトリ構造

```
dokuly/
├── ai_spec_assistant/          # 新規Djangoアプリ
│   ├── __init__.py
│   ├── models.py               # データモデル
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── ai_pipeline/            # AIパイプライン
│   │   ├── gemini_client.py    # Gemini API統合
│   │   ├── ocr_processor.py    # OCR処理
│   │   ├── spec_parser.py      # 仕様書構造化
│   │   └── similarity.py       # 類似度計算
│   ├── rflp/                   # RFLPナレッジグラフ
│   │   ├── graph_builder.py
│   │   ├── intent_matcher.py
│   │   └── models.py
│   ├── risk/                   # リスク評価エンジン
│   │   ├── drbfm.py            # DRBFM推論
│   │   ├── cost_estimator.py  # コスト推論
│   │   └── compliance.py      # 環境規制チェック
│   └── migrations/
├── frontend/src/components/
│   └── ai_spec_assistant/      # フロントエンド
│       ├── SpecUpload.js       # 仕様書アップロード
│       ├── SimilarProjectList.js  # 類似案件一覧
│       ├── SpecComparison.js   # 仕様差分比較
│       ├── RiskDashboard.js    # リスクダッシュボード
│       └── ReviewWorkflow.js   # レビューワークフロー
└── docs/features/
    ├── ai-spec-assistant.md
    └── ai-spec-assistant-implementation.md  # このファイル
```

## データモデル設計

### 1. SpecRequirement (要求仕様)

```python
class SpecRequirement(models.Model):
    """要求仕様書データモデル"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True)
    
    # 基本情報
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # 構造化された仕様データ (JSON)
    structured_specs = models.JSONField(default=dict)
    # 例: {
    #   "材料": {"value": "SUS304", "confidence": 0.95, "page": 3},
    #   "モータータイプ": {"value": "サーボ", "confidence": 0.88, "page": 5},
    #   ...
    # }
    
    # RFLP構造
    requirements = models.JSONField(default=list)  # 要求(R)
    functions = models.JSONField(default=list)     # 機能(F)
    logical = models.JSONField(default=list)       # 論理(L)
    physical = models.JSONField(default=list)      # 物理(P)
    
    # AI処理状態
    ai_processing_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    
    class Meta:
        db_table = 'ai_spec_requirement'
```

### 2. SpecSimilarity (類似度)

```python
class SpecSimilarity(models.Model):
    """仕様の類似度インデックス"""
    source_spec = models.ForeignKey(
        SpecRequirement, 
        on_delete=models.CASCADE,
        related_name='similarities_as_source'
    )
    target_spec = models.ForeignKey(
        SpecRequirement,
        on_delete=models.CASCADE,
        related_name='similarities_as_target'
    )
    
    # 類似度スコア
    overall_similarity = models.FloatField()  # 全体類似度 (0-1)
    spec_similarity = models.JSONField()      # 仕様項目別類似度
    rflp_similarity = models.JSONField()      # RFLP別類似度
    
    # 差分情報
    spec_differences = models.JSONField()     # 仕様差分
    
    calculated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ai_spec_similarity'
        unique_together = ('source_spec', 'target_spec')
```

### 3. RiskAssessment (リスク評価)

```python
class RiskAssessment(models.Model):
    """リスク評価データ"""
    spec_requirement = models.ForeignKey(
        SpecRequirement,
        on_delete=models.CASCADE
    )
    base_model = models.ForeignKey(
        Assembly,
        on_delete=models.SET_NULL,
        null=True,
        related_name='base_assemblies'
    )
    
    # DRBFM分析結果
    change_points = models.JSONField(default=list)
    # 例: [
    #   {
    #     "item": "バッテリー容量",
    #     "from": "300mAh",
    #     "to": "500mAh",
    #     "concern": "発熱リスク増加",
    #     "severity": "medium"
    #   }
    # ]
    
    # リスク評価
    quality_risks = models.JSONField(default=list)
    delivery_risks = models.JSONField(default=list)
    cost_risks = models.JSONField(default=list)
    
    # 不具合予測
    predicted_failures = models.JSONField(default=list)
    
    # コスト推論
    estimated_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True
    )
    cost_breakdown = models.JSONField(default=dict)
    
    # 環境規制チェック
    compliance_alerts = models.JSONField(default=list)
    
    reviewed = models.BooleanField(default=False)
    reviewer = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_risk_assessment'
```

### 4. FailureMode (故障モード)

```python
class FailureMode(models.Model):
    """故障モードデータベース"""
    part = models.ForeignKey(
        Part,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    assembly = models.ForeignKey(
        Assembly,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    # 故障情報
    failure_type = models.CharField(max_length=100)
    description = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=[
            ('critical', 'Critical'),
            ('high', 'High'),
            ('medium', 'Medium'),
            ('low', 'Low'),
        ]
    )
    
    # 発生条件
    conditions = models.JSONField(default=dict)
    
    # 対策
    countermeasures = models.TextField(blank=True)
    
    # 統計
    occurrence_count = models.IntegerField(default=0)
    
    # 元データへのリンク
    source_document = models.ForeignKey(
        Document,
        on_delete=models.SET_NULL,
        null=True
    )
    
    class Meta:
        db_table = 'ai_failure_mode'
```

## API設計

### 1. 要求仕様書アップロード

```
POST /api/ai-spec-assistant/requirements/upload/
Content-Type: multipart/form-data

Request:
- file: PDF/TIFF/PNG
- project_id: int
- name: string

Response:
{
  "id": 123,
  "name": "新製品仕様書 v1.0",
  "ai_processing_status": "processing",
  "message": "仕様書を解析中です。完了まで数分かかります。"
}
```

### 2. 類似案件検索

```
POST /api/ai-spec-assistant/requirements/{id}/find-similar/

Request:
{
  "must_match_specs": ["材料", "モータータイプ"],  // 完全一致させたい仕様
  "max_results": 10,
  "project_filter": [101, 102]  // オプション: 特定プロジェクトのみ
}

Response:
{
  "similar_projects": [
    {
      "spec_requirement_id": 456,
      "project_id": 101,
      "project_name": "スマートウォッチ v1",
      "similarity_score": 0.87,
      "spec_differences": {
        "バッテリー容量": {"source": "500mAh", "target": "300mAh"},
        "ディスプレイサイズ": {"source": "1.5\"", "target": "1.3\""}
      },
      "cost_estimate": 3450
    },
    ...
  ]
}
```

### 3. リスク評価

```
POST /api/ai-spec-assistant/requirements/{id}/assess-risk/

Request:
{
  "base_model_id": 101,  // Assemblyのid
  "changed_parts": [
    {
      "part_id": 234,
      "reason": "バッテリー容量増加"
    }
  ]
}

Response:
{
  "risk_assessment_id": 789,
  "change_points": [...],
  "quality_risks": [
    {
      "category": "発熱",
      "severity": "medium",
      "description": "バッテリー容量増加により発熱リスクが上昇",
      "source": "過去案件 #456 で同様の変更により温度上昇"
    }
  ],
  "delivery_risks": [...],
  "cost_risks": [...],
  "estimated_cost": 4200,
  "compliance_alerts": []
}
```

## Gemini API統合

### 仕様書構造化フロー

```python
# dokuly/ai_spec_assistant/ai_pipeline/gemini_client.py

import google.generativeai as genai
from django.conf import settings

class GeminiSpecParser:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-pro')
    
    def parse_specification_document(self, pdf_path):
        """
        PDF仕様書を構造化データに変換
        """
        # PDFをアップロード
        uploaded_file = genai.upload_file(pdf_path)
        
        # プロンプト設計
        prompt = """
        この仕様書から以下の情報を抽出し、JSON形式で出力してください：
        
        1. 基本仕様（材料、サイズ、重量など）
        2. 性能仕様（電圧、電流、出力など）
        3. 環境仕様（動作温度、湿度など）
        4. 規格・認証（CE、UL、RoHSなど）
        
        各仕様項目について：
        - value: 仕様値
        - unit: 単位（あれば）
        - page: ページ番号
        - confidence: 確信度（0-1）
        
        出力形式：
        {
          "基本仕様": {
            "材料": {"value": "SUS304", "page": 3, "confidence": 0.95},
            ...
          },
          ...
        }
        """
        
        # Gemini実行
        response = self.model.generate_content([uploaded_file, prompt])
        
        # JSON解析
        import json
        structured_data = json.loads(response.text)
        
        return structured_data
```

## フロントエンドコンポーネント

### 要求仕様書アップロード

```javascript
// dokuly/frontend/src/components/ai_spec_assistant/SpecUpload.js

import React, { useState } from 'react';
import { uploadSpecification } from './queries';

const SpecUpload = ({ projectId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    
    const response = await uploadSpecification(formData);
    
    if (response.ai_processing_status === 'processing') {
      // ポーリングで処理完了を待つ
      pollProcessingStatus(response.id);
    }
  };
  
  return (
    <div className="card">
      <h3>要求仕様書アップロード</h3>
      <input 
        type="file" 
        accept=".pdf,.tiff,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'アップロード中...' : 'アップロード'}
      </button>
    </div>
  );
};
```

## 次のステップ

### 今週（Week 1）
- [ ] データモデル実装
- [ ] マイグレーション作成
- [ ] Gemini API統合POC

### 来週（Week 2）
- [ ] 仕様書アップロードAPI実装
- [ ] 基本UI実装
- [ ] OCR処理パイプライン構築

### Week 3-4
- [ ] 類似度計算エンジン実装
- [ ] RFLP知識グラフ構築
- [ ] 類似案件検索UI

---

**更新日**: 2026-04-21
**担当**: Development Team
**ステータス**: 設計完了・実装準備中
