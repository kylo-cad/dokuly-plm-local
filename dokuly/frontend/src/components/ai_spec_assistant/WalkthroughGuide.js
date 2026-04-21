import React, { useState, useEffect } from "react";

const WalkthroughGuide = ({ currentStep, onClose, onNext, onPrev }) => {
  const [showGuide, setShowGuide] = useState(true);

  const guideContent = {
    1: {
      title: "ステップ1: 要求仕様と図面を入力",
      description: "新規案件の要求仕様書や図面をアップロードします。AIが自動的に仕様を抽出・構造化します。",
      details: [
        "要求仕様書（PDF, TIFF, PNG）をドラッグ&ドロップまたは選択",
        "図面ファイルも同時にアップロード可能",
        "AIが数分以内に仕様一覧を抽出",
        "確信度とページリンク付きで表示",
        "抽出結果は手動で修正可能",
      ],
      tips: "サンプルデータボタンを使えば、すぐに体験できます",
      businessValue: "設計LT短縮、見積回答の早期化",
    },
    2: {
      title: "ステップ2: 類似案件の絞り込み",
      description: "仕様一覧から過去の類似案件を自動的に検索・絞り込みます。",
      details: [
        "完全一致させたい仕様を最大5項目選択（例：材料、モータータイプ）",
        "仕様類似度に基づき案件をフィルタ",
        "仕様差分をハイライト表示",
        "最大10案件まで表示可能",
        "RFLPベースの設計意図の相同性を判定",
      ],
      tips: "完全一致項目を絞ることで、より精度の高い類似案件を発見できます",
      businessValue: "流用設計率の向上、変化点の最小化",
    },
    3: {
      title: "ステップ3: 基準モデルの選定",
      description: "類似案件の中から、新規案件のベースとなるモデルを選定します。",
      details: [
        "類似案件の仕様差分とコストを比較",
        "過去の試験エラー・不具合情報を確認",
        "故障モード別の発生件数を表示",
        "EOL部品・環境規制・標準品のアラート",
        "最適な基準モデルを選択",
      ],
      tips: "不具合履歴を確認することで、リスクの低い基準モデルを選べます",
      businessValue: "手戻り削減、品質リスクの低減",
    },
    4: {
      title: "ステップ4: 変更部品・ユニットの決定",
      description: "基準モデルから変更が必要な部品やユニットを選択します。",
      details: [
        "新規案件と基準モデルの仕様差分を確認",
        "差分のある仕様を選択",
        "該当する構成品（部品/ユニット）を表示",
        "標準原価と製品全体のコストを確認",
        "目標コスト内で最適な組み合わせをレコメンド",
      ],
      tips: "複数の部品候補を選択して比較することで、最適な構成を見つけられます",
      businessValue: "コスト最適化、設計の効率化",
    },
    5: {
      title: "ステップ5: QDリスクとコストの確認",
      description: "AIが品質・納期リスクとコストを推論・提示します。",
      details: [
        "不具合リスクの推論（過去事例ベース）",
        "変化点に対するDRBFMリスク分析",
        "製造要件の考慮事項",
        "加工指示によるコスト増リスク",
        "環境規制物質の閾値チェック",
      ],
      tips: "リスク評価を確認し、必要に応じて④に戻って部品を変更できます",
      businessValue: "品質リスクの事前予測、コスト見積の精度向上",
    },
    6: {
      title: "ステップ6: レビュー申請",
      description: "QDリスクとコストを確認後、レビュー者に承認を依頼します。",
      details: [
        "リスクとコストの妥当性を判断",
        "必要に応じて加筆・修正",
        "新規設計箇所の方針をコメント",
        "レビュー者のメールアドレスを入力",
        "リンク付きメールが自動送信",
      ],
      tips: "レビュー者のフィードバックは次回以降のAI推論に反映されます",
      businessValue: "組織ノウハウの蓄積、意思決定の透明化",
    },
  };

  const content = guideContent[currentStep] || guideContent[1];

  if (!showGuide) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 9999,
      }}
    >
      <div
        className="card shadow-lg"
        style={{
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div className="badge bg-primary mb-2">
                ステップ {currentStep} / 6
              </div>
              <h5 className="card-title mb-0">{content.title}</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                setShowGuide(false);
                onClose();
              }}
            />
          </div>

          <p className="text-muted mb-3">{content.description}</p>

          <div className="mb-3">
            <h6 className="mb-2">
              <img
                src="../../static/icons/list.svg"
                alt="Details"
                width="16"
                className="me-2"
              />
              詳細手順
            </h6>
            <ul className="mb-0">
              {content.details.map((detail, idx) => (
                <li key={idx} className="mb-1">
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {content.tips && (
            <div className="alert alert-info mb-3">
              <div className="d-flex align-items-start">
                <img
                  src="../../static/icons/lightbulb.svg"
                  alt="Tip"
                  width="16"
                  className="me-2 mt-1"
                />
                <div>
                  <strong>ヒント:</strong> {content.tips}
                </div>
              </div>
            </div>
          )}

          {content.businessValue && (
            <div className="card bg-light mb-3">
              <div className="card-body py-2">
                <small className="text-muted d-block mb-1">
                  <strong>ビジネス価値:</strong>
                </small>
                <small>{content.businessValue}</small>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={onPrev}
              disabled={currentStep === 1}
            >
              <img
                src="../../static/icons/arrow-left.svg"
                alt="Prev"
                width="16"
                className="me-2"
              />
              前へ
            </button>

            <div>
              <button
                className="btn btn-outline-secondary me-2"
                onClick={() => {
                  setShowGuide(false);
                  onClose();
                }}
              >
                後で見る
              </button>
              {currentStep < 6 ? (
                <button className="btn btn-primary" onClick={onNext}>
                  次へ
                  <img
                    src="../../static/icons/arrow-right.svg"
                    alt="Next"
                    width="16"
                    className="ms-2 dokuly-filter-white"
                  />
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setShowGuide(false);
                    onClose();
                  }}
                >
                  <img
                    src="../../static/icons/check.svg"
                    alt="Done"
                    width="16"
                    className="me-2 dokuly-filter-white"
                  />
                  完了
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkthroughGuide;
