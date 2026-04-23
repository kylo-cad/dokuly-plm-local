import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toolExecutionHistory, aiTools, uploadedArtifacts, checkToolDataAvailability } from "./aiToolsMockData";
import ToolSpecifications from "./ToolSpecifications";

const BOMComposerTool = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [targetCost, setTargetCost] = useState("");
  const [showResults, setShowResults] = useState(false);

  const tool = aiTools.find((t) => t.id === "bom-composer");
  const history = toolExecutionHistory["bom-composer"] || [];
  const dataAvailability = checkToolDataAvailability("bom-composer");

  // Get available artifacts that match required types
  const availableArtifacts = uploadedArtifacts.filter((artifact) =>
    tool.required_artifacts.some((req) => req.name === artifact.artifact_type)
  );

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleLaunch = () => {
    if ((!selectedFile && !selectedArtifact) || !targetCost) {
      alert("要求仕様書と目標原価を入力してください");
      return;
    }
    // Simulate AI processing
    const dataSource = selectedArtifact
      ? selectedArtifact.name
      : selectedFile.name;
    alert(
      `BOM Composerを起動中...\n\n` +
        `データソース: ${dataSource}\n` +
        `目標原価: ¥${targetCost}\n\n` +
        `AI分析が完了しました!`
    );
    setShowResults(true);
  };

  const handleSaveToDocuments = () => {
    alert("成果物をドキュメントに保存しました\n\n次に使えるツール:\n• Design Review\n• AI原価査定");
    navigate("/ai-tools");
  };

  const nextRecommendedTools = [
    {
      id: "design-review",
      name: "Design Review",
      description: "生成したBOMをもとに設計レビューを実施",
      icon: "eye",
    },
    {
      id: "cost-estimation",
      name: "AI原価査定",
      description: "作成したBOMで詳細な原価見積もりを取得",
      icon: "dollar-sign",
    },
  ];

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mt-4 mb-3">
        <div className="col">
          <button
            className="btn btn-link text-decoration-none p-0 mb-2"
            onClick={() => navigate("/ai-tools")}
          >
            <img
              src="../../static/icons/arrow-left.svg"
              alt="Back"
              width="16"
              className="me-2"
            />
            AIツールライブラリに戻る
          </button>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>
                <img
                  src="../../static/icons/cpu.svg"
                  alt="BOM Composer"
                  width="32"
                  className="dokuly-filter-primary me-2"
                />
                BOM Composer
              </h2>
              <p className="text-muted">
                設計意図を明確化し、後工程と同期できる構成表を作成
              </p>
            </div>
            <button className="btn btn-outline-primary">
              <img
                src="../../static/icons/help-circle.svg"
                alt="Help"
                width="20"
                className="me-2"
              />
              使い方ガイド
            </button>
          </div>
        </div>
      </div>

      {/* Tool Purpose */}
      <div className="row mb-4">
        <div className="col">
          <div className="alert alert-info">
            <div className="d-flex align-items-start">
              <img
                src="../../static/icons/info.svg"
                alt="Info"
                width="20"
                className="me-2 mt-1"
              />
              <div>
                <strong>🎯 このツールの目的</strong>
                <p className="mb-0 mt-1">
                  要求仕様書から自動的にBOM（部品構成表）を生成し、設計意図を明確化します。
                  生成されたBOMは、Design ReviewやAI原価査定で再利用できます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Availability Status */}
      <div className="row mb-4">
        <div className="col">
          {dataAvailability.ready ? (
            <div className="alert alert-success">
              <div className="d-flex align-items-center">
                <img
                  src="../../static/icons/check-circle.svg"
                  alt="ready"
                  width="20"
                  className="me-2 dokuly-filter-success"
                />
                <div>
                  <strong>✓ 実行準備完了</strong>
                  <p className="mb-0 mt-1">
                    <small>
                      必要なデータがすべて揃っています。
                      利用可能な成果物: {dataAvailability.available.join(", ")}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              <div className="d-flex align-items-center">
                <img
                  src="../../static/icons/alert-circle.svg"
                  alt="warning"
                  width="20"
                  className="me-2"
                />
                <div>
                  <strong>⚠ データ不足</strong>
                  <p className="mb-0 mt-1">
                    <small>
                      以下のデータをアップロードしてください: {dataAvailability.missing.join(", ")}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tool Specifications */}
      <ToolSpecifications tool={tool} />

      <div className="row">
        {/* Left Column - Input & Execution */}
        <div className="col-md-8">
          {/* Input Data */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">📁 入力データ</h5>

              <div className="mb-3">
                <label className="form-label">
                  <strong>要求仕様書をアップロード</strong>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.xlsx"
                />
                {selectedFile && (
                  <small className="text-success d-block mt-1">
                    ✓ {selectedFile.name}
                  </small>
                )}
                <small className="text-muted d-block mt-1">
                  PDF, Word, Excel形式に対応
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <strong>目標原価を入力</strong>
                  <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">¥</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="例: 50000"
                    value={targetCost}
                    onChange={(e) => setTargetCost(e.target.value)}
                  />
                </div>
              </div>

              <div className="alert alert-light">
                <small>
                  <strong>💡 または</strong> 過去にアップロードした成果物から選択できます
                </small>
              </div>

              {availableArtifacts.length > 0 && (
                <div className="card bg-light mt-3">
                  <div className="card-body p-3">
                    <h6 className="mb-2" style={{ fontSize: "13px" }}>
                      利用可能な成果物 ({availableArtifacts.length})
                    </h6>
                    <div className="list-group list-group-flush">
                      {availableArtifacts.map((artifact) => (
                        <div
                          key={artifact.id}
                          className={`list-group-item list-group-item-action p-2 ${
                            selectedArtifact?.id === artifact.id ? "active" : ""
                          }`}
                          style={{ cursor: "pointer", fontSize: "12px" }}
                          onClick={() => setSelectedArtifact(artifact)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <img
                                src="../../static/icons/file.svg"
                                alt="file"
                                width="12"
                                className={`me-2 ${
                                  selectedArtifact?.id === artifact.id
                                    ? "dokuly-filter-white"
                                    : ""
                                }`}
                              />
                              <strong>{artifact.name}</strong>
                              <div className="ms-3">
                                <small className="text-muted">
                                  {artifact.product} • {artifact.uploaded_date} • {artifact.file_size}
                                </small>
                              </div>
                            </div>
                            {selectedArtifact?.id === artifact.id && (
                              <img
                                src="../../static/icons/check.svg"
                                alt="selected"
                                width="14"
                                className="dokuly-filter-white"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Execution */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">🤖 AI分析を実行</h5>

              <p className="text-muted mb-3">
                入力データをもとに、AIが最適なBOM構成を提案します。
                類似製品のデータベースから関連情報を取得し、部品選定を支援します。
              </p>

              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleLaunch}
                disabled={(!selectedFile && !selectedArtifact) || !targetCost}
              >
                <img
                  src="../../static/icons/cpu.svg"
                  alt="AI"
                  width="20"
                  className="me-2 dokuly-filter-white"
                />
                BOM Composerを起動
              </button>

              {((!selectedFile && !selectedArtifact) || !targetCost) && (
                <small className="text-muted d-block mt-2 text-center">
                  {!selectedFile && !selectedArtifact
                    ? "要求仕様書を選択してください"
                    : "目標原価を入力してください"}
                </small>
              )}

              {(selectedFile || selectedArtifact) && targetCost && (
                <small className="text-success d-block mt-2 text-center">
                  ✓ すべてのデータが揃いました
                </small>
              )}
            </div>
          </div>

          {/* Results (shown after execution) */}
          {showResults && (
            <div className="card border-success mb-4">
              <div className="card-body">
                <h5 className="card-title text-success mb-3">
                  ✓ AI分析が完了しました
                </h5>

                <div className="alert alert-success">
                  <strong>生成された成果物:</strong>
                  <ul className="mb-0 mt-2">
                    <li>商品企画書 (draft_product_plan_20260423.pdf)</li>
                    <li>初期BOM (initial_bom_20260423.xlsx)</li>
                  </ul>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary flex-fill">
                    <img
                      src="../../static/icons/download.svg"
                      alt="download"
                      width="16"
                      className="me-2"
                    />
                    ダウンロード
                  </button>
                  <button
                    className="btn btn-primary flex-fill"
                    onClick={handleSaveToDocuments}
                  >
                    <img
                      src="../../static/icons/save.svg"
                      alt="save"
                      width="16"
                      className="me-2 dokuly-filter-white"
                    />
                    ドキュメントに保存
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - History & Related Tools */}
        <div className="col-md-4">
          {/* Execution History */}
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="card-title mb-3">📊 過去の実行履歴</h6>

              {history.length > 0 ? (
                <div className="list-group list-group-flush">
                  {history.map((item) => (
                    <div key={item.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong style={{ fontSize: "14px" }}>
                            {item.product_name}
                          </strong>
                          <div>
                            <small className="text-muted">{item.date}</small>
                          </div>
                        </div>
                        <span className="badge bg-success">成功</span>
                      </div>
                      <small className="text-muted">
                        {item.artifacts_generated} 個の成果物を生成
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">
                  <small>まだ実行履歴がありません</small>
                </p>
              )}
            </div>
          </div>

          {/* Next Recommended Tools */}
          <div className="card border-primary">
            <div className="card-body">
              <h6 className="card-title mb-3">
                💡 次に使えるツール
                <small className="text-muted d-block" style={{ fontSize: "11px" }}>
                  データ連携可能
                </small>
              </h6>

              {nextRecommendedTools.map((tool) => (
                <div key={tool.id} className="mb-3 pb-3 border-bottom">
                  <div className="d-flex align-items-start mb-2">
                    <img
                      src={`../../static/icons/${tool.icon}.svg`}
                      alt={tool.name}
                      width="20"
                      className="me-2 dokuly-filter-primary"
                    />
                    <div>
                      <strong style={{ fontSize: "13px" }}>{tool.name}</strong>
                      <p className="mb-0" style={{ fontSize: "12px" }}>
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => navigate(`/ai-tools/${tool.id}`)}
                  >
                    このツールを見る
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BOMComposerTool;
