import React from "react";

const QuickStartGuide = ({ onClose, onStartWalkthrough }) => {
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
          maxWidth: 700,
          width: "90%",
        }}
      >
        <div className="card-body">
          <div className="text-center mb-4">
            <img
              src="../../static/icons/cpu.svg"
              alt="AI"
              width="64"
              className="dokuly-filter-primary mb-3"
            />
            <h3 className="mb-2">AI類似仕様アシストへようこそ</h3>
            <p className="text-muted">
              過去案件から最適な基準モデルを選定し、QDリスクとコストを予測するAIアシスタントです
            </p>
          </div>

          <div className="mb-4">
            <h5 className="mb-3">
              <img
                src="../../static/icons/target.svg"
                alt="Goal"
                width="20"
                className="me-2"
              />
              実現する価値
            </h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-primary">設計LT短縮</h6>
                    <small className="text-muted">
                      類似案件の瞬時特定により、流用設計を促進
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-primary">変化点の最小化</h6>
                    <small className="text-muted">
                      仕様差分の可視化で手戻りを削減
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-primary">QDリスク予測</h6>
                    <small className="text-muted">
                      AIがDRBFMベースでリスクを推論
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="card bg-light h-100">
                  <div className="card-body">
                    <h6 className="text-primary">コスト推論</h6>
                    <small className="text-muted">
                      BOM変更に基づく原価を自動算出
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="mb-3">
              <img
                src="../../static/icons/map.svg"
                alt="Flow"
                width="20"
                className="me-2"
              />
              ワークフロー（6ステップ）
            </h5>
            <ol className="mb-0">
              <li className="mb-2">
                <strong>要求仕様と図面を入力</strong> - AIが自動的に仕様を抽出
              </li>
              <li className="mb-2">
                <strong>類似案件の絞り込み</strong> - RFLPベースの設計意図を判定
              </li>
              <li className="mb-2">
                <strong>基準モデルの選定</strong> - 過去の不具合情報を確認
              </li>
              <li className="mb-2">
                <strong>変更部品の決定</strong> - BOM比較とコスト確認
              </li>
              <li className="mb-2">
                <strong>QDリスク確認</strong> - DRBFMベースのリスク分析
              </li>
              <li className="mb-2">
                <strong>レビュー申請</strong> - 設計方針をコメントして承認依頼
              </li>
            </ol>
          </div>

          <div className="alert alert-info mb-4">
            <div className="d-flex align-items-start">
              <img
                src="../../static/icons/info.svg"
                alt="Info"
                width="20"
                className="me-2 mt-1"
              />
              <div>
                <strong>デフォルト・インテント（意図の同期）</strong>
                <br />
                <small>
                  図面などの「結果」だけでなく、要求や機能的根拠（RFLP）という「意図」を常に可視化。
                  Slackが情報の「公開」をデフォルトにしたように、設計の「意図」をデフォルトで共有します。
                </small>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                localStorage.setItem("ai_spec_assistant_walkthrough_seen", "true");
                onClose();
              }}
            >
              スキップ
            </button>
            <div>
              <button
                className="btn btn-outline-primary me-2"
                onClick={onClose}
              >
                とりあえず使ってみる
              </button>
              <button
                className="btn btn-primary"
                onClick={onStartWalkthrough}
              >
                <img
                  src="../../static/icons/book-open.svg"
                  alt="Guide"
                  width="16"
                  className="me-2 dokuly-filter-white"
                />
                ガイドを見る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;
