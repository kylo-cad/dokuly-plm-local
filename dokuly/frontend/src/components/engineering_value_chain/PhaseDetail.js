import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { engineeringPhases } from "./mockData";

const PhaseDetail = () => {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const phase = engineeringPhases.find((p) => p.phase_id === parseInt(phaseId));
  const [artifacts, setArtifacts] = useState(phase?.output_artifacts || []);

  if (!phase) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-danger">Phase not found</div>
      </div>
    );
  }

  const handleFileUpload = (artifactId) => {
    // Mock file upload
    setArtifacts(
      artifacts.map((artifact) =>
        artifact.id === artifactId ? { ...artifact, uploaded: true } : artifact
      )
    );
  };

  const handleAIFunctionLaunch = () => {
    alert(`${phase.enabling_function.title} 機能は開発中です\n\nこの機能は次のフェーズで実装予定です。`);
  };

  const handleStartPhase = () => {
    alert("フェーズを開始しました");
  };

  const handleCompletePhase = () => {
    const requiredArtifacts = artifacts.filter((a) => a.required);
    const uploadedRequired = requiredArtifacts.filter((a) => a.uploaded);

    if (uploadedRequired.length < requiredArtifacts.length) {
      alert(
        `必須成果物をすべてアップロードしてください\n\n` +
          `完了: ${uploadedRequired.length}/${requiredArtifacts.length}`
      );
      return;
    }

    alert("フェーズを完了しました\n\n次のフェーズに進むことができます。");
    navigate("/engineering-value-chain");
  };

  const canComplete = () => {
    const requiredArtifacts = artifacts.filter((a) => a.required);
    const uploadedRequired = requiredArtifacts.filter((a) => a.uploaded);
    return uploadedRequired.length === requiredArtifacts.length;
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mt-4 mb-3">
        <div className="col">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <button
                className="btn btn-link text-decoration-none p-0 mb-2"
                onClick={() => navigate("/engineering-value-chain")}
              >
                <img
                  src="../../../static/icons/arrow-left.svg"
                  alt="Back"
                  width="16"
                  className="me-2"
                />
                バリューチェーンに戻る
              </button>
              <h2>
                <span className="badge bg-secondary me-2">Phase {phase.phase_id}</span>
                {phase.phase_name}
              </h2>
              <p className="text-muted">{phase.phase_name_en}</p>
            </div>
            <div>
              {phase.status === "pending" && (
                <button className="btn btn-success" onClick={handleStartPhase}>
                  <img
                    src="../../../static/icons/play.svg"
                    alt="Start"
                    width="16"
                    className="me-2 dokuly-filter-white"
                  />
                  フェーズを開始
                </button>
              )}
              {phase.status === "in_progress" && (
                <button
                  className="btn btn-primary"
                  onClick={handleCompletePhase}
                  disabled={!canComplete()}
                >
                  <img
                    src="../../../static/icons/check.svg"
                    alt="Complete"
                    width="16"
                    className="me-2 dokuly-filter-white"
                  />
                  フェーズを完了
                </button>
              )}
              {phase.status === "completed" && (
                <span className="badge bg-success" style={{ fontSize: "16px", padding: "10px 20px" }}>
                  ✓ 完了済み
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Info */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">フェーズ情報</h6>
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <td className="text-muted">ステータス</td>
                    <td>
                      <span
                        className={`badge bg-${
                          phase.status === "completed"
                            ? "success"
                            : phase.status === "in_progress"
                            ? "primary"
                            : "secondary"
                        }`}
                      >
                        {phase.status === "completed"
                          ? "完了"
                          : phase.status === "in_progress"
                          ? "進行中"
                          : "未着手"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">進捗率</td>
                    <td>
                      <strong>{phase.completion_percentage}%</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted">開始日</td>
                    <td>{phase.start_date || "未開始"}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">目標完了日</td>
                    <td>{phase.target_end_date}</td>
                  </tr>
                  <tr>
                    <td className="text-muted">実完了日</td>
                    <td>{phase.actual_end_date || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Function Card */}
        <div className="col-md-8">
          {phase.enabling_function ? (
            <div className="card border-primary h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="card-title mb-2">
                      <img
                        src={`../../../static/icons/${phase.enabling_function.icon}.svg`}
                        alt={phase.enabling_function.title}
                        width="24"
                        className="me-2 dokuly-filter-primary"
                      />
                      {phase.enabling_function.title}
                    </h5>
                    <p className="text-muted mb-0">{phase.enabling_function.description}</p>
                  </div>
                  <span className="badge bg-success">AI機能</span>
                </div>

                <div className="alert alert-light mb-3">
                  <small>
                    <strong>この機能について:</strong> このフェーズ専用のAI機能です。
                    成果物の作成を支援し、品質向上と効率化を実現します。
                  </small>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={handleAIFunctionLaunch}
                  disabled={phase.status === "pending"}
                >
                  <img
                    src="../../../static/icons/cpu.svg"
                    alt="AI"
                    width="16"
                    className="me-2 dokuly-filter-white"
                  />
                  {phase.enabling_function.title}を起動
                </button>

                {phase.status === "pending" && (
                  <small className="text-muted d-block mt-2 text-center">
                    フェーズを開始すると利用できます
                  </small>
                )}
              </div>
            </div>
          ) : (
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">AI支援機能</h5>
                <p className="text-muted">このフェーズには専用のAI機能はありません。</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Artifacts Checklist */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">成果物チェックリスト</h5>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>状態</th>
                      <th style={{ width: "40%" }}>成果物名</th>
                      <th style={{ width: "10%" }}>必須</th>
                      <th style={{ width: "20%" }}>ドキュメント</th>
                      <th style={{ width: "25%" }}>アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artifacts.map((artifact) => (
                      <tr key={artifact.id}>
                        <td>
                          {artifact.uploaded ? (
                            <span className="text-success">
                              <img
                                src="../../../static/icons/check-circle.svg"
                                alt="Uploaded"
                                width="20"
                                className="dokuly-filter-success"
                              />
                            </span>
                          ) : (
                            <span className="text-muted">
                              <img
                                src="../../../static/icons/circle.svg"
                                alt="Pending"
                                width="20"
                              />
                            </span>
                          )}
                        </td>
                        <td>
                          <strong>{artifact.name}</strong>
                        </td>
                        <td>
                          {artifact.required ? (
                            <span className="badge bg-danger">必須</span>
                          ) : (
                            <span className="badge bg-secondary">任意</span>
                          )}
                        </td>
                        <td>
                          {artifact.document_id ? (
                            <a href="#" className="text-decoration-none">
                              DOC-{artifact.document_id}
                            </a>
                          ) : (
                            <span className="text-muted">未登録</span>
                          )}
                        </td>
                        <td>
                          {artifact.uploaded ? (
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary">
                                <img
                                  src="../../../static/icons/eye.svg"
                                  alt="View"
                                  width="14"
                                  className="me-1"
                                />
                                表示
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <img
                                  src="../../../static/icons/download.svg"
                                  alt="Download"
                                  width="14"
                                  className="me-1"
                                />
                                DL
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleFileUpload(artifact.id)}
                              disabled={phase.status === "pending"}
                            >
                              <img
                                src="../../../static/icons/upload.svg"
                                alt="Upload"
                                width="14"
                                className="me-1 dokuly-filter-white"
                              />
                              アップロード
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Progress Summary */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>成果物進捗</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>必須成果物</span>
                        <strong>
                          {artifacts.filter((a) => a.required && a.uploaded).length} /{" "}
                          {artifacts.filter((a) => a.required).length}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>全成果物</span>
                        <strong>
                          {artifacts.filter((a) => a.uploaded).length} / {artifacts.length}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseDetail;
