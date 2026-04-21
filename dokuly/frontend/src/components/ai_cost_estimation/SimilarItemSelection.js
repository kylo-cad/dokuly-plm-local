import React, { useState } from "react";
import { mockSimilarItems } from "./mockData";

const SimilarItemSelection = ({ project, onComplete }) => {
  const [similarItems] = useState(mockSimilarItems);
  const [selectedItems, setSelectedItems] = useState(
    similarItems.filter((item) => item.is_selected_for_comparison).map((item) => item.id)
  );

  const toggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const getSimilarityBadge = (score) => {
    if (score >= 0.9) return "success";
    if (score >= 0.8) return "primary";
    if (score >= 0.7) return "warning";
    return "secondary";
  };

  const formatDifference = (diff, percent) => {
    if (diff === 0) return "同一";
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff}mm (${sign}${(percent * 100).toFixed(1)}%)`;
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ2: 類似品目の選択
        </h4>

        <div className="alert alert-info mb-4">
          <div className="d-flex align-items-start">
            <img
              src="../../static/icons/info.svg"
              alt="Info"
              width="20"
              className="me-2 mt-1"
            />
            <div>
              <strong>AIが{similarItems.length}件の類似品目を検出しました</strong>
              <br />
              <small>
                形状類似度、材質・表面処理、寸法、工法を総合的に評価してランキング。
                比較対象として使用する品目をチェックしてください（複数選択可）
              </small>
            </div>
          </div>
        </div>

        {/* Search Parameters */}
        <div className="card mb-4 bg-light">
          <div className="card-body">
            <h6 className="mb-3">検索パラメータ</h6>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label small text-muted">形状類似度の重み</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  disabled
                />
                <small className="text-muted">70%</small>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">メタデータ一致の重み</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  defaultValue="20"
                  disabled
                />
                <small className="text-muted">20%</small>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">工法類似度の重み</label>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  defaultValue="10"
                  disabled
                />
                <small className="text-muted">10%</small>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">寸法許容範囲</label>
                <select className="form-select form-select-sm" disabled>
                  <option>±30%</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items List */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                  <input type="checkbox" className="form-check-input" disabled />
                </th>
                <th style={{ width: "5%" }}>順位</th>
                <th style={{ width: "15%" }}>品番</th>
                <th style={{ width: "15%" }}>品名</th>
                <th style={{ width: "10%" }}>類似度</th>
                <th style={{ width: "10%" }}>最新単価</th>
                <th style={{ width: "15%" }}>サプライヤ</th>
                <th style={{ width: "25%" }}>主な差分</th>
              </tr>
            </thead>
            <tbody>
              {similarItems.map((item) => (
                <tr
                  key={item.id}
                  className={selectedItems.includes(item.id) ? "table-active" : ""}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSelection(item.id)}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                    />
                  </td>
                  <td>
                    <span className="badge bg-light text-dark">{item.rank}</span>
                  </td>
                  <td className="fw-bold text-primary">{item.item_number}</td>
                  <td>{item.item_name}</td>
                  <td>
                    <span className={`badge bg-${getSimilarityBadge(item.total_similarity_score)}`}>
                      {(item.total_similarity_score * 100).toFixed(0)}%
                    </span>
                    <div className="small text-muted mt-1">
                      形状:{(item.shape_similarity_score * 100).toFixed(0)}%
                      / 諸元:{(item.metadata_similarity_score * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td>
                    <strong>¥{item.latest_unit_price.toLocaleString()}</strong>
                    <div className="small text-muted">{item.quotation_date}</div>
                  </td>
                  <td><small>{item.supplier_name}</small></td>
                  <td>
                    <small>
                      {item.differences.feature_diffs.slice(0, 2).map((diff, idx) => (
                        <div key={idx} className="text-muted">• {diff}</div>
                      ))}
                      {item.differences.feature_diffs.length > 2 && (
                        <div className="text-muted">
                          他{item.differences.feature_diffs.length - 2}件...
                        </div>
                      )}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Items Detail */}
        {selectedItems.length > 0 && (
          <div className="mt-4">
            <h6 className="mb-3">選択した比較対象（{selectedItems.length}件）</h6>
            <div className="row">
              {similarItems
                .filter((item) => selectedItems.includes(item.id))
                .map((item) => (
                  <div key={item.id} className="col-md-6 mb-3">
                    <div className="card border-primary">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-0">{item.item_name}</h6>
                            <small className="text-muted">{item.item_number}</small>
                          </div>
                          <span className={`badge bg-${getSimilarityBadge(item.total_similarity_score)}`}>
                            類似度 {(item.total_similarity_score * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="row mb-2">
                          <div className="col-6">
                            <small className="text-muted">最新単価</small>
                            <div className="fw-bold">
                              ¥{item.latest_unit_price.toLocaleString()}
                            </div>
                          </div>
                          <div className="col-6">
                            <small className="text-muted">推定コスト影響</small>
                            <div
                              className={
                                item.estimated_cost_impact > 0
                                  ? "text-danger fw-bold"
                                  : "text-success fw-bold"
                              }
                            >
                              {item.estimated_cost_impact > 0 ? "+" : ""}
                              ¥{item.estimated_cost_impact}
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <small className="text-muted d-block">主な差分</small>
                          {item.differences.feature_diffs.map((diff, idx) => (
                            <small key={idx} className="d-block">• {diff}</small>
                          ))}
                        </div>

                        <div className="p-2 bg-light rounded">
                          <small className="text-muted d-block">AI推論</small>
                          <small>{item.cost_impact_reasoning}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 d-flex justify-content-between">
          <button className="btn btn-outline-secondary">
            <img
              src="../../static/icons/plus.svg"
              alt="Add"
              width="16"
              className="me-2"
            />
            手動で品目を追加
          </button>
          <button
            className="btn btn-success"
            onClick={onComplete}
            disabled={selectedItems.length === 0}
          >
            次へ: 原価妥当性を査定（{selectedItems.length}件選択中）
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

export default SimilarItemSelection;
