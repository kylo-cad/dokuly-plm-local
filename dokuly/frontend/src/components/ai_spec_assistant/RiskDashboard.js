import React, { useState } from "react";
import { mockRiskAssessment } from "./mockData";

const RiskDashboard = ({ onComplete }) => {
  const [expandedSections, setExpandedSections] = useState({
    changePoints: true,
    qualityRisks: true,
    deliveryRisks: false,
    costRisks: false,
    failures: false,
    compliance: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: "danger",
      high: "danger",
      medium: "warning",
      low: "info"
    };
    const labels = {
      critical: "重大",
      high: "高",
      medium: "中",
      low: "低"
    };
    return (
      <span className={`badge bg-${colors[severity]}`}>
        {labels[severity]}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ5: QDリスクとコストの提示
        </h4>

        {/* Help Section */}
        <div className="alert alert-light border mb-4">
          <div className="d-flex align-items-start">
            <img
              src="../../static/icons/info.svg"
              alt="Info"
              width="20"
              className="me-2 mt-1"
            />
            <div className="small">
              <strong>このステップの目的:</strong> AIが品質・納期リスクとコストを推論し、DRBFMベースの変化点分析を提示します。
              <br />
              <strong>ポイント:</strong> 過去の不具合事例と環境規制チェックにより、品質リスクを事前に予測できます。
            </div>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-danger text-white">
              <div className="card-body text-center">
                <h6>高リスク</h6>
                <h2>2</h2>
                <small>変化点</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h6>中リスク</h6>
                <h2>3</h2>
                <small>品質リスク</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h6>納期リスク</h6>
                <h2>2</h2>
                <small>遅延可能性</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h6>コスト増</h6>
                <h2>+23%</h2>
                <small>¥910,000</small>
              </div>
            </div>
          </div>
        </div>

        {/* Change Points (DRBFM) */}
        <div className="mb-4">
          <div
            className="d-flex justify-content-between align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection("changePoints")}
          >
            <h5 className="mb-0">
              🔄 変化点分析（DRBFM）
              <span className="badge bg-danger ms-2">
                {mockRiskAssessment.change_points.length}
              </span>
            </h5>
            <span>{expandedSections.changePoints ? "▼" : "▶"}</span>
          </div>
          {expandedSections.changePoints && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>変化点</th>
                    <th>変更前</th>
                    <th>変更後</th>
                    <th>懸念事項</th>
                    <th>重大度</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRiskAssessment.change_points.map((point, index) => (
                    <tr key={index} className={`table-${point.color}`}>
                      <td className="fw-bold">{point.item}</td>
                      <td>{point.from}</td>
                      <td>{point.to}</td>
                      <td>{point.concern}</td>
                      <td>{getSeverityBadge(point.severity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quality Risks */}
        <div className="mb-4">
          <div
            className="d-flex justify-content-between align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection("qualityRisks")}
          >
            <h5 className="mb-0">
              ⚠️ 品質リスク
              <span className="badge bg-warning ms-2">
                {mockRiskAssessment.quality_risks.length}
              </span>
            </h5>
            <span>{expandedSections.qualityRisks ? "▼" : "▶"}</span>
          </div>
          {expandedSections.qualityRisks && (
            <div>
              {mockRiskAssessment.quality_risks.map((risk, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">
                        {risk.category} {getSeverityBadge(risk.severity)}
                      </h6>
                      <span className="badge bg-secondary">{risk.cost_impact}</span>
                    </div>
                    <p className="mb-2">{risk.description}</p>
                    <div className="alert alert-light mb-2">
                      <small>
                        <strong>根拠:</strong> {risk.source}
                      </small>
                    </div>
                    <div className="alert alert-success mb-0">
                      <small>
                        <strong>推奨対策:</strong> {risk.recommendation}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery Risks */}
        <div className="mb-4">
          <div
            className="d-flex justify-content-between align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection("deliveryRisks")}
          >
            <h5 className="mb-0">
              📅 納期リスク
              <span className="badge bg-info ms-2">
                {mockRiskAssessment.delivery_risks.length}
              </span>
            </h5>
            <span>{expandedSections.deliveryRisks ? "▼" : "▶"}</span>
          </div>
          {expandedSections.deliveryRisks && (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>リスク内容</th>
                    <th>対策</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRiskAssessment.delivery_risks.map((risk, index) => (
                    <tr key={index}>
                      <td className="fw-bold">{risk.item}</td>
                      <td>{risk.risk}</td>
                      <td>{risk.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Cost Risks */}
        <div className="mb-4">
          <div
            className="d-flex justify-content-between align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => toggleSection("costRisks")}
          >
            <h5 className="mb-0">
              💰 コストリスク
              <span className="badge bg-success ms-2">
                {mockRiskAssessment.cost_risks.length}
              </span>
            </h5>
            <span>{expandedSections.costRisks ? "▼" : "▶"}</span>
          </div>
          {expandedSections.costRisks && (
            <div>
              {mockRiskAssessment.cost_risks.map((cost, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <h6>{cost.category}</h6>
                    <div className="row">
                      <div className="col-md-4">
                        <small className="text-muted">基準</small>
                        <div className="fs-5">¥{cost.baseline.toLocaleString()}</div>
                      </div>
                      <div className="col-md-4">
                        <small className="text-muted">推定</small>
                        <div className="fs-5">¥{cost.estimated.toLocaleString()}</div>
                      </div>
                      <div className="col-md-4">
                        <small className="text-muted">差額</small>
                        <div className="fs-5 text-danger">{cost.difference}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <small><strong>内訳:</strong></small>
                      <ul className="mb-0">
                        {cost.breakdown.map((item, idx) => (
                          <li key={idx}>
                            {item.item}: ¥{item.baseline.toLocaleString()} → ¥{item.estimated.toLocaleString()}
                            <span className="text-danger"> (+¥{item.diff.toLocaleString()})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compliance Alerts */}
        {mockRiskAssessment.compliance_alerts.length > 0 && (
          <div className="mb-4">
            <h5 className="mb-3">🔔 環境規制アラート</h5>
            {mockRiskAssessment.compliance_alerts.map((alert, index) => (
              <div key={index} className={`alert alert-${alert.type}`}>
                <strong>{alert.category}:</strong> {alert.message}
                <br />
                <small>
                  <strong>対応:</strong> {alert.action_required}
                </small>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-outline-secondary">
            <img
              src="../../static/icons/arrow-left.svg"
              alt="back"
              width="16"
              className="me-2"
            />
            戻る
          </button>
          <button className="btn btn-success" onClick={onComplete}>
            次へ: レビュー申請
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

export default RiskDashboard;
