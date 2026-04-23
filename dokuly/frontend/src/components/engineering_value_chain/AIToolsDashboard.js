import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiTools, dataFlowLinks, checkToolDataAvailability } from "./aiToolsMockData";

const AIToolsDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("cards"); // cards, dataflow

  const activeTools = aiTools.filter((tool) => tool.is_active);
  const inactiveTools = aiTools.filter((tool) => !tool.is_active);

  const handleToolLaunch = (tool) => {
    if (!tool.is_active) {
      alert(`${tool.name_ja} is not active. Please contact sales to enable this feature.`);
      return;
    }
    navigate(tool.route);
  };

  const renderToolCards = () => {
    return (
      <div className="row">
        {/* Active Tools */}
        {activeTools.map((tool) => {
          const dataAvailability = checkToolDataAvailability(tool.id);
          return (
            <div key={tool.id} className="col-md-6 col-lg-4 mb-4">
              <div className={`card h-100 ${dataAvailability.ready ? 'border-success' : 'border-primary'}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <img
                        src={`../../static/icons/${tool.icon}.svg`}
                        alt={tool.name}
                        width="32"
                        className="me-2 dokuly-filter-primary"
                      />
                      <div>
                        <h5 className="mb-0">{tool.name_ja}</h5>
                        <small className="text-muted">{tool.phase_name}</small>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-1">
                      <span className="badge bg-success">Active</span>
                      {dataAvailability.ready && (
                        <span className="badge bg-success" style={{ fontSize: "10px" }}>
                          ✓ Ready
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-muted mb-3">{tool.description}</p>

                  {/* Data Availability Indicator */}
                  {dataAvailability.ready ? (
                    <div className="alert alert-success py-2 mb-3">
                      <small>
                        <img
                          src="../../static/icons/check-circle.svg"
                          alt="ready"
                          width="14"
                          className="me-1 dokuly-filter-success"
                        />
                        <strong>実行可能</strong> - 必要データ揃い
                      </small>
                    </div>
                  ) : (
                    <div className="alert alert-warning py-2 mb-3">
                      <small>
                        <img
                          src="../../static/icons/alert-circle.svg"
                          alt="missing"
                          width="14"
                          className="me-1"
                        />
                        データ不足: {dataAvailability.missing.slice(0, 2).join(", ")}
                        {dataAvailability.missing.length > 2 && ` 他${dataAvailability.missing.length - 2}件`}
                      </small>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-muted d-block mb-1">使用回数</small>
                    <strong>{tool.usage_count}回</strong>
                  </div>

                  {tool.related_artifacts_count > 0 && (
                    <div className="alert alert-info py-2 mb-3">
                      <small>
                        <img
                          src="../../static/icons/link.svg"
                          alt="link"
                          width="14"
                          className="me-1"
                        />
                        {tool.related_artifacts_count} 個の成果物が他ツールと連携可能
                      </small>
                    </div>
                  )}

                  {tool.last_used && (
                    <div className="mb-3">
                      <small className="text-muted">
                        最終使用: {tool.last_used}
                      </small>
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleToolLaunch(tool)}
                  >
                    <img
                      src="../../static/icons/play.svg"
                      alt="launch"
                      width="16"
                      className="me-2 dokuly-filter-white"
                    />
                    起動
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Inactive Tools */}
        {inactiveTools.map((tool) => (
          <div key={tool.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100" style={{ opacity: 0.6 }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={`../../static/icons/${tool.icon}.svg`}
                      alt={tool.name}
                      width="32"
                      className="me-2"
                    />
                    <div>
                      <h5 className="mb-0">{tool.name_ja}</h5>
                      <small className="text-muted">{tool.phase_name}</small>
                    </div>
                  </div>
                  <span className="badge bg-secondary">Disabled</span>
                </div>

                <p className="text-muted mb-3">{tool.description}</p>

                <div className="alert alert-warning py-2 mb-3">
                  <small>この機能は有効化されていません</small>
                </div>

                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() => handleToolLaunch(tool)}
                >
                  <img
                    src="../../static/icons/shopping-cart.svg"
                    alt="purchase"
                    width="16"
                    className="me-2"
                  />
                  購入する
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDataFlow = () => {
    const phases = [
      { id: 1, name: "商品企画" },
      { id: 2, name: "製品設計" },
      { id: 3, name: "原価企画" },
      { id: 4, name: "生産準備" },
      { id: 5, name: "生産/保全" },
    ];

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">データフロー全体像</h5>

          <div className="table-responsive">
            <table className="table" style={{ minWidth: "800px" }}>
              <thead>
                <tr>
                  {phases.map((phase) => (
                    <th key={phase.id} className="text-center" style={{ width: "20%" }}>
                      <div className="mb-2">
                        <span className="badge bg-secondary">Phase {phase.id}</span>
                      </div>
                      <div>{phase.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {phases.map((phase) => {
                    const tool = aiTools.find((t) => t.phase === phase.id);
                    if (!tool) return <td key={phase.id}></td>;

                    const outgoingLinks = dataFlowLinks.filter(
                      (link) => link.from === tool.id
                    );
                    const hasOutgoing = outgoingLinks.length > 0;

                    return (
                      <td key={phase.id} className="text-center p-3">
                        <div
                          className={`card ${
                            tool.is_active ? "border-primary" : ""
                          } mb-3`}
                          style={{ opacity: tool.is_active ? 1 : 0.5 }}
                        >
                          <div className="card-body p-2">
                            <div className="mb-2">
                              <img
                                src={`../../static/icons/${tool.icon}.svg`}
                                alt={tool.name}
                                width="24"
                                className={
                                  tool.is_active ? "dokuly-filter-primary" : ""
                                }
                              />
                            </div>
                            <div>
                              <strong style={{ fontSize: "12px" }}>
                                {tool.name_ja}
                              </strong>
                            </div>

                            {tool.is_active && (
                              <div className="mt-2">
                                <span
                                  className="badge bg-success"
                                  style={{ fontSize: "10px" }}
                                >
                                  ✓ {tool.related_artifacts_count} artifacts
                                </span>
                              </div>
                            )}

                            {!tool.is_active && (
                              <div className="mt-2">
                                <span
                                  className="badge bg-secondary"
                                  style={{ fontSize: "10px" }}
                                >
                                  ○ Not used
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Data flow arrows */}
                        {hasOutgoing && (
                          <div className="text-start" style={{ fontSize: "11px" }}>
                            {outgoingLinks.map((link, idx) => (
                              <div key={idx} className="mb-1">
                                <img
                                  src="../../static/icons/arrow-right.svg"
                                  alt="flow"
                                  width="12"
                                  className="me-1 dokuly-filter-primary"
                                />
                                <span className="text-muted">{link.artifact}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {tool.is_active && (
                          <button
                            className="btn btn-sm btn-primary mt-2 w-100"
                            onClick={() => handleToolLaunch(tool)}
                            style={{ fontSize: "11px" }}
                          >
                            起動
                          </button>
                        )}

                        {!tool.is_active && (
                          <button
                            className="btn btn-sm btn-outline-secondary mt-2 w-100"
                            onClick={() => handleToolLaunch(tool)}
                            style={{ fontSize: "11px" }}
                          >
                            購入
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert alert-light mt-4">
            <small>
              <strong>データフローについて:</strong> 各AIツールの出力は、次のフェーズのツールで再利用できます。
              これにより、データ入力の手間を削減し、一貫性のある設計データを維持できます。
            </small>
          </div>
        </div>
      </div>
    );
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
                  src="../../static/icons/cpu.svg"
                  alt="AI Tools"
                  width="32"
                  className="dokuly-filter-primary me-2"
                />
                AI ツールライブラリ
              </h2>
              <p className="text-muted">
                製品開発を支援する専用AIツール - 必要な機能だけを選んで使えます
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/engineering-value-chain")}
              >
                <img
                  src="../../static/icons/trending-up.svg"
                  alt="Value Chain"
                  width="20"
                  className="me-2"
                />
                Value Chain View
              </button>
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
      </div>

      {/* View Toggle */}
      <div className="row mb-4">
        <div className="col">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${
                viewMode === "cards" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <img
                src="../../static/icons/grid.svg"
                alt="cards"
                width="16"
                className={`me-2 ${
                  viewMode === "cards" ? "dokuly-filter-white" : ""
                }`}
              />
              ツールカード
            </button>
            <button
              type="button"
              className={`btn ${
                viewMode === "dataflow" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setViewMode("dataflow")}
            >
              <img
                src="../../static/icons/git-branch.svg"
                alt="dataflow"
                width="16"
                className={`me-2 ${
                  viewMode === "dataflow" ? "dokuly-filter-white" : ""
                }`}
              />
              データフロー
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">有効なツール</h6>
              <h3 className="mb-0">{activeTools.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">総使用回数</h6>
              <h3 className="mb-0">
                {aiTools.reduce((sum, tool) => sum + tool.usage_count, 0)}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">データ連携可能</h6>
              <h3 className="mb-0">{dataFlowLinks.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted">利用可能ツール</h6>
              <h3 className="mb-0">{inactiveTools.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col">
          {viewMode === "cards" && renderToolCards()}
          {viewMode === "dataflow" && renderDataFlow()}
        </div>
      </div>
    </div>
  );
};

export default AIToolsDashboard;
