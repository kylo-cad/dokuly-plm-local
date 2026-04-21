import React, { useState } from "react";
import { mockProjects } from "./mockData";

const ProjectList = ({ onSelectProject, onCreateNew }) => {
  const [projects] = useState(mockProjects);
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: "起案中", color: "secondary" },
      analyzing: { label: "査定中", color: "primary" },
      quote_waiting: { label: "見積回収中", color: "warning" },
      reviewing: { label: "レビュー中", color: "info" },
      approved: { label: "承認済", color: "success" },
      completed: { label: "完了", color: "dark" },
    };

    const statusInfo = statusMap[status] || { label: status, color: "secondary" };
    return <span className={`badge bg-${statusInfo.color}`}>{statusInfo.label}</span>;
  };

  const getEstimationTypeLabel = (type) => {
    const typeMap = {
      rfq: "RFQ見積",
      cost_review: "コストレビュー",
      cost_planning: "原価企画",
      procurement: "調達査定",
      cost_reduction: "原価低減",
    };
    return typeMap[type] || type;
  };

  const filteredProjects = filterStatus === "all"
    ? projects
    : projects.filter((p) => p.status === filterStatus);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="card-title mb-0">原価査定プロジェクト一覧</h4>
          <button className="btn btn-primary" onClick={onCreateNew}>
            <img
              src="../../static/icons/plus.svg"
              alt="New"
              width="16"
              className="me-2 dokuly-filter-white"
            />
            新規プロジェクト作成
          </button>
        </div>

        {/* Filter */}
        <div className="mb-3">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("all")}
            >
              すべて ({projects.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === "draft" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("draft")}
            >
              起案中
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === "analyzing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("analyzing")}
            >
              査定中
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === "quote_waiting" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("quote_waiting")}
            >
              見積回収中
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filterStatus === "reviewing" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilterStatus("reviewing")}
            >
              レビュー中
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>プロジェクト番号</th>
                <th style={{ width: "25%" }}>タイトル</th>
                <th style={{ width: "10%" }}>タイプ</th>
                <th style={{ width: "10%" }}>ステータス</th>
                <th style={{ width: "10%" }}>回数</th>
                <th style={{ width: "10%" }}>担当者</th>
                <th style={{ width: "10%" }}>目標原価</th>
                <th style={{ width: "10%" }}>作成日</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectProject(project)}
                >
                  <td className="fw-bold text-primary">{project.project_number}</td>
                  <td>{project.title}</td>
                  <td>
                    <small className="text-muted">
                      {getEstimationTypeLabel(project.estimation_type)}
                    </small>
                  </td>
                  <td>{getStatusBadge(project.status)}</td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {project.quote_round}回目
                    </span>
                  </td>
                  <td><small>{project.assignee}</small></td>
                  <td>
                    <strong>¥{project.target_cost?.toLocaleString()}</strong>
                  </td>
                  <td><small className="text-muted">{project.created_at}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-5 text-muted">
            <img
              src="../../static/icons/inbox.svg"
              alt="Empty"
              width="48"
              className="dokuly-filter-secondary mb-3"
            />
            <p>該当するプロジェクトがありません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
