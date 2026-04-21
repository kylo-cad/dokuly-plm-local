import React, { useState } from "react";
import {
  mockImprovementProposals,
  mockImprovementScenarios,
  mockQuotations,
} from "./mockData";

const ImprovementProposal = ({ project, onComplete }) => {
  const [proposals] = useState(mockImprovementProposals);
  const [scenarios] = useState(mockImprovementScenarios);
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios.find(s => s.is_selected)?.id || 1);
  const [selectedQuotation] = useState(mockQuotations.find((q) => q.is_selected));

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  const getProposalTypeIcon = (type) => {
    const typeMap = {
      supplier_change: "users",
      process_change: "tool",
      step_change: "git-branch",
      material_change: "box",
      design_change: "edit-3",
      combined: "layers",
    };
    return typeMap[type] || "file";
  };

  const getFeasibilityBadge = (feasibility) => {
    const colorMap = {
      high: "success",
      medium: "warning",
      low: "danger",
    };
    const labelMap = {
      high: "高",
      medium: "中",
      low: "低",
    };
    return (
      <span className={`badge bg-${colorMap[feasibility]}`}>
        実現可能性: {labelMap[feasibility]}
      </span>
    );
  };

  const renderCostBreakdownChart = (breakdown) => {
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return (
      <div className="mb-3">
        {Object.entries(breakdown).map(([category, amount]) => {
          const percent = (amount / total) * 100;
          return (
            <div key={category} className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <small className="text-muted">{category}</small>
                <small className="fw-bold">¥{amount.toLocaleString()} ({percent.toFixed(1)}%)</small>
              </div>
              <div className="progress" style={{ height: 8 }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ4: 改善提案とシミュレーション
        </h4>

        <div className="alert alert-success mb-4">
          <div className="d-flex align-items-start">
            <img
              src="../../static/icons/lightbulb.svg"
              alt="Idea"
              width="20"
              className="me-2 mt-1"
            />
            <div>
              <strong>AIが{proposals.length}件の改善提案を生成しました</strong>
              <br />
              <small>
                過去データとAI知見から、コスト削減の可能性がある改善案を提示します。
                複数の提案を組み合わせたシナリオでシミュレーションも可能です。
              </small>
            </div>
          </div>
        </div>

        {/* Improvement Proposals */}
        <h5 className="mb-3">改善提案一覧</h5>
        <div className="row mb-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="col-md-6 mb-3">
              <div
                className={`card h-100 ${proposal.is_selected ? "border-primary" : ""}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-start">
                      <img
                        src={`../../static/icons/${getProposalTypeIcon(proposal.proposal_type)}.svg`}
                        alt={proposal.proposal_type}
                        width="20"
                        className="me-2 mt-1"
                      />
                      <div>
                        <h6 className="mb-1">{proposal.title}</h6>
                        <small className="text-muted">順位 #{proposal.rank}</small>
                      </div>
                    </div>
                    {proposal.is_selected && (
                      <span className="badge bg-primary">選択中</span>
                    )}
                  </div>

                  <p className="small mb-2">{proposal.description}</p>

                  <div className="row mb-2">
                    <div className="col-6">
                      <small className="text-muted">削減見込み</small>
                      <div className="text-success fw-bold">
                        ▼¥{proposal.estimated_cost_reduction.toLocaleString()}
                      </div>
                      <small className="text-muted">
                        ({proposal.cost_reduction_percent.toFixed(1)}%)
                      </small>
                    </div>
                    <div className="col-6">
                      {getFeasibilityBadge(proposal.feasibility)}
                      <div className="mt-1">
                        <small className="text-muted">
                          AI確信度: {(proposal.ai_confidence * 100).toFixed(0)}%
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted d-block fw-bold">実現可能性の根拠:</small>
                    <small>{proposal.feasibility_reasoning}</small>
                  </div>

                  {proposal.risks && (
                    <div className="alert alert-warning py-2 mb-0">
                      <small className="text-muted d-block fw-bold">リスク:</small>
                      <small>{proposal.risks}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scenarios */}
        <h5 className="mb-3">改善シナリオ比較</h5>
        <div className="card mb-4">
          <div className="card-body">
            <div className="btn-group w-100 mb-3" role="group">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  className={`btn ${
                    selectedScenarioId === scenario.id
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setSelectedScenarioId(scenario.id)}
                >
                  <div className="text-start">
                    <div className="fw-bold">{scenario.scenario_name}</div>
                    <small>
                      削減額: ▼¥{scenario.total_cost_reduction.toLocaleString()}
                      ({scenario.cost_reduction_percent.toFixed(1)}%)
                    </small>
                  </div>
                </button>
              ))}
            </div>

            {selectedScenario && (
              <div>
                <div className="alert alert-info mb-3">
                  <strong>{selectedScenario.scenario_name}</strong>
                  <p className="mb-0 small">{selectedScenario.description}</p>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <small className="text-muted">現状原価</small>
                        <h5 className="mb-0">
                          ¥{selectedScenario.baseline_cost.toLocaleString()}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <small>改善後原価</small>
                        <h5 className="mb-0">
                          ¥{selectedScenario.simulated_cost.toLocaleString()}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <small>削減額</small>
                        <h5 className="mb-0">
                          ▼¥{selectedScenario.total_cost_reduction.toLocaleString()}
                        </h5>
                        <small>
                          ({selectedScenario.cost_reduction_percent.toFixed(1)}%)
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="mb-2">原価内訳</h6>
                {renderCostBreakdownChart(selectedScenario.cost_breakdown)}

                <div className="row">
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-2">年間削減効果（数量5,000個/月）</small>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="mb-2">
                          <small className="text-muted">月間削減額</small>
                          <div className="fw-bold">
                            ¥{(selectedScenario.total_cost_reduction * 5000).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <small className="text-muted">年間削減額</small>
                          <div className="fw-bold text-success">
                            ¥{(selectedScenario.total_cost_reduction * 5000 * 12).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-2">数量増加時の効果（10,000個/月）</small>
                    <div className="card bg-light">
                      <div className="card-body">
                        <div className="mb-2">
                          <small className="text-muted">月間削減額</small>
                          <div className="fw-bold">
                            ¥{(selectedScenario.total_cost_reduction * 10000).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <small className="text-muted">年間削減額</small>
                          <div className="fw-bold text-success">
                            ¥{(selectedScenario.total_cost_reduction * 10000 * 12).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3">シミュレーション結果の出力</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <img
                  src="../../static/icons/file-text.svg"
                  alt="Excel"
                  width="16"
                  className="me-2"
                />
                Excel出力
              </button>
              <button className="btn btn-outline-primary">
                <img
                  src="../../static/icons/file.svg"
                  alt="PDF"
                  width="16"
                  className="me-2"
                />
                PDF出力
              </button>
              <button className="btn btn-outline-secondary">
                <img
                  src="../../static/icons/mail.svg"
                  alt="Email"
                  width="16"
                  className="me-2"
                />
                メール送信
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 d-flex justify-content-between">
          <button className="btn btn-outline-secondary">
            見積依頼書を作成
          </button>
          <button className="btn btn-success" onClick={onComplete}>
            次へ: 稟議書を作成
            <img
              src="../../static/icons/arrow-right.svg"
              alt="next"
              width="16"
              className="ms-2 dokuly-filter-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovementProposal;
