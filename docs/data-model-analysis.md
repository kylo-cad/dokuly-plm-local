# Dokulyデータモデル分析と改善提案

## 現在のデータモデル構造

### コア階層構造

```
Organization (組織)
  ├── User / Profile (ユーザー)
  ├── Project (プロジェクト)
  │   ├── Part (部品)
  │   ├── PCBA (基板アセンブリ)
  │   ├── Assembly (アセンブリ)
  │   ├── Document (ドキュメント)
  │   ├── Requirement (要求)
  │   └── ECO (設計変更)
  └── Customer (顧客)
```

### 主要エンティティ詳細

#### 1. Organization (組織)
**目的**: マルチテナント対応の最上位エンティティ

**主要フィールド**:
```python
org_number: str (unique)          # 組織番号
name: str                         # 組織名
tenant_id: str                    # テナントID

# モジュール有効化フラグ
time_tracking_is_enabled: bool
document_is_enabled: bool
pcba_is_enabled: bool
assembly_is_enabled: bool
procurement_is_enabled: bool
requirement_is_enabled: bool
production_is_enabled: bool
customer_is_enabled: bool
supplier_is_enabled: bool
inventory_is_enabled: bool
eco_is_enabled: bool

# 部品番号・リビジョン設定
full_part_number_template: str    # 例: "<prefix><part_number><revision>"
formatted_revision_template: str  # 例: "<major_revision>-<minor_revision>"
use_number_revisions: bool        # 数字 vs 文字リビジョン
revision_format: str              # "major-only" or "major-minor"

# 通貨・セキュリティ設定
currency: str                     # デフォルト通貨
enforce_2fa: bool                 # 2FA強制
```

**現在の問題点**:
- モジュール有効化フラグが冗長（10個以上のbooleanフィールド）
- 拡張性が低い（新モジュール追加時にマイグレーション必要）

---

#### 2. User & Profile
**目的**: Django標準Userの拡張、権限管理

**主要フィールド**:
```python
# Profile model
user: OneToOneField(User)         # Django User参照
first_name: str
last_name: str
role: str                         # "Viewer", "User", "Admin", "Owner"
allowed_apps: ArrayField[str]     # アプリ単位のアクセス制御
organization_id: int              # 所属組織
is_active: bool                   # アクティブフラグ
position: str                     # 役職
```

**現在の問題点**:
- `role`が文字列で型安全性がない
- `organization_id`がIntegerFieldで参照整合性がない（ForeignKeyにすべき）
- `allowed_apps`の値が文字列配列で、typo等のエラーが発生しやすい

---

#### 3. Project (プロジェクト)
**目的**: 設計アイテムの親コンテナ、アクセス制御の単位

**主要フィールド**:
```python
title: str
description: text
full_project_number: int (unique)
organization: FK(Organization)
customer: FK(Customer)
project_contact: FK(Profile)
project_owner: FK(Profile)
project_members: M2M(User)        # アクセス制御
start_date: str                   # 日付が文字列！
deadline: str                     # 日付が文字列！
estimated_work_hours: int
is_active: bool
is_archived: bool
```

**現在の問題点**:
- 日付フィールドが`CharField`（`DateField`にすべき）
- `is_active`と`is_archived`の関係が不明確
- タイムライン機能が基本的（Gantt, タスク管理は別モデル）

---

#### 4. Part (部品)
**目的**: 部品の管理、外部部品・内部部品両対応

**主要フィールド**:
```python
# 部品番号・リビジョン管理
part_number: int                  # リビジョン横断で不変
full_part_number: str             # フォーマット済み (例: PRT1234A)
formatted_revision: str           # フォーマット済みリビジョン
revision_count_major: int         # メジャーリビジョン
revision_count_minor: int         # マイナーリビジョン
is_latest_revision: bool          # 最新リビジョンフラグ

# 基本情報
display_name: str
description: text
part_type: FK(PartType)
unit: str (default="pcs")

# リリース管理
release_state: str                # "Draft", "In Review", "Released"
quality_assurance: FK(Profile)    # レビュー担当者
released_date: datetime
created_at: datetime
created_by: FK(User)
last_updated: datetime

# プロジェクト・アクセス制御
project: FK(Project)
internal: bool

# ファイル管理
files: M2M(File)
thumbnail: FK(Image)
model_url: str
git_link: str
image_url: str

# 外部部品用フィールド
mpn: str                          # メーカー部品番号
manufacturer: str
datasheet: str
farnell_number: str
production_status: str            # ライフサイクル状態
nexar_part_id: str                # Nexar API連携用ID
source: str                       # "digikey", "nexar", "manual"

# シリアル番号管理
serial_number_counter: int
serial_number_offset: int
serial_number_prefix: str

# 在庫管理
on_order_quantity: int

# 参照管理
reference_list_id: int            # 参照ドキュメントリスト
```

**現在の問題点**:
- リビジョン管理フィールドが多すぎる（5フィールド）
- `release_state`が文字列で型安全性がない
- `reference_list_id`がIntegerFieldで参照整合性がない
- 外部部品と内部部品の区別が`internal`フラグのみ（モデル分離の検討余地）
- `model_url`, `image_url`が文字列（Fileモデルを使うべき）

---

#### 5. Assembly (アセンブリ)
**目的**: 部品・PCBA・サブアセンブリの集合体管理

**主要フィールド**:
```python
# Partとほぼ同じフィールド構造
part_number: int
full_part_number: str
formatted_revision: str
revision_count_major: int
revision_count_minor: int
is_latest_revision: bool
display_name: str
description: text
part_type: FK(PartType)
release_state: str
quality_assurance: FK(Profile)
released_date: datetime
project: FK(Project)
created_at: datetime
created_by: FK(User)
last_updated: datetime
files: M2M(File)
thumbnail: FK(Image)

# Assembly固有フィールド
model_url: str
graph_blueprint: bool             # React Flow用フラグ
errata: str (max_length=20000)
revision_notes: str (max_length=20000)
markdown_notes: FK(MarkdownText)
serial_number_counter: int
serial_number_offset: int
```

**現在の問題点**:
- Partとのフィールド重複が大量（約80%）
- 抽象基底クラスで共通化すべき
- `graph_blueprint`の用途が不明確

---

#### 6. PCBA (基板アセンブリ)
**目的**: プリント基板アセンブリの管理

**主要フィールド**:
```python
# Part/Assemblyと同じリビジョン管理フィールド
part_number: int
full_part_number: str
formatted_revision: str
revision_count_major: int
revision_count_minor: int
is_latest_revision: bool
display_name: str (フィールドなし、追加すべき)
description: text (フィールドなし、追加すべき)
part_type: FK(PartType)
release_state: str
quality_assurance: FK(Profile)
released_date: datetime
project: FK(Project)
created_at: datetime
created_by: FK(User)
last_updated: datetime

# PCBA固有フィールド
attributes: JSONField              # Critical Stackup, Controlled Impedance, Flex PCB
pcb_layers: JSONField              # ガーバーファイル情報
  {
    "copper top": "",
    "copper bot": "",
    "soldermask top": "",
    "soldermask bot": "",
    "silkscreen top": "",
    "silkscreen bot": "",
    "solder paste top": "",
    "solder paste bot": "",
    "board outline": "",
    "drill": "",
    "zip content": []
  }
revision_notes: text
errata: text
markdown_notes: FK(MarkdownText)
thumbnail: FK(Image)

# ファイル管理 (注意: Partと異なる)
generic_files: M2M(File)           # PartやAssemblyは"files"
```

**現在の問題点**:
- `generic_files`というフィールド名がPartやAssemblyの`files`と異なる（一貫性がない）
- `display_name`, `description`フィールドが欠落（要確認）
- Part/Assemblyとの共通フィールド重複

---

#### 7. Document (ドキュメント)
**目的**: 技術文書、仕様書、図面などの管理

**主要フィールド**:
```python
title: str
part_number: int
document_number: str               # プロジェクト内番号
full_doc_number: str               # 完全文書番号 (例: TN100103-2A)
formatted_revision: str
prefix_id: int                     # プレフィックス (TN, DR等)
description: text
release_state: str
quality_assurance: FK(Profile)
released_date: datetime
released_by: FK(User)
created_at: datetime
created_by: FK(User)
last_updated: datetime
project: FK(Project)
language: str

# リビジョン管理
revision_count_major: int
revision_count_minor: int
is_latest_revision: bool

# 文書間参照
referenced_documents: M2M(self)    # 他の文書への参照

# ファイル管理
files: M2M(File)
thumbnail: FK(Image)
```

**現在の問題点**:
- `prefix_id`がIntegerFieldで参照整合性がない（TODO コメントあり）
- `document_number`の役割が不明確
- Part/Assembly/PCBAと共通フィールド多数

---

#### 8. BOM構造
**目的**: アセンブリ・PCBAの部品構成管理

**主要フィールド**:
```python
# Assembly_bom (BOMヘッダー)
assembly_id: int                   # FK(Assembly)にすべき
pcba: FK(Pcba)                     # PCBAの場合のみ
bom_name: str
comments: str

# Bom_item (BOM明細行)
bom: FK(Assembly_bom)
designator: str                    # 参照指示子 (例: R1, C2-C5)
quantity: float
is_mounted: bool                   # DNM (Do Not Mount) 対応

# 部品参照 (いずれか1つ)
part: FK(Part)
pcba: FK(Pcba)
assembly: FK(Assembly)

# BOMインポート用一時フィールド
temporary_mpn: str
temporary_manufacturer: str
comment: str
```

**現在の問題点**:
- `assembly_id`がIntegerFieldで参照整合性がない（TODOコメントあり）
- AssemblyとPCBAで参照方法が異なる（assembly_idはint, pcbaはFK）
- 1つのBOM明細が複数の部品タイプを持てる設計（part, pcba, assemblyのいずれか）
  - GenericForeignKeyで統一すべき
- BOMバージョン管理機能がない

---

#### 9. Requirement (要求)
**目的**: システム要求管理、トレーサビリティ

**主要フィールド**:
```python
# RequirementSet (要求グループ)
display_name: str
description: text
project: FK(Project)
created_at: datetime
created_by: FK(User)
last_updated: datetime
tags: M2M(Tag)

# Requirement (個別要求)
requirement_set: FK(RequirementSet)
parent_requirement: FK(self)       # 階層構造
derived_from: M2M(self)            # トレーサビリティ
superseded_by: FK(self)            # 要求の置き換え
state: str
quality_assurance: FK(Profile)
rationale: text                    # 要求の根拠
obligation_level: str              # "Shall", "Should"
type: str                          # Functional, Performance, etc.
statement: text                    # 要求文
verification_class: str            # Test, Analysis, etc.
tags: M2M(Tag)
```

**現在の問題点**:
- `state`, `obligation_level`, `type`, `verification_class`が文字列で型安全性がない
- Choices定義がない
- 要求とPart/Assembly/PCBAの紐付けがない（トレーサビリティ不完全）

---

#### 10. File & Image
**目的**: ファイル管理の共通基盤

**主要フィールド**:
```python
# File
file: FileField                    # Azure/ローカルストレージ
archive: bool                      # 削除フラグ
# M2M from: Part, Assembly, Document, PCBA (generic_files)

# Image
image: ImageField
# FK from: Part, Assembly, PCBA, Document (thumbnail)
```

**現在の問題点**:
- ファイルのバージョン管理がない
- ファイルメタデータ（アップロード日時、アップロード者）がない
- `archive`フラグによる論理削除のみ（物理削除の仕組みがない）

---

## データモデルの汎用性改善提案

### 1. 抽象基底クラス (Abstract Base Class) の導入

**問題**: Part, Assembly, PCBA, Documentで同じフィールドが重複

**解決策**: Django抽象基底クラスで共通フィールドを統一

```python
# models/base.py
class RevisionedItem(models.Model):
    """リビジョン管理が必要なアイテムの基底クラス"""
    
    # 部品番号・リビジョン管理
    part_number = models.IntegerField(db_index=True)
    full_part_number = models.CharField(max_length=50, blank=True, null=True)
    formatted_revision = models.CharField(max_length=20, blank=True, null=True)
    revision_count_major = models.IntegerField(default=0)
    revision_count_minor = models.IntegerField(default=0)
    is_latest_revision = models.BooleanField(default=False, db_index=True)
    
    # 基本情報
    display_name = models.CharField(max_length=150, blank=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    
    # リリース管理
    release_state = models.CharField(
        max_length=50,
        choices=[
            ('draft', 'Draft'),
            ('in_review', 'In Review'),
            ('released', 'Released'),
            ('obsolete', 'Obsolete'),
        ],
        default='draft',
        db_index=True
    )
    quality_assurance = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True,
        related_name='qa_%(class)s_set'
    )
    released_date = models.DateTimeField(null=True, blank=True)
    
    # プロジェクト管理
    project = models.ForeignKey(
        Project, on_delete=models.SET_NULL, null=True,
        related_name='%(class)s_set'
    )
    
    # 監査証跡
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='created_%(class)s_set'
    )
    last_updated = models.DateTimeField(auto_now=True)
    last_updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='updated_%(class)s_set'
    )
    
    # ファイル管理 (統一)
    files = models.ManyToManyField('files.File', blank=True)
    thumbnail = models.ForeignKey(
        'files.Image', on_delete=models.SET_NULL, null=True, blank=True
    )
    
    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['part_number', 'is_latest_revision']),
            models.Index(fields=['project', 'release_state']),
        ]
    
    def create_new_revision(self, major=False):
        """新しいリビジョンを作成"""
        pass
    
    def get_revision_history(self):
        """リビジョン履歴を取得"""
        pass


class Part(RevisionedItem):
    # Part固有フィールドのみ
    part_type = models.ForeignKey(PartType, on_delete=models.SET_NULL, null=True)
    unit = models.CharField(max_length=20, default="pcs")
    mpn = models.CharField(max_length=50, blank=True, null=True)
    manufacturer = models.CharField(max_length=60, blank=True, null=True)
    # ... その他Part固有フィールド


class Assembly(RevisionedItem):
    # Assembly固有フィールドのみ
    errata = models.TextField(blank=True, null=True)
    revision_notes = models.TextField(blank=True, null=True)
    # ... その他Assembly固有フィールド
```

**メリット**:
- コードの重複削減（DRY原則）
- フィールド追加時の変更が1箇所で済む
- 一貫性の向上

---

### 2. 参照整合性の強化

**問題**: IntegerFieldで他モデルを参照している箇所が多数

**解決策**: すべてForeignKeyに変更

```python
# Before (現在の実装)
class Assembly_bom(models.Model):
    assembly_id = models.IntegerField(null=True, blank=True)  # ❌ 参照整合性なし
    
class Profile(models.Model):
    organization_id = models.IntegerField(default=-1)  # ❌ 参照整合性なし

# After (改善後)
class Assembly_bom(models.Model):
    assembly = models.ForeignKey(
        Assembly,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='boms'
    )  # ✅ 参照整合性あり

class Profile(models.Model):
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        default=None,
        related_name='profiles'
    )  # ✅ 参照整合性あり
```

**メリット**:
- データ整合性の保証
- ORMによる自動的なJOIN
- 関連オブジェクトへのアクセスが容易

---

### 3. Enum/Choicesの活用

**問題**: `release_state`, `role`, `type`などが文字列で型安全性がない

**解決策**: Django 3.0+ TextChoices / IntegerChoicesを使用

```python
from django.db import models

class ReleaseState(models.TextChoices):
    DRAFT = 'draft', 'Draft'
    IN_REVIEW = 'in_review', 'In Review'
    RELEASED = 'released', 'Released'
    OBSOLETE = 'obsolete', 'Obsolete'

class UserRole(models.TextChoices):
    VIEWER = 'viewer', 'Viewer'
    USER = 'user', 'User'
    ADMIN = 'admin', 'Admin'
    OWNER = 'owner', 'Owner'

class RequirementType(models.TextChoices):
    FUNCTIONAL = 'functional', 'Functional'
    PERFORMANCE = 'performance', 'Performance'
    USABILITY = 'usability', 'Usability'
    INTERFACE = 'interface', 'Interface'
    OPERATIONAL = 'operational', 'Operational'
    PHYSICAL = 'physical', 'Physical Constraint'
    DESIGN = 'design', 'Design Constraint'
    ENVIRONMENTAL = 'environmental', 'Environmental'
    RELIABILITY = 'reliability', 'Reliability'
    SAFETY = 'safety', 'Safety'
    SECURITY = 'security', 'Security'

# 使用例
class RevisionedItem(models.Model):
    release_state = models.CharField(
        max_length=50,
        choices=ReleaseState.choices,
        default=ReleaseState.DRAFT
    )

class Profile(models.Model):
    role = models.CharField(
        max_length=50,
        choices=UserRole.choices,
        default=UserRole.USER
    )
```

**メリット**:
- タイポ防止
- IDEの自動補完
- データベースレベルでの制約
- ドキュメント化が容易

---

### 4. GenericForeignKey活用

**問題**: Bom_itemが複数のForeignKey (part, pcba, assembly) を持つ

**解決策**: GenericForeignKeyで統一

```python
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Bom_item(models.Model):
    bom = models.ForeignKey(Assembly_bom, on_delete=models.CASCADE)
    
    # GenericForeignKey: Part, Pcba, Assemblyのいずれか
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    item = GenericForeignKey('content_type', 'object_id')
    
    designator = models.CharField(max_length=1000, blank=True, null=True)
    quantity = models.FloatField(default=1.0)
    is_mounted = models.BooleanField(default=True)
    
    # BOMインポート用
    temporary_mpn = models.CharField(max_length=100, blank=True, null=True)
    temporary_manufacturer = models.CharField(max_length=100, blank=True, null=True)
    comment = models.CharField(max_length=1000, blank=True, null=True)
```

**メリット**:
- 1つのフィールドで複数の型を参照可能
- 新しいアイテムタイプ追加が容易
- データモデルがシンプルに

---

### 5. 監査証跡 (Audit Trail) の統一

**問題**: `last_updated_by`などの監査フィールドが不足

**解決策**: Django Simple Historyまたはカスタム監査モデル

```python
from simple_history.models import HistoricalRecords

class RevisionedItem(models.Model):
    # ... 既存フィールド
    
    # 監査証跡の自動記録
    history = HistoricalRecords(inherit=True)
    
    class Meta:
        abstract = True

# または、カスタム監査モデル
class AuditLog(models.Model):
    """汎用監査ログ"""
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    action = models.CharField(
        max_length=20,
        choices=[
            ('create', 'Created'),
            ('update', 'Updated'),
            ('delete', 'Deleted'),
            ('release', 'Released'),
            ('obsolete', 'Obsoleted'),
        ]
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    changes = models.JSONField(default=dict)  # 変更内容の詳細
    ip_address = models.GenericIPAddressField(null=True, blank=True)
```

**メリット**:
- すべての変更履歴を追跡
- コンプライアンス対応
- トラブルシューティングが容易

---

### 6. 日付フィールドの型修正

**問題**: `Project.start_date`, `Project.deadline`が文字列

**解決策**: 適切な日付型を使用

```python
# Before
class Project(models.Model):
    start_date = models.CharField(max_length=20, blank=True, null=True)  # ❌
    deadline = models.CharField(max_length=20, blank=True, null=True)    # ❌

# After
class Project(models.Model):
    start_date = models.DateField(blank=True, null=True)  # ✅
    deadline = models.DateField(blank=True, null=True)    # ✅
    
    # 時刻も必要な場合
    start_datetime = models.DateTimeField(blank=True, null=True)
    deadline_datetime = models.DateTimeField(blank=True, null=True)
```

**メリット**:
- データベースレベルでの型チェック
- 日付演算が容易
- 国際化対応

---

### 7. JSONFieldでカスタムフィールド対応

**問題**: 組織ごとに異なるカスタムフィールドが必要な場合に対応できない

**解決策**: JSONFieldで拡張可能な属性を提供

```python
class RevisionedItem(models.Model):
    # ... 標準フィールド
    
    # カスタムフィールド
    custom_attributes = models.JSONField(
        default=dict,
        blank=True,
        help_text="Organization-specific custom fields"
    )
    
    class Meta:
        abstract = True

# 使用例
part = Part.objects.create(
    display_name="Resistor 10k",
    custom_attributes={
        "rohs_compliant": True,
        "reach_compliant": True,
        "halogen_free": False,
        "thermal_resistance": "100°C/W",
        "custom_field_1": "value1"
    }
)
```

**メリット**:
- スキーマ変更なしで拡張可能
- 組織ごとのカスタマイズ対応
- 柔軟性向上

---

### 8. Soft Delete (論理削除) の統一

**問題**: `is_active`, `is_archived`, `archive`など削除フラグが統一されていない

**解決策**: Django Safedeleteまたは統一された論理削除

```python
from safedelete.models import SafeDeleteModel
from safedelete.models import SOFT_DELETE_CASCADE

class BaseModel(SafeDeleteModel):
    _safedelete_policy = SOFT_DELETE_CASCADE
    
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='deleted_%(class)s_set'
    )
    
    class Meta:
        abstract = True

# または、シンプルなカスタム実装
class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)

class BaseModel(models.Model):
    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)
    deleted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    objects = SoftDeleteManager()
    all_objects = models.Manager()  # 削除済みも含む
    
    class Meta:
        abstract = True
    
    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()
    
    def hard_delete(self):
        super().delete()
```

**メリット**:
- 削除の一貫性
- データ復元が容易
- 監査証跡の保持

---

### 9. モジュール設定のJSONField化

**問題**: Organization に10個以上のbooleanフィールド (xxx_is_enabled)

**解決策**: JSONFieldで統一

```python
class Organization(models.Model):
    # ... 基本フィールド
    
    # Before: 冗長なbooleanフィールド
    # time_tracking_is_enabled = models.BooleanField(default=False)
    # document_is_enabled = models.BooleanField(default=True)
    # pcba_is_enabled = models.BooleanField(default=True)
    # ...
    
    # After: JSONFieldで統一
    enabled_modules = models.JSONField(
        default=dict,
        help_text="Enabled modules configuration"
    )
    # 例: {
    #   "timesheet": True,
    #   "documents": True,
    #   "parts": True,
    #   "assemblies": True,
    #   "pcbas": True,
    #   "procurement": True,
    #   "production": False,
    #   "requirements": True,
    #   "eco": True,
    #   "customers": True,
    #   "suppliers": True
    # }
    
    def is_module_enabled(self, module_name):
        return self.enabled_modules.get(module_name, False)
```

**メリット**:
- スキーマがシンプルに
- 新モジュール追加がマイグレーション不要
- 動的な設定変更が容易

---

### 10. ファイルバージョン管理の追加

**問題**: Fileモデルにバージョン管理がない

**解決策**: ファイルバージョン履歴モデルを追加

```python
class File(models.Model):
    """ファイルの最新バージョンを表す"""
    file_path = models.CharField(max_length=500)
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, blank=True)
    file_size = models.BigIntegerField(default=0)
    
    # 最新バージョン情報
    current_version = models.ForeignKey(
        'FileVersion',
        on_delete=models.SET_NULL,
        null=True,
        related_name='current_file'
    )
    
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    
    archive = models.BooleanField(default=False)
    
    # ファイルアクセス制御
    is_public = models.BooleanField(default=False)
    allowed_users = models.ManyToManyField(User, blank=True, related_name='accessible_files')


class FileVersion(models.Model):
    """ファイルのバージョン履歴"""
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name='versions')
    
    version_number = models.IntegerField(default=1)
    file_path = models.CharField(max_length=500)  # 実際のストレージパス
    file_size = models.BigIntegerField(default=0)
    
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # チェックサム (整合性確認用)
    checksum_md5 = models.CharField(max_length=32, blank=True)
    checksum_sha256 = models.CharField(max_length=64, blank=True)
    
    # 変更コメント
    change_comment = models.TextField(blank=True)
    
    class Meta:
        unique_together = [['file', 'version_number']]
        ordering = ['-version_number']
```

**メリット**:
- ファイル履歴の追跡
- ロールバック機能
- 整合性チェック

---

### 11. BOM階層構造の改善

**問題**: BOM構造が平坦で、階層的な部品構成を表現できない

**解決策**: 階層BOMモデル

```python
class BOM(models.Model):
    """BOMヘッダー (アセンブリまたはPCBA用)"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # GenericForeignKeyで親を参照 (Assembly or PCBA)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    parent = GenericForeignKey('content_type', 'object_id')
    
    version = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        unique_together = [['content_type', 'object_id', 'version']]


class BOMItem(models.Model):
    """BOM明細 (階層対応)"""
    bom = models.ForeignKey(BOM, on_delete=models.CASCADE, related_name='items')
    
    # 親BOMアイテム (階層構造用)
    parent_item = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    
    # 部品参照 (GenericForeignKey)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    item = GenericForeignKey('content_type', 'object_id')
    
    # BOM情報
    designator = models.CharField(max_length=1000, blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=4, default=1.0)
    is_mounted = models.BooleanField(default=True)
    find_number = models.IntegerField(null=True, blank=True)  # 図番
    
    # サプライチェーン情報
    lead_time_days = models.IntegerField(null=True, blank=True)
    minimum_order_quantity = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True, blank=True
    )
    
    # コスト情報
    unit_cost = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    currency = models.CharField(max_length=3, default='USD')
    
    # 代替品
    substitutes = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='substituted_by'
    )
    
    # ソート順
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['sort_order', 'find_number', 'designator']
    
    def get_total_quantity(self):
        """階層を考慮した総数量を計算"""
        if self.parent_item:
            return self.quantity * self.parent_item.get_total_quantity()
        return self.quantity
```

**メリット**:
- 階層的BOM表現
- コスト積算の正確性向上
- サプライチェーン情報の統合

---

### 12. Polymorphic Modelsの検討

**問題**: Part, Assembly, PCBA, Documentを統一的に扱えない

**解決策**: django-polymorphicを使用

```python
from polymorphic.models import PolymorphicModel

class DesignItem(PolymorphicModel):
    """すべての設計アイテムの基底クラス (Polymorphic)"""
    
    # 共通フィールド
    part_number = models.IntegerField(db_index=True)
    full_part_number = models.CharField(max_length=50)
    formatted_revision = models.CharField(max_length=20)
    revision_count_major = models.IntegerField(default=0)
    revision_count_minor = models.IntegerField(default=0)
    is_latest_revision = models.BooleanField(default=False)
    
    display_name = models.CharField(max_length=150)
    description = models.TextField(max_length=500, blank=True)
    
    release_state = models.CharField(
        max_length=50,
        choices=ReleaseState.choices,
        default=ReleaseState.DRAFT
    )
    
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True)
    
    # 監査証跡
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    # ファイル
    files = models.ManyToManyField(File, blank=True)
    thumbnail = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True)


class Part(DesignItem):
    # Part固有フィールドのみ
    mpn = models.CharField(max_length=50, blank=True, null=True)
    manufacturer = models.CharField(max_length=60, blank=True, null=True)


class Assembly(DesignItem):
    # Assembly固有フィールドのみ
    errata = models.TextField(blank=True, null=True)


class PCBA(DesignItem):
    # PCBA固有フィールドのみ
    pcb_layers = models.JSONField(default=dict)


# 使用例: すべてのDesignItemを横断的に取得
all_items = DesignItem.objects.filter(project_id=1)
for item in all_items:
    print(f"{item.polymorphic_ctype.model}: {item.display_name}")
    # 自動的にPart, Assembly, PCBAの適切なインスタンスが返される
```

**メリット**:
- 設計アイテムの統一的な扱い
- クエリの簡素化
- 型安全性の向上

---

### 13. タグ・カテゴリシステムの拡張

**問題**: 現在のTagモデルが基本的すぎる

**解決策**: 階層的タグとカテゴリ

```python
class Category(models.Model):
    """階層的カテゴリ"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    
    # カテゴリが適用可能なモデルタイプ
    applicable_to = models.ManyToManyField(ContentType, blank=True)
    
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, blank=True)  # HEXカラー
    
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['sort_order', 'name']
    
    def get_full_path(self):
        """カテゴリの完全パスを取得 (例: Electronics/Resistors/SMD)"""
        if self.parent:
            return f"{self.parent.get_full_path()}/{self.name}"
        return self.name


class Tag(models.Model):
    """改善されたタグモデル"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, blank=True)
    
    # 使用回数 (パフォーマンス最適化用)
    usage_count = models.IntegerField(default=0, editable=False)
    
    class Meta:
        ordering = ['-usage_count', 'name']
```

**メリット**:
- 階層的な分類
- 検索性の向上
- UIでの表示が豊かに

---

## 実装優先度

### 高優先度 (すぐに実装すべき)
1. **参照整合性の強化** - データ破損のリスクを低減
2. **Enum/Choicesの活用** - データ品質向上
3. **日付フィールドの型修正** - バグ防止
4. **ファイルフィールド名の統一** - 一貫性向上

### 中優先度 (リファクタリング時に実装)
5. **抽象基底クラスの導入** - コード重複削減
6. **GenericForeignKeyの活用** - モデルの柔軟性向上
7. **監査証跡の統一** - コンプライアンス対応
8. **Soft Deleteの統一** - データ復元機能

### 低優先度 (長期的な改善)
9. **Polymorphic Modelsの導入** - 大規模リファクタリング必要
10. **BOM階層構造の改善** - 既存データ移行が複雑
11. **モジュール設定のJSONField化** - 後方互換性考慮
12. **カスタムフィールド対応** - ユーザー要望次第

---

## マイグレーション戦略

### 段階的移行アプローチ

**Phase 1: 新規フィールド追加**
```python
# 既存フィールドを残したまま、新しいForeignKeyを追加
class Profile(models.Model):
    organization_id = models.IntegerField(default=-1)  # 既存 (deprecated)
    organization = models.ForeignKey(  # 新規
        Organization,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='profiles'
    )
```

**Phase 2: データ移行**
```python
# マイグレーションスクリプトでデータコピー
def migrate_organization_references(apps, schema_editor):
    Profile = apps.get_model('profiles', 'Profile')
    Organization = apps.get_model('organizations', 'Organization')
    
    for profile in Profile.objects.all():
        if profile.organization_id and profile.organization_id != -1:
            try:
                org = Organization.objects.get(id=profile.organization_id)
                profile.organization = org
                profile.save()
            except Organization.DoesNotExist:
                pass
```

**Phase 3: 旧フィールド削除**
```python
# 移行完了後、古いフィールドを削除
class Profile(models.Model):
    # organization_id = models.IntegerField(default=-1)  # 削除
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='profiles'
    )
```

---

## まとめ

Dokulyのデータモデルは基本的な機能は備えているが、以下の改善により汎用性と保守性が大幅に向上する:

### 主要改善ポイント
1. **抽象基底クラス**でコード重複を削減
2. **参照整合性**の強化でデータ品質向上
3. **Enum/Choices**で型安全性確保
4. **GenericForeignKey**で柔軟性向上
5. **監査証跡**の統一でコンプライアンス対応
6. **Soft Delete**の標準化でデータ復元機能
7. **JSONField**でカスタマイズ性向上
8. **Polymorphic Models**で設計アイテムの統一的扱い

これらの改善は段階的に実装可能で、既存システムへの影響を最小限に抑えながら、長期的なメンテナンス性と拡張性を向上させることができる。
