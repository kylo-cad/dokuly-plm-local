import React from "react";
import { mockSpecifications, mockSpecDifferences, mockBOMData } from "./mockData";

const SpecComparison = ({ selectedProject, onComplete }) => {
  const differences = mockSpecDifferences.project_101;

  const getImpactBadge = (impact) => {
    const colors = {
      high: "danger",
      medium: "warning",
      low: "info"
    };
    const labels = {
      high: "高",
      medium: "中",
      low: "低"
    };
    return (
      <span className={`badge bg-${colors[impact]}`}>
        影響度: {labels[impact]}
      </span>
    );
  };

  const renderBOMComparison = () => {
    const { base_model, proposed_model } = mockBOMData;

    return (
      <div className="row mt-4">
        <div className="col-md-6">
          <h6>基準モデル: {base_model.name}</h6>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th>部品名</th>
                <th>数量</th>
                <th className="text-end">単価</th>
              </tr>
            </thead>
            <tbody>
              {base_model.parts.map((part) => (
                <tr key={part.id}>
                  <td>{part.name}</td>
                  <td>{part.qty}</td>
                  <td className="text-end">¥{part.unit_cost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="2">合計</td>
                <td className="text-end">¥{base_model.total_cost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h6>変更後: {proposed_model.name}</h6>
          <table className="table table-sm table-bordered">
            <thead>
              <tr>
                <th>部品名</th>
                <th>数量</th>
                <th className="text-end">単価</th>
              </tr>
            </thead>
            <tbody>
              {proposed_model.parts.map((part) => (
                <tr key={part.id} className={part.changed ? "table-warning" : ""}>
                  <td>
                    {part.name}
                    {part.new && <span className="badge bg-success ms-2">新規</span>}
                    {part.changed && !part.new && (
                      <span className="badge bg-warning ms-2">変更</span>
                    )}
                  </td>
                  <td>{part.qty}</td>
                  <td className="text-end">¥{part.unit_cost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="2">合計</td>
                <td className="text-end">
                  ¥{proposed_model.total_cost.toLocaleString()}
                  <span className="text-danger ms-2">
                    (+¥{(proposed_model.total_cost - base_model.total_cost).toLocaleString()})
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ3-4: 仕様差分の確認と変更部品の決定
        </h4>

        {/* Project Info */}
        <div className="alert alert-info mb-4">
          <strong>基準モデル:</strong> {selectedProject?.name}
          <br />
          <small>類似度: {(selectedProject?.similarity_score * 100).toFixed(0)}%</small>
        </div>

        {/* Spec Differences */}
        <div className="mb-4">
          <h5 className="mb-3">仕様差分</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>仕様項目</th>
                  <th style={{ width: "30%" }}>新規案件</th>
                  <th style={{ width: "30%" }}>基準モデル</th>
                  <th style={{ width: "20%" }}>影響度</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(differences).map(([key, diff]) => (
                  <tr key={key}>
                    <td className="fw-bold">{key}</td>
                    <td>
                      <span className="badge bg-primary">{diff.current}</span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{diff.similar}</span>
                    </td>
                    <td>{getImpactBadge(diff.impact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOM Comparison */}
        <div className="mb-4">
          <h5 className="mb-3">BOM（部品表）比較</h5>
          {renderBOMComparison()}
        </div>

        {/* Cost Summary */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card bg-light">
              <div className="card-body">
                <h6>コストサマリー</h6>
                <table className="table table-sm mb-0">
                  <tr>
                    <td>基準モデル:</td>
                    <td className="text-end fw-bold">
                      ¥{mockBOMData.base_model.total_cost.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td>変更後:</td>
                    <td className="text-end fw-bold">
                      ¥{mockBOMData.proposed_model.total_cost.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-top">
                    <td>差額:</td>
                    <td className="text-end fw-bold text-danger">
                      +¥{(mockBOMData.proposed_model.total_cost - mockBOMData.base_model.total_cost).toLocaleString()}
                      {" "}
                      (+{((mockBOMData.proposed_model.total_cost / mockBOMData.base_model.total_cost - 1) * 100).toFixed(1)}%)
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-light">
              <div className="card-body">
                <h6>変更サマリー</h6>
                <ul className="mb-0">
                  <li>
                    変更部品: <strong>4件</strong>
                  </li>
                  <li>
                    新規追加: <strong>1件</strong>（NFCモジュール）
                  </li>
                  <li>
                    削除部品: <strong>0件</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-between">
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
            次へ: QDリスク評価
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

export default SpecComparison;
