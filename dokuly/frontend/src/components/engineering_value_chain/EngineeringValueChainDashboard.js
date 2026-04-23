import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockValueChainInstance } from "./mockData";

const EngineeringValueChainDashboard = () => {
  const navigate = useNavigate();
  const [valueChain] = useState(mockValueChainInstance);

  const getPhaseStatusColor = (phase) => {
    if (phase.status === "completed") return "success";
    if (phase.status === "in_progress") return "primary";
    return "secondary";
  };

  const getPhaseStatusIcon = (phase) => {
    if (phase.status === "completed") return "✓";
    if (phase.status === "in_progress") return phase.phase_id;
    return phase.phase_id;
  };

  const handlePhaseClick = (phaseId) => {
    navigate(`/engineering-value-chain/phase/${phaseId}`);
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mt-4 mb-3">
        <div className="col">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>
                <img
                  src="../../static/icons/trending-up.svg"
                  alt="Value Chain"
                  width="32"
                  className="dokuly-filter-primary me-2"
                />
                製品開発バリューチェーン
              </h2>
              <p className="text-muted">
                Engineering Value Chain - 製品開発プロセス全体の可視化と管理
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

      {/* Product Info Card */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="mb-2">{valueChain.product_name}</h5>
                  <div className="d-flex gap-3">
                    <span className="text-muted">
                      <strong>製品コード:</strong> {valueChain.product_code}
                    </span>
                    <span className="text-muted">
                      <strong>開始日:</strong> {valueChain.created_date}
                    </span>
                    <span className="text-muted">
                      <strong>担当:</strong> {valueChain.created_by}
                    </span>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="mb-2">
                    <small className="text-muted">全体進捗</small>
                  </div>
                  <div className="progress" style={{ height: "25px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${valueChain.overall_progress}%` }}
                    >
                      {valueChain.overall_progress}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Progress Timeline */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">フェーズ進捗</h5>
              <div className="d-flex justify-content-between align-items-center">
                {valueChain.phases.map((phase, index) => (
                  <React.Fragment key={phase.phase_id}>
                    <div
                      className="text-center"
                      style={{ flex: 1, cursor: "pointer" }}
                      onClick={() => handlePhaseClick(phase.phase_id)}
                    >
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 bg-${getPhaseStatusColor(
                          phase
                        )} text-white`}
                        style={{ width: 50, height: 50 }}
                      >
                        <strong>{getPhaseStatusIcon(phase)}</strong>
                      </div>
                      <div>
                        <small className={phase.status === "in_progress" ? "fw-bold" : ""}>
                          {phase.phase_name}
                        </small>
                        {phase.start_date && (
                          <div>
                            <small className="text-muted">{phase.start_date}</small>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < valueChain.phases.length - 1 && (
                      <div
                        style={{
                          flex: 0.5,
                          height: 2,
                          backgroundColor:
                            phase.status === "completed" ? "#28a745" : "#dee2e6",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Cards Grid */}
      <div className="row">
        {valueChain.phases.map((phase) => (
          <div key={phase.phase_id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card h-100"
              style={{ cursor: "pointer" }}
              onClick={() => handlePhaseClick(phase.phase_id)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-secondary mb-2">
                      Phase {phase.phase_id}
                    </span>
                    <h6 className="card-title mb-0">{phase.phase_name}</h6>
                    <small className="text-muted">{phase.phase_name_en}</small>
                  </div>
                  <span className={`badge bg-${getPhaseStatusColor(phase)}`}>
                    {phase.status === "completed"
                      ? "完了"
                      : phase.status === "in_progress"
                      ? "進行中"
                      : "未着手"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">進捗</small>
                    <small className="text-muted">{phase.completion_percentage}%</small>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className={`progress-bar bg-${getPhaseStatusColor(phase)}`}
                      style={{ width: `${phase.completion_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Artifacts Summary */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">成果物</small>
                  <div className="d-flex gap-2 flex-wrap">
                    {phase.output_artifacts.slice(0, 3).map((artifact) => (
                      <span
                        key={artifact.id}
                        className={`badge ${
                          artifact.uploaded ? "bg-success" : "bg-light text-dark"
                        }`}
                        style={{ fontSize: "10px" }}
                      >
                        {artifact.uploaded ? "✓ " : ""}
                        {artifact.name}
                      </span>
                    ))}
                    {phase.output_artifacts.length > 3 && (
                      <span className="badge bg-light text-dark" style={{ fontSize: "10px" }}>
                        +{phase.output_artifacts.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Function */}
                {phase.enabling_function && (
                  <div className="alert alert-info py-2 mb-0">
                    <div className="d-flex align-items-center">
                      <img
                        src={`../../static/icons/${phase.enabling_function.icon}.svg`}
                        alt={phase.enabling_function.title}
                        width="16"
                        className="me-2"
                      />
                      <div>
                        <small className="fw-bold d-block">
                          {phase.enabling_function.title}
                        </small>
                        <small style={{ fontSize: "10px" }}>
                          {phase.enabling_function.description}
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Target Date */}
                <div className="mt-3 pt-2 border-top">
                  <small className="text-muted">
                    <img
                      src="../../static/icons/calendar.svg"
                      alt="Date"
                      width="14"
                      className="me-1"
                    />
                    目標完了日: {phase.target_end_date}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineeringValueChainDashboard;
