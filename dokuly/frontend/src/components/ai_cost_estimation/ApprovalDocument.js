import React, { useState } from "react";
import {
  mockApprovalDocument,
  mockReviewComments,
  mockImprovementScenarios,
} from "./mockData";

const ApprovalDocument = ({ project, onComplete }) => {
  const [approvalDoc] = useState(mockApprovalDocument);
  const [reviewComments] = useState(mockReviewComments);
  const [selectedScenario] = useState(
    mockImprovementScenarios.find((s) => s.id === approvalDoc.selected_scenario_id)
  );

  const getJudgmentBadge = (judgment) => {
    const colorMap = {
      approved: "success",
      conditional: "warning",
      revision_required: "danger",
      rejected: "dark",
    };
    const labelMap = {
      approved: "承認",
      conditional: "条件付承認",
      revision_required: "要修正",
      rejected: "否認",
    };
    return (
      <span className={`badge bg-${colorMap[judgment]}`}>
        {labelMap[judgment]}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ5: 稟議書作成とレビュー
        </h4>

        {/* Document Header */}
        <div className="card mb-4 bg-light">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <small className="text-muted">稟議書タイトル</small>
                  <div className="fw-bold">{approvalDoc.document_title}</div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">稟議番号</small>
                  <div>{approvalDoc.document_number}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">
                  <small className="text-muted">ステータス</small>
                  <div>
                    <span className="badge bg-secondary">
                      {approvalDoc.status === "draft" && "下書き"}
                      {approvalDoc.status === "submitted" && "提出済"}
                      {approvalDoc.status === "approved" && "承認済"}
                      {approvalDoc.status === "rejected" && "差し戻し"}
                    </span>
                  </div>
                </div>
                <div>
                  <small className="text-muted">作成日時</small>
                  <div>{approvalDoc.created_at}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <h5 className="mb-3">全体コメント</h5>
          <div className="card">
            <div className="card-body">
              <p style={{ whiteSpace: "pre-line" }}>{approvalDoc.overall_comment}</p>
            </div>
          </div>
        </div>

        {/* Selected Scenario */}
        {selectedScenario && (
          <div className="mb-4">
            <h5 className="mb-3">採用シナリオ</h5>
            <div className="card border-primary">
              <div className="card-body">
                <h6 className="text-primary">{selectedScenario.scenario_name}</h6>
                <p className="small mb-3">{selectedScenario.description}</p>
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center p-2 bg-light rounded">
                      <small className="text-muted">現状原価</small>
                      <div className="fw-bold">
                        ¥{selectedScenario.baseline_cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-2 bg-success text-white rounded">
                      <small>改善後原価</small>
                      <div className="fw-bold">
                        ¥{selectedScenario.simulated_cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-2 bg-primary text-white rounded">
                      <small>年間削減額</small>
                      <div className="fw-bold">
                        ¥{(selectedScenario.total_cost_reduction * 60000).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Process Comments */}
        <div className="mb-4">
          <h5 className="mb-3">工程別コメント</h5>
          <div className="card">
            <div className="card-body">
              {Object.entries(approvalDoc.process_comments).map(([key, comment]) => (
                <div key={key} className="mb-3 pb-3 border-bottom">
                  <div className="fw-bold text-primary mb-1">{key}</div>
                  <div className="small">{comment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Reasoning */}
        <div className="mb-4">
          <h5 className="mb-3">選定理由</h5>
          <div className="card">
            <div className="card-body">
              <p style={{ whiteSpace: "pre-line" }}>
                {approvalDoc.selection_reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Future Cost Reduction Plan */}
        <div className="mb-4">
          <h5 className="mb-3">今後のコストダウン施策</h5>
          <div className="card">
            <div className="card-body">
              <p style={{ whiteSpace: "pre-line" }}>
                {approvalDoc.future_cost_reduction_plan}
              </p>
            </div>
          </div>
        </div>

        {/* Review Comments */}
        <div className="mb-4">
          <h5 className="mb-3">
            レビューコメント
            <span className="badge bg-primary ms-2">{reviewComments.length}</span>
          </h5>
          {reviewComments.map((comment) => (
            <div key={comment.id} className="card mb-2">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong>{comment.reviewer}</strong>
                    <small className="text-muted ms-2">
                      {comment.comment_target}
                    </small>
                  </div>
                  <div>
                    {comment.judgment && getJudgmentBadge(comment.judgment)}
                    {comment.is_resolved && (
                      <span className="badge bg-success ms-2">対応済</span>
                    )}
                  </div>
                </div>
                <p className="mb-2 small">{comment.comment}</p>
                {comment.is_resolved && comment.resolution_note && (
                  <div className="p-2 bg-light rounded">
                    <small className="text-muted d-block fw-bold">対応内容:</small>
                    <small>{comment.resolution_note}</small>
                  </div>
                )}
                <small className="text-muted">{comment.created_at}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3">稟議書の操作</h6>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-outline-primary">
                <img
                  src="../../static/icons/edit.svg"
                  alt="Edit"
                  width="16"
                  className="me-2"
                />
                内容を編集
              </button>
              <button className="btn btn-outline-primary">
                <img
                  src="../../static/icons/download.svg"
                  alt="Download"
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
                レビュー依頼メール送信
              </button>
              <button className="btn btn-primary">
                <img
                  src="../../static/icons/check-circle.svg"
                  alt="Submit"
                  width="16"
                  className="me-2 dokuly-filter-white"
                />
                稟議を提出
              </button>
            </div>
          </div>
        </div>

        {/* Back to List */}
        <div className="mt-4 d-flex justify-content-between">
          <button className="btn btn-outline-secondary" onClick={onComplete}>
            <img
              src="../../static/icons/arrow-left.svg"
              alt="Back"
              width="16"
              className="me-2"
            />
            プロジェクト一覧に戻る
          </button>
          <button className="btn btn-success">
            <img
              src="../../static/icons/check.svg"
              alt="Complete"
              width="16"
              className="me-2 dokuly-filter-white"
            />
            完了
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDocument;
