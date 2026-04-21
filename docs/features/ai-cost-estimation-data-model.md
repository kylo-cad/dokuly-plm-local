# AI原価査定機能 - データモデル設計

## 1. データモデル全体構造

```
Organization
  └── CostEstimationProject (原価査定プロジェクト)
      ├── ProjectItem (査定対象品目)
      │   ├── DrawingFile (図面ファイル)
      │   ├── ProcessSheet (QC工程表)
      │   ├── Quotation (見積書)
      │   │   └── QuotationLine (見積明細行)
      │   └── ProcessStep (工程ステップ)
      ├── SimilarityAnalysis (類似性分析)
      │   └── SimilarItem (類似品候補)
      ├── CostAnalysis (原価分析)
      │   ├── CostBreakdown (原価内訳)
      │   └── CostComparison (原価比較)
      ├── ImprovementProposal (改善提案)
      │   └── ImprovementScenario (改善シナリオ)
      ├── ApprovalDocument (稟議書類)
      └── ReviewComment (レビューコメント)
```

---

## 2. モデル詳細定義

### 2.1 CostEstimationProject (原価査定プロジェクト)

**目的**: 原価査定の案件全体を管理

```python
class CostEstimationProject(models.Model):
    """原価査定プロジェクト"""
    
    # 基本情報
    project_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # 目的・タイプ
    estimation_type = models.CharField(
        max_length=50,
        choices=[
            ('rfq', 'RFQ見積'),
            ('cost_review', 'コストレビュー'),
            ('cost_planning', '原価企画'),
            ('procurement', '調達査定'),
            ('cost_reduction', '原価低減'),
        ]
    )
    
    # ステータス
    status = models.CharField(
        max_length=50,
        choices=[
            ('draft', '起案中'),
            ('analyzing', '査定中'),
            ('quote_waiting', '見積回収中'),
            ('reviewing', 'レビュー中'),
            ('approved', '承認済'),
            ('completed', '完了'),
        ],
        default='draft'
    )
    
    # 見積ラウンド
    quote_round = models.IntegerField(default=1)  # 1回目、2回目...
    
    # 前回プロジェクト（2回目見積の場合）
    previous_project = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='next_projects'
    )
    
    # 関連Dokulyプロジェクト
    dokuly_project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # 組織
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE
    )
    
    # 担当者・レビュー者
    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='cost_estimation_projects'
    )
    reviewers = models.ManyToManyField(
        User,
        blank=True,
        related_name='review_cost_estimation_projects'
    )
    
    # 期限
    target_date = models.DateField(null=True, blank=True)
    
    # 目標原価・予算
    target_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    currency = models.CharField(max_length=3, default='JPY')
    
    # 監査証跡
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_cost_estimation_projects'
    )
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['assignee', 'status']),
        ]
```

---

### 2.2 ProjectItem (査定対象品目)

**目的**: プロジェクト内の査定対象品目（複数品目対応）

```python
class ProjectItem(models.Model):
    """査定対象品目"""
    
    project = models.ForeignKey(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='items'
    )
    
    # 品目識別
    item_number = models.CharField(max_length=100)
    item_name = models.CharField(max_length=200)
    
    # Dokulyの既存Part/Assembly等への参照
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    related_item = GenericForeignKey('content_type', 'object_id')
    
    # 流用元品目（設計変更の場合）
    source_item = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='derived_items'
    )
    change_description = models.TextField(blank=True)  # 変化点説明
    
    # 数量・単位
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit = models.CharField(max_length=20, default='pcs')
    
    # 製造カテゴリ
    manufacturing_category = models.CharField(
        max_length=50,
        choices=[
            ('press', 'プレス'),
            ('plastic', '樹脂成形'),
            ('die_cast', 'ダイカスト'),
            ('rubber', 'ゴム'),
            ('machining', '機械加工'),
            ('sheet_metal', '板金'),
            ('casting', '鋳物'),
            ('other', 'その他'),
        ],
        blank=True
    )
    
    # 基本仕様
    material = models.CharField(max_length=100, blank=True)
    surface_treatment = models.CharField(max_length=100, blank=True)
    
    # 寸法（mm）
    max_dimension_x = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_dimension_y = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_dimension_z = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)  # kg
    
    # AI解析結果
    ai_analyzed_specs = models.JSONField(
        default=dict,
        blank=True,
        help_text="AI extracted specifications from drawings"
    )
    
    # ユーザー入力・修正したスペック
    user_specs = models.JSONField(
        default=dict,
        blank=True,
        help_text="User-modified specifications"
    )
    
    # ソート順
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['project', 'sort_order']
        unique_together = [['project', 'item_number']]
```

---

### 2.3 DrawingFile (図面ファイル)

**目的**: 図面ファイルの管理とAI解析結果保存

```python
class DrawingFile(models.Model):
    """図面ファイル"""
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='drawings'
    )
    
    # ファイル
    file = models.ForeignKey(
        'files.File',
        on_delete=models.CASCADE
    )
    
    # 図面タイプ
    drawing_type = models.CharField(
        max_length=20,
        choices=[
            ('2d', '2D図面'),
            ('3d', '3Dモデル'),
            ('sketch', 'ポンチ絵'),
        ]
    )
    
    # AI解析結果
    ai_analysis_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', '未処理'),
            ('processing', '処理中'),
            ('completed', '完了'),
            ('failed', '失敗'),
        ],
        default='pending'
    )
    
    ai_analysis_result = models.JSONField(
        default=dict,
        blank=True,
        help_text="""
        {
          "material": "SUS304",
          "surface_treatment": "電解研磨",
          "dimensions": {"x": 100, "y": 50, "z": 10},
          "tolerances": [
            {"type": "平面度", "value": 0.05},
            {"type": "寸法公差", "value": "±0.1"}
          ],
          "features": ["穴加工", "曲げ加工"],
          "complexity_score": 0.65,
          "estimated_processes": ["板金切断", "曲げ", "穴あけ", "バリ取り"]
        }
        """
    )
    
    # 形状ベクトル（類似検索用）
    shape_embedding = ArrayField(
        models.FloatField(),
        size=512,
        null=True,
        blank=True,
        help_text="Shape embedding vector for similarity search"
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
```

---

### 2.4 ProcessSheet (QC工程表)

**目的**: QC工程表の管理とAI解析

```python
class ProcessSheet(models.Model):
    """QC工程表"""
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='process_sheets'
    )
    
    # ファイル
    file = models.ForeignKey(
        'files.File',
        on_delete=models.CASCADE
    )
    
    # サプライヤ
    supplier = models.ForeignKey(
        'purchasing.Supplier',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # AI解析結果
    ai_analysis_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', '未処理'),
            ('processing', '処理中'),
            ('completed', '完了'),
            ('failed', '失敗'),
        ],
        default='pending'
    )
    
    ai_extracted_processes = models.JSONField(
        default=list,
        blank=True,
        help_text="""
        [
          {
            "step_number": 1,
            "process_name": "材料切断",
            "machine": "シャーリング",
            "time_minutes": 2.5,
            "labor_cost": 500,
            "equipment_cost": 200
          },
          ...
        ]
        """
    )
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
```

---

### 2.5 Quotation (見積書)

**目的**: サプライヤからの見積書管理

```python
class Quotation(models.Model):
    """見積書"""
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='quotations'
    )
    
    # 見積情報
    quotation_number = models.CharField(max_length=100, blank=True)
    quotation_date = models.DateField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)
    
    # サプライヤ
    supplier = models.ForeignKey(
        'purchasing.Supplier',
        on_delete=models.SET_NULL,
        null=True
    )
    supplier_name = models.CharField(max_length=200, blank=True)
    
    # ファイル
    file = models.ForeignKey(
        'files.File',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # 見積金額
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    currency = models.CharField(max_length=3, default='JPY')
    
    # 数量・納期
    quoted_quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    lead_time_days = models.IntegerField(null=True, blank=True)
    
    # サプライヤコメント（AI抽出）
    supplier_comment = models.TextField(blank=True)
    
    # AI解析結果
    ai_analysis_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', '未処理'),
            ('processing', '処理中'),
            ('completed', '完了'),
            ('failed', '失敗'),
        ],
        default='pending'
    )
    
    # 選択状態
    is_selected = models.BooleanField(default=False)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    
    class Meta:
        ordering = ['item', 'quotation_date']
```

---

### 2.6 QuotationLine (見積明細行)

**目的**: 見積書の詳細内訳（工程別原価）

```python
class QuotationLine(models.Model):
    """見積明細行"""
    
    quotation = models.ForeignKey(
        Quotation,
        on_delete=models.CASCADE,
        related_name='lines'
    )
    
    # 明細情報
    line_number = models.IntegerField()
    item_description = models.CharField(max_length=200)
    
    # 原価項目
    cost_category = models.CharField(
        max_length=50,
        choices=[
            ('material', '材料費'),
            ('labor', '労務費'),
            ('equipment', '設備費'),
            ('tooling', '治工具費'),
            ('mold', '金型費'),
            ('processing', '加工費'),
            ('surface_treatment', '表面処理費'),
            ('inspection', '検査費'),
            ('packaging', '梱包費'),
            ('overhead', '間接費'),
            ('profit', '利益'),
            ('other', 'その他'),
        ]
    )
    
    # 工程名
    process_name = models.CharField(max_length=100, blank=True)
    
    # 金額
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # 補足情報
    notes = models.TextField(blank=True)
    
    # ソート順
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['quotation', 'sort_order', 'line_number']
```

---

### 2.7 ProcessStep (工程ステップ)

**目的**: 品目の製造工程を管理（多工程対応）

```python
class ProcessStep(models.Model):
    """製造工程ステップ"""
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='process_steps'
    )
    
    # 工程情報
    step_number = models.IntegerField()
    process_name = models.CharField(max_length=100)
    process_type = models.CharField(
        max_length=50,
        choices=[
            ('cutting', '切断'),
            ('forming', '成形'),
            ('pressing', 'プレス'),
            ('bending', '曲げ'),
            ('drilling', '穴あけ'),
            ('welding', '溶接'),
            ('machining', '機械加工'),
            ('surface_treatment', '表面処理'),
            ('painting', '塗装'),
            ('assembly', '組立'),
            ('inspection', '検査'),
            ('packaging', '梱包'),
            ('other', 'その他'),
        ]
    )
    
    # サプライヤ（多工程の場合、工程ごとに異なる可能性）
    supplier = models.ForeignKey(
        'purchasing.Supplier',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # 工程詳細
    machine_type = models.CharField(max_length=100, blank=True)
    setup_time_minutes = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    cycle_time_minutes = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # AI推論結果
    is_ai_estimated = models.BooleanField(default=False)
    ai_confidence = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="AI推論の確信度 (0.00-1.00)"
    )
    
    # ユーザー編集フラグ
    is_user_modified = models.BooleanField(default=False)
    
    # ソート順
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['item', 'sort_order', 'step_number']
        unique_together = [['item', 'step_number']]
```

---

### 2.8 SimilarityAnalysis (類似性分析)

**目的**: 類似品検索結果を保存

```python
class SimilarityAnalysis(models.Model):
    """類似性分析"""
    
    project = models.OneToOneField(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='similarity_analysis'
    )
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='similarity_analyses'
    )
    
    # 分析パラメータ
    search_params = models.JSONField(
        default=dict,
        help_text="""
        {
          "shape_weight": 0.7,
          "metadata_weight": 0.2,
          "process_weight": 0.1,
          "dimension_tolerance": 0.3,
          "material_filter": "SUS304",
          "surface_treatment_filter": null
        }
        """
    )
    
    # 分析ステータス
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', '未処理'),
            ('processing', '処理中'),
            ('completed', '完了'),
            ('failed', '失敗'),
        ],
        default='pending'
    )
    
    # AI分析結果サマリ
    total_candidates = models.IntegerField(default=0)
    filtered_candidates = models.IntegerField(default=0)
    
    analyzed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Similarity analyses"
```

---

### 2.9 SimilarItem (類似品候補)

**目的**: 類似品の候補とスコアを保存

```python
class SimilarItem(models.Model):
    """類似品候補"""
    
    analysis = models.ForeignKey(
        SimilarityAnalysis,
        on_delete=models.CASCADE,
        related_name='candidates'
    )
    
    # 類似品目（Dokulyの既存アイテム）
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    similar_item = GenericForeignKey('content_type', 'object_id')
    
    # または過去の査定プロジェクト品目
    similar_project_item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='similar_to'
    )
    
    # スコア
    total_similarity_score = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        help_text="総合類似度スコア (0.0000-1.0000)"
    )
    shape_similarity_score = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        null=True,
        blank=True
    )
    metadata_similarity_score = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        null=True,
        blank=True
    )
    process_similarity_score = models.DecimalField(
        max_digits=5,
        decimal_places=4,
        null=True,
        blank=True
    )
    
    # 差分情報
    differences = models.JSONField(
        default=dict,
        help_text="""
        {
          "dimension_diff": {"x": 10, "y": 5, "z": 0},
          "dimension_diff_percent": {"x": 0.1, "y": 0.05, "z": 0},
          "material_diff": null,
          "surface_treatment_diff": "電解研磨 → バフ研磨",
          "feature_diffs": ["穴径変更 φ5→φ6", "R形状追加"]
        }
        """
    )
    
    # AI推論の差分コスト影響
    estimated_cost_impact = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="差分による推定コスト影響額"
    )
    cost_impact_reasoning = models.TextField(
        blank=True,
        help_text="コスト影響の推論根拠"
    )
    
    # 選択状態
    is_selected_for_comparison = models.BooleanField(default=False)
    is_user_added = models.BooleanField(default=False)  # 手動追加
    
    # ランキング
    rank = models.IntegerField()
    
    class Meta:
        ordering = ['analysis', 'rank']
        unique_together = [['analysis', 'rank']]
```

---

### 2.10 CostAnalysis (原価分析)

**目的**: 原価分析結果の保存

```python
class CostAnalysis(models.Model):
    """原価分析"""
    
    project = models.OneToOneField(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='cost_analysis'
    )
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='cost_analyses'
    )
    
    # 分析タイプ
    analysis_type = models.CharField(
        max_length=50,
        choices=[
            ('feasibility', '妥当原価推論'),
            ('validity', '見積妥当性推論'),
            ('improvement', '改善余地特定'),
        ]
    )
    
    # AI推論原価
    ai_estimated_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    ai_cost_range_min = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    ai_cost_range_max = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    ai_confidence = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # 推論根拠
    reasoning = models.TextField(blank=True)
    
    # 類似品価格レンジ（箱ひげ図用）
    similar_items_cost_stats = models.JSONField(
        default=dict,
        help_text="""
        {
          "min": 1000,
          "q1": 1200,
          "median": 1500,
          "q3": 1800,
          "max": 2500,
          "mean": 1550,
          "count": 15
        }
        """
    )
    
    # 分析ステータス
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', '未処理'),
            ('processing', '処理中'),
            ('completed', '完了'),
            ('failed', '失敗'),
        ],
        default='pending'
    )
    
    analyzed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Cost analyses"
```

---

### 2.11 CostBreakdown (原価内訳)

**目的**: AI推論またはユーザー入力による原価内訳

```python
class CostBreakdown(models.Model):
    """原価内訳"""
    
    analysis = models.ForeignKey(
        CostAnalysis,
        on_delete=models.CASCADE,
        related_name='breakdowns'
    )
    
    # 原価項目
    cost_category = models.CharField(
        max_length=50,
        choices=[
            ('material', '材料費'),
            ('labor', '労務費'),
            ('equipment', '設備費'),
            ('tooling', '治工具費'),
            ('mold', '金型費'),
            ('processing', '加工費'),
            ('surface_treatment', '表面処理費'),
            ('inspection', '検査費'),
            ('packaging', '梱包費'),
            ('overhead', '間接費'),
            ('profit', '利益'),
            ('other', 'その他'),
        ]
    )
    
    # 工程ステップ参照（該当する場合）
    process_step = models.ForeignKey(
        ProcessStep,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # 金額
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # 計算ロジック
    calculation_logic = models.TextField(
        blank=True,
        help_text="例: チャージ500円/時間 × 工数2.5時間 = 1,250円"
    )
    
    # AI推論 or ユーザー入力
    is_ai_estimated = models.BooleanField(default=False)
    is_user_modified = models.BooleanField(default=False)
    
    # 金型・治具の償却設定
    amortization_type = models.CharField(
        max_length=20,
        choices=[
            ('none', '償却なし'),
            ('equal_24', '24ヶ月均等償却'),
            ('lifetime_qty', 'ライフ数量割'),
            ('lifetime_years', '寿命年数割'),
        ],
        blank=True
    )
    
    # ソート順
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['analysis', 'sort_order']
```

---

### 2.12 CostComparison (原価比較)

**目的**: 当該品目と類似品のコスト比較

```python
class CostComparison(models.Model):
    """原価比較"""
    
    analysis = models.ForeignKey(
        CostAnalysis,
        on_delete=models.CASCADE,
        related_name='comparisons'
    )
    
    # 比較対象（類似品）
    similar_item = models.ForeignKey(
        SimilarItem,
        on_delete=models.CASCADE
    )
    
    # 比較結果
    current_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="当該品目の現在価格"
    )
    reference_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="類似品の価格"
    )
    cost_difference = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="価格差分"
    )
    cost_difference_percent = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="価格差分率（%）"
    )
    
    # AI判定
    validity_judgment = models.CharField(
        max_length=20,
        choices=[
            ('appropriate', '妥当'),
            ('high', '割高'),
            ('low', '割安'),
            ('uncertain', '判定不能'),
        ],
        blank=True
    )
    judgment_reasoning = models.TextField(blank=True)
    
    # 工程別比較
    process_comparison = models.JSONField(
        default=list,
        help_text="""
        [
          {
            "process": "材料費",
            "current": 500,
            "reference": 450,
            "diff": 50,
            "diff_percent": 11.1,
            "reasoning": "材質がSUS304→SUS316に変更のため妥当"
          },
          ...
        ]
        """
    )
    
    # 除外フラグ（ユーザーが比較から除外した工程）
    excluded_processes = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=True
    )
```

---

### 2.13 ImprovementProposal (改善提案)

**目的**: AI生成の改善提案を管理

```python
class ImprovementProposal(models.Model):
    """改善提案"""
    
    project = models.ForeignKey(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='improvement_proposals'
    )
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='improvement_proposals'
    )
    
    # 提案タイプ
    proposal_type = models.CharField(
        max_length=50,
        choices=[
            ('supplier_change', 'サプライヤ変更'),
            ('process_change', '工法変更'),
            ('step_change', '工程変更'),
            ('material_change', '材料変更'),
            ('design_change', '設計変更'),
            ('combined', '複合改善'),
        ]
    )
    
    # 提案内容
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # 現状と提案
    current_state = models.JSONField(default=dict)
    proposed_state = models.JSONField(default=dict)
    
    # 効果金額
    estimated_cost_reduction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    cost_reduction_percent = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # 実現可能性
    feasibility = models.CharField(
        max_length=20,
        choices=[
            ('high', '高'),
            ('medium', '中'),
            ('low', '低'),
        ],
        blank=True
    )
    feasibility_reasoning = models.TextField(blank=True)
    
    # リスク
    risks = models.TextField(blank=True)
    
    # AI信頼度
    ai_confidence = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # ユーザーアクション
    is_selected = models.BooleanField(default=False)
    user_notes = models.TextField(blank=True)
    
    # ランキング
    rank = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['project', 'rank']
```

---

### 2.14 ImprovementScenario (改善シナリオ)

**目的**: 複数の改善提案を組み合わせたシミュレーション

```python
class ImprovementScenario(models.Model):
    """改善シナリオ（シミュレーション）"""
    
    project = models.ForeignKey(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='scenarios'
    )
    
    item = models.ForeignKey(
        ProjectItem,
        on_delete=models.CASCADE,
        related_name='scenarios'
    )
    
    # シナリオ情報
    scenario_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # 採用する改善提案
    proposals = models.ManyToManyField(
        ImprovementProposal,
        related_name='scenarios'
    )
    
    # シミュレーション結果
    baseline_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="現状原価"
    )
    simulated_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="シミュレーション原価"
    )
    total_cost_reduction = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="総削減額"
    )
    cost_reduction_percent = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="削減率(%)"
    )
    
    # 詳細内訳
    cost_breakdown = models.JSONField(
        default=dict,
        help_text="工程別・項目別の原価内訳"
    )
    
    # 選択状態（稟議書に使用）
    is_selected = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    
    class Meta:
        ordering = ['project', '-total_cost_reduction']
```

---

### 2.15 ApprovalDocument (稟議書類)

**目的**: 稟議書の生成と管理

```python
class ApprovalDocument(models.Model):
    """稟議書類"""
    
    project = models.OneToOneField(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='approval_document'
    )
    
    # 稟議書情報
    document_title = models.CharField(max_length=200)
    document_number = models.CharField(max_length=100, blank=True)
    
    # 比較対象の選択
    selected_comparisons = models.ManyToManyField(
        SimilarItem,
        blank=True,
        related_name='approval_documents'
    )
    
    # 選択したシナリオ
    selected_scenario = models.ForeignKey(
        ImprovementScenario,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # 稟議コメント
    overall_comment = models.TextField(blank=True)
    process_comments = models.JSONField(
        default=dict,
        help_text="""
        {
          "material": "材質変更により+50円は妥当",
          "processing": "A社の工程改善により-100円達成",
          ...
        }
        """
    )
    selection_reasoning = models.TextField(
        blank=True,
        help_text="サプライヤ選定理由"
    )
    future_cost_reduction_plan = models.TextField(
        blank=True,
        help_text="今後のコストダウンに向けて"
    )
    
    # 出力ファイル
    generated_file = models.ForeignKey(
        'files.File',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approval_documents'
    )
    
    # ステータス
    status = models.CharField(
        max_length=20,
        choices=[
            ('draft', '下書き'),
            ('submitted', '提出済'),
            ('approved', '承認済'),
            ('rejected', '差し戻し'),
        ],
        default='draft'
    )
    
    # 監査証跡
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_approval_documents'
    )
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
```

---

### 2.16 ReviewComment (レビューコメント)

**目的**: 社内レビュー者のコメント管理

```python
class ReviewComment(models.Model):
    """レビューコメント"""
    
    project = models.ForeignKey(
        CostEstimationProject,
        on_delete=models.CASCADE,
        related_name='review_comments'
    )
    
    # レビュー者
    reviewer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='cost_review_comments'
    )
    
    # コメント対象
    comment_target = models.CharField(
        max_length=50,
        choices=[
            ('comparison_selection', '比較査定対象'),
            ('process_assessment', '各工程の査定'),
            ('cost_reduction_plan', 'コストダウン展望'),
            ('supplier_selection', 'サプライヤ選定'),
            ('overall', '全体'),
        ]
    )
    
    # コメント内容
    comment = models.TextField()
    
    # 判定
    judgment = models.CharField(
        max_length=20,
        choices=[
            ('approved', '承認'),
            ('conditional', '条件付承認'),
            ('revision_required', '要修正'),
            ('rejected', '否認'),
        ],
        blank=True
    )
    
    # ステータス
    is_resolved = models.BooleanField(default=False)
    resolution_note = models.TextField(blank=True)
    
    # 監査証跡
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['project', 'created_at']
```

---

## 3. データフロー図

```
[初期データ投入]
  DrawingFile, ProcessSheet, Quotation (過去データ)
    ↓ AI解析
  AIが構造化データ抽出
    ↓
[プロジェクト作成]
  CostEstimationProject → ProjectItem
    ↓
  DrawingFile, Quotation (新規)
    ↓ AI解析
  ai_analysis_result, ai_extracted_processes
    ↓
[類似検索]
  SimilarityAnalysis → SimilarItem[]
    ↓ ユーザー選択
  is_selected_for_comparison = True
    ↓
[原価分析]
  CostAnalysis
    ├→ CostBreakdown[] (AI推論原価内訳)
    └→ CostComparison[] (類似品との比較)
    ↓
[改善提案]
  ImprovementProposal[]
    ↓ ユーザーシミュレーション
  ImprovementScenario
    ↓
[稟議書作成]
  ApprovalDocument
    ↓
[レビュー]
  ReviewComment[]
    ↓
[完了]
  ステータス = 'approved'
```

---

## 4. マスターデータ

### 4.1 CostItemMapping (原価項目マッピングマスタ)

**目的**: サプライヤごとに異なる原価項目名を標準化

```python
class CostItemMapping(models.Model):
    """原価項目マッピングマスタ"""
    
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE
    )
    
    # サプライヤ（nullの場合は全サプライヤ共通）
    supplier = models.ForeignKey(
        'purchasing.Supplier',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    # サプライヤの表記
    supplier_term = models.CharField(max_length=100)
    
    # 標準項目
    standard_category = models.CharField(
        max_length=50,
        choices=QuotationLine._meta.get_field('cost_category').choices
    )
    
    # 同義語
    synonyms = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True
    )
    
    class Meta:
        unique_together = [['organization', 'supplier', 'supplier_term']]
```

### 4.2 ProcessTemplate (工程テンプレート)

**目的**: 製造カテゴリごとの標準工程テンプレート

```python
class ProcessTemplate(models.Model):
    """工程テンプレート"""
    
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE
    )
    
    manufacturing_category = models.CharField(
        max_length=50,
        choices=ProjectItem._meta.get_field('manufacturing_category').choices
    )
    
    template_name = models.CharField(max_length=100)
    
    # 標準工程ステップ
    standard_steps = models.JSONField(
        default=list,
        help_text="""
        [
          {"step": 1, "process": "材料切断", "type": "cutting"},
          {"step": 2, "process": "プレス成形", "type": "pressing"},
          ...
        ]
        """
    )
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = [['organization', 'manufacturing_category', 'template_name']]
```

---

## 5. インデックス戦略

### 重要なインデックス

```python
# CostEstimationProject
indexes = [
    models.Index(fields=['organization', 'status']),
    models.Index(fields=['assignee', 'status']),
    models.Index(fields=['created_at']),
]

# ProjectItem
indexes = [
    models.Index(fields=['project']),
    models.Index(fields=['manufacturing_category']),
]

# DrawingFile
indexes = [
    models.Index(fields=['item', 'drawing_type']),
    models.Index(fields=['ai_analysis_status']),
]

# SimilarItem
indexes = [
    models.Index(fields=['analysis', 'rank']),
    models.Index(fields=['total_similarity_score']),
]

# Quotation
indexes = [
    models.Index(fields=['item', 'quotation_date']),
    models.Index(fields=['supplier']),
]
```

---

## 6. 既存Dokulyモデルとの統合

### 6.1 Partモデルとの連携

```python
# ProjectItem から Part への参照
project_item = ProjectItem.objects.get(id=1)
if project_item.content_type.model == 'part':
    part = project_item.related_item
    # Part の図面、BOM等を参照可能
```

### 6.2 Supplierモデルとの連携

```python
# Quotation, ProcessStep から Supplier への参照
quotation = Quotation.objects.get(id=1)
supplier = quotation.supplier
# Supplier の過去実績、評価等を参照可能
```

### 6.3 Projectモデルとの連携

```python
# CostEstimationProject から Project への参照
cost_project = CostEstimationProject.objects.get(id=1)
dokuly_project = cost_project.dokuly_project
# Project のタスク、メンバー、タイムライン等を参照可能
```

---

## 7. マイグレーション計画

### Phase 1: コアモデル
1. CostEstimationProject
2. ProjectItem
3. DrawingFile, ProcessSheet, Quotation

### Phase 2: AI分析モデル
4. SimilarityAnalysis, SimilarItem
5. CostAnalysis, CostBreakdown, CostComparison

### Phase 3: 改善・承認モデル
6. ImprovementProposal, ImprovementScenario
7. ApprovalDocument, ReviewComment

### Phase 4: マスターデータ
8. CostItemMapping, ProcessTemplate

---

## 8. パフォーマンス考慮事項

- **形状ベクトル検索**: PostgreSQL + pgvector extension for shape_embedding
- **大量ファイル処理**: Celery + Redis for async processing
- **AI API呼び出し**: Rate limiting, retry logic, cost tracking
- **クエリ最適化**: select_related, prefetch_related for nested queries
