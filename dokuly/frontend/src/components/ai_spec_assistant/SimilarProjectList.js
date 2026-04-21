import React, { useState } from "react";
import { mockProjects, mockSpecDifferences } from "./mockData";

const SimilarProjectList = ({ onSelectProject }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const availableFilters = [
    "材料",
    "モータータイプ",
    "防水性能",
    "Bluetooth",
    "CE認証"
  ];

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else if (selectedFilters.length < 5) {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const getSimilarityColor = (score) => {
    if (score >= 0.9) return "success";
    if (score >= 0.8) return "warning";
    return "danger";
  };

  const getDifferenceCount = (projectId) => {
    const diffs = mockSpecDifferences[`project_${projectId}`];
    return diffs ? Object.keys(diffs).length : 0;
  };

  const handleSelectProject = (project) => {
    setSelectedProjectId(project.id);
  };

  const handleConfirmSelection = () => {
    const project = mockProjects.find(p => p.id === selectedProjectId);
    onSelectProject(project);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ2: 仕様一覧から類似案件が絞り込まれる
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
              <strong>このステップの目的:</strong> 過去の類似案件を自動検索し、RFLPベースの設計意図の相同性を判定します。
              <br />
              <strong>ポイント:</strong> 完全一致させたい仕様を最大5項目選択することで、より精度の高い類似案件を発見できます。
            </div>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            完全一致させたい仕様を選択（最大5項目）
          </label>
          <div className="d-flex flex-wrap gap-2">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm ${
                  selectedFilters.includes(filter)
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filter}
                {selectedFilters.includes(filter) && " ✓"}
              </button>
            ))}
          </div>
          <small className="text-muted">
            選択中: {selectedFilters.length}/5 項目
          </small>
        </div>

        {/* Similar Projects Table */}
        <div className="mb-4">
          <h5 className="mb-3">
            類似案件一覧
            <span className="badge bg-secondary ms-2">{mockProjects.length}件</span>
          </h5>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}></th>
                  <th style={{ width: "30%" }}>プロジェクト名</th>
                  <th style={{ width: "15%" }}>類似度</th>
                  <th style={{ width: "15%" }}>仕様差分</th>
                  <th style={{ width: "15%" }}>推定コスト</th>
                  <th style={{ width: "15%" }}>作成日</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody>
                {mockProjects.map((project) => (
                  <tr
                    key={project.id}
                    className={selectedProjectId === project.id ? "table-active" : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelectProject(project)}
                  >
                    <td>
                      <input
                        type="radio"
                        name="selectedProject"
                        checked={selectedProjectId === project.id}
                        onChange={() => handleSelectProject(project)}
                      />
                    </td>
                    <td>
                      <strong>{project.name}</strong>
                      <br />
                      <small className="text-muted">
                        ID: {project.spec_requirement_id}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress me-2"
                          style={{ width: 80, height: 8 }}
                        >
                          <div
                            className={`progress-bar bg-${getSimilarityColor(
                              project.similarity_score
                            )}`}
                            style={{
                              width: `${project.similarity_score * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`badge bg-${getSimilarityColor(
                            project.similarity_score
                          )}`}
                        >
                          {(project.similarity_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {getDifferenceCount(project.id)} 項目
                      </span>
                    </td>
                    <td>
                      <strong>¥{project.estimated_cost.toLocaleString()}</strong>
                    </td>
                    <td>
                      <small>{project.created_at}</small>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`${project.name} の詳細を表示`);
                        }}
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Project Details */}
        {selectedProjectId && (
          <div className="alert alert-primary">
            <strong>選択中:</strong>{" "}
            {mockProjects.find((p) => p.id === selectedProjectId)?.name}
          </div>
        )}

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
          <button
            className="btn btn-success"
            disabled={!selectedProjectId}
            onClick={handleConfirmSelection}
          >
            次へ: 仕様差分を確認
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

export default SimilarProjectList;
