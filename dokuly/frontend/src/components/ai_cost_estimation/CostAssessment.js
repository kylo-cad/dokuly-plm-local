import React, { useState } from "react";
import {
  mockCostAnalysis,
  mockCostBreakdown,
  mockCostComparisons,
  mockQuotations,
} from "./mockData";

const CostAssessment = ({ project, onComplete }) => {
  const [costAnalysis] = useState(mockCostAnalysis);
  const [costBreakdown] = useState(mockCostBreakdown);
  const [costComparisons] = useState(mockCostComparisons);
  const [quotations] = useState(mockQuotations);
  const [selectedQuotation] = useState(quotations.find((q) => q.is_selected));

  const renderBoxPlot = () => {
    const stats = costAnalysis.similar_items_cost_stats;
    const currentPrice = selectedQuotation.unit_price;
    const aiPrice = costAnalysis.ai_estimated_cost;

    // Simple visualization
    const min = stats.min;
    const max = stats.max;
    const range = max - min;

    const getPosition = (value) => {
      return ((value - min) / range) * 100;
    };

    return (
      <div className="mb-4">
        <h6 className="mb-3">類似品価格分布（箱ひげ図）</h6>
        <div className="position-relative" style={{ height: 120 }}>
          {/* Box plot */}
          <div
            className="position-absolute bg-light border"
            style={{
              left: `${getPosition(stats.q1)}%`,
              width: `${getPosition(stats.q3) - getPosition(stats.q1)}%`,
              height: 40,
              top: 40,
            }}
          >
            {/* Median line */}
            <div
              className="position-absolute bg-primary"
              style={{
                left: `${((stats.median - stats.q1) / (stats.q3 - stats.q1)) * 100}%`,
                width: 3,
                height: 40,
                top: 0,
              }}
            />
          </div>

          {/* Whiskers */}
          <div
            className="position-absolute border-top border-2"
            style={{
              left: `${getPosition(stats.min)}%`,
              width: `${getPosition(stats.q1) - getPosition(stats.min)}%`,
              top: 60,
            }}
          />
          <div
            className="position-absolute border-top border-2"
            style={{
              left: `${getPosition(stats.q3)}%`,
              width: `${getPosition(stats.max) - getPosition(stats.q3)}%`,
              top: 60,
            }}
          />

          {/* Current price marker */}
          <div
            className="position-absolute"
            style={{
              left: `${getPosition(currentPrice)}%`,
              top: 20,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="bg-danger rounded-circle"
              style={{ width: 12, height: 12 }}
            />
            <small className="text-danger fw-bold" style={{ whiteSpace: "nowrap" }}>
              現在見積<br />¥{currentPrice.toLocaleString()}
            </small>
          </div>

          {/* AI estimated price marker */}
          <div
            className="position-absolute"
            style={{
              left: `${getPosition(aiPrice)}%`,
              top: 85,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="bg-success rounded-circle"
              style={{ width: 12, height: 12 }}
            />
            <small className="text-success fw-bold" style={{ whiteSpace: "nowrap" }}>
              AI推定<br />¥{aiPrice.toLocaleString()}
            </small>
          </div>

          {/* Scale labels */}
          <div
            className="position-absolute small text-muted"
            style={{ left: `${getPosition(stats.min)}%`, top: 105, transform: "translateX(-50%)" }}
          >
            ¥{stats.min.toLocaleString()}
          </div>
          <div
            className="position-absolute small text-muted"
            style={{ left: `${getPosition(stats.q1)}%`, top: 105, transform: "translateX(-50%)" }}
          >
            Q1
          </div>
          <div
            className="position-absolute small text-muted"
            style={{ left: `${getPosition(stats.median)}%`, top: 105, transform: "translateX(-50%)" }}
          >
            中央値
          </div>
          <div
            className="position-absolute small text-muted"
            style={{ left: `${getPosition(stats.q3)}%`, top: 105, transform: "translateX(-50%)" }}
          >
            Q3
          </div>
          <div
            className="position-absolute small text-muted"
            style={{ left: `${getPosition(stats.max)}%`, top: 105, transform: "translateX(-50%)" }}
          >
            ¥{stats.max.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ3: 原価妥当性の査定
        </h4>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body">
                <small className="text-muted">現在見積価格</small>
                <h5 className="mb-0 text-danger">
                  ¥{selectedQuotation.unit_price.toLocaleString()}
                </h5>
                <small className="text-muted">{selectedQuotation.supplier_name}</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body">
                <small className="text-muted">AI推定妥当価格</small>
                <h5 className="mb-0 text-success">
                  ¥{costAnalysis.ai_estimated_cost.toLocaleString()}
                </h5>
                <small className="text-muted">
                  確信度: {(costAnalysis.ai_confidence * 100).toFixed(0)}%
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body">
                <small className="text-muted">価格差分</small>
                <h5 className="mb-0 text-warning">
                  ¥{(selectedQuotation.unit_price - costAnalysis.ai_estimated_cost).toLocaleString()}
                </h5>
                <small className="text-muted">
                  {(((selectedQuotation.unit_price - costAnalysis.ai_estimated_cost) / costAnalysis.ai_estimated_cost) * 100).toFixed(1)}% 割高
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-light">
              <div className="card-body">
                <small className="text-muted">類似品平均価格</small>
                <h5 className="mb-0">
                  ¥{costAnalysis.similar_items_cost_stats.mean.toLocaleString()}
                </h5>
                <small className="text-muted">
                  {costAnalysis.similar_items_cost_stats.count}件のデータ
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Box Plot */}
        {renderBoxPlot()}

        {/* AI Reasoning */}
        <div className="alert alert-primary mb-4">
          <h6 className="mb-2">
            <img
              src="../../static/icons/cpu.svg"
              alt="AI"
              width="20"
              className="me-2"
            />
            AI推論の根拠
          </h6>
          <p className="mb-0">{costAnalysis.reasoning}</p>
        </div>

        {/* Cost Breakdown */}
        <h5 className="mb-3">AI推定原価内訳</h5>
        <div className="table-responsive mb-4">
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>原価項目</th>
                <th style={{ width: "15%" }}>金額</th>
                <th style={{ width: "45%" }}>計算ロジック</th>
                <th style={{ width: "15%" }}>ソース</th>
              </tr>
            </thead>
            <tbody>
              {costBreakdown.map((item, idx) => (
                <tr key={idx}>
                  <td className="fw-bold">{item.process_name}</td>
                  <td className="text-end">¥{item.amount.toLocaleString()}</td>
                  <td>
                    <small className="text-muted">{item.calculation_logic}</small>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.is_ai_estimated ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      {item.is_ai_estimated ? "AI推論" : "実績"}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="table-success fw-bold">
                <td>合計</td>
                <td className="text-end">
                  ¥{costBreakdown.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cost Comparisons */}
        <h5 className="mb-3">類似品との比較</h5>
        {costComparisons.map((comparison, idx) => (
          <div key={idx} className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="mb-1">{comparison.similar_item_name}</h6>
                  <small className="text-muted">
                    類似品価格: ¥{comparison.reference_cost.toLocaleString()}
                  </small>
                </div>
                <div className="text-end">
                  <span
                    className={`badge ${
                      comparison.validity_judgment === "high"
                        ? "bg-warning"
                        : comparison.validity_judgment === "appropriate"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {comparison.validity_judgment === "high" && "割高"}
                    {comparison.validity_judgment === "appropriate" && "妥当"}
                    {comparison.validity_judgment === "low" && "割安"}
                  </span>
                  <div className="mt-1">
                    <small className="text-muted">
                      差分:
                    </small>
                    <span
                      className={`ms-1 fw-bold ${
                        comparison.cost_difference > 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {comparison.cost_difference > 0 ? "+" : ""}
                      ¥{comparison.cost_difference.toLocaleString()}
                      ({comparison.cost_difference_percent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-light rounded mb-3">
                <small className="text-muted d-block fw-bold mb-1">AI判定理由:</small>
                <small>{comparison.judgment_reasoning}</small>
              </div>

              {/* Process-level comparison */}
              {comparison.process_comparison && (
                <div>
                  <small className="text-muted fw-bold d-block mb-2">工程別比較:</small>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: "20%" }}>工程</th>
                          <th style={{ width: "15%" }}>現在見積</th>
                          <th style={{ width: "15%" }}>類似品実績</th>
                          <th style={{ width: "15%" }}>差分</th>
                          <th style={{ width: "35%" }}>評価</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.process_comparison.map((proc, pidx) => (
                          <tr key={pidx}>
                            <td className="small">{proc.process}</td>
                            <td className="text-end small">¥{proc.current.toLocaleString()}</td>
                            <td className="text-end small">¥{proc.reference.toLocaleString()}</td>
                            <td
                              className={`text-end small fw-bold ${
                                proc.diff > 0 ? "text-danger" : "text-success"
                              }`}
                            >
                              {proc.diff > 0 ? "+" : ""}¥{proc.diff.toLocaleString()}
                              <br />
                              <span className="text-muted">({proc.diff_percent.toFixed(1)}%)</span>
                            </td>
                            <td className="small text-muted">{proc.reasoning}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="mt-4 d-flex justify-content-between">
          <button className="btn btn-outline-secondary">
            <img
              src="../../static/icons/edit.svg"
              alt="Edit"
              width="16"
              className="me-2"
            />
            計算ロジックを調整
          </button>
          <button className="btn btn-success" onClick={onComplete}>
            次へ: 改善提案を確認
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

export default CostAssessment;
