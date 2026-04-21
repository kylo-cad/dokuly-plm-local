import React, { useState } from "react";
import { mockReviewComments, mockApprovalHistory, mockFinalSummary } from "./mockData";

const ReviewWorkflow = ({ onPhaseChange }) => {
  const [userComment, setUserComment] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [reviewPhase, setReviewPhase] = useState("initial"); // initial, submitted, reviewing, approved, completed
  const [selectedComment, setSelectedComment] = useState(null);
  const [replyText, setReplyText] = useState("");

  const updatePhase = (newPhase) => {
    setReviewPhase(newPhase);
    if (onPhaseChange) {
      onPhaseChange(newPhase);
    }
  };

  const handleSubmitReview = () => {
    if (reviewerEmail && userComment) {
      updatePhase("submitted");
      setTimeout(() => {
        alert(`レビュー申請を ${reviewerEmail} に送信しました`);
      }, 500);
    }
  };

  const handleMoveToReviewing = () => {
    updatePhase("reviewing");
  };

  const handleApprove = () => {
    updatePhase("approved");
  };

  const handleComplete = () => {
    updatePhase("completed");
  };

  const handleReplyToComment = (commentId) => {
    setSelectedComment(commentId);
  };

  const handleSubmitReply = (commentId) => {
    alert(`コメント #${commentId} に返信しました: ${replyText}`);
    setSelectedComment(null);
    setReplyText("");
  };

  // Initial submission phase
  if (reviewPhase === "initial") {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">
            ステップ6: レビュー申請
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
                <strong>このステップの目的:</strong> QDリスクとコストを確認し、設計方針をコメントしてレビュー者に承認を依頼します。
                <br />
                <strong>ポイント:</strong> レビュー者のフィードバックは次回以降のAI推論に反映され、組織のノウハウとして蓄積されます。
              </div>
            </div>
          </div>

          {/* Review Summary */}
          <div className="alert alert-primary mb-4">
            <h5 className="alert-heading">レビュー内容サマリー</h5>
            <ul className="mb-0">
              <li><strong>基準モデル:</strong> スマートウォッチ v1</li>
              <li><strong>変更部品:</strong> 4件（新規追加1件を含む）</li>
              <li><strong>推定コスト:</strong> ¥3,450（基準比 +¥650）</li>
              <li><strong>高リスク変化点:</strong> 2件（バッテリー容量、NFC追加）</li>
              <li><strong>納期リスク:</strong> NFC部品調達12週間</li>
            </ul>
          </div>

          {/* User Comments Section */}
          <div className="mb-4">
            <h5 className="mb-3">設計方針・コメント</h5>
            <textarea
              className="form-control mb-3"
              rows="6"
              placeholder="リスク評価結果を踏まえた設計方針、対策内容、新規設計箇所の方針などを記載してください..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />

            {/* Example Comments */}
            <div className="alert alert-light">
              <small><strong>記載例:</strong></small>
              <ul className="mb-0" style={{ fontSize: "0.85rem" }}>
                <li>バッテリー容量増加に伴う発熱対策として、熱シミュレーションを実施済み。放熱フィンを追加する設計とする。</li>
                <li>NFC追加による電磁干渉リスクについて、アンテナ配置を最適化。EMC試験を実施予定（XX月XX日）。</li>
                <li>ケース設計変更に伴う防水試験を実施予定。Oリング仕様を見直し、IP68を維持する。</li>
              </ul>
            </div>
          </div>

          {/* Reviewer Selection */}
          <div className="mb-4">
            <h5 className="mb-3">レビュアー指定</h5>
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">レビュアーのメールアドレス</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="reviewer@example.com"
                  value={reviewerEmail}
                  onChange={(e) => setReviewerEmail(e.target.value)}
                />
                <small className="text-muted">
                  複数の場合はカンマ区切りで入力
                </small>
              </div>
              <div className="col-md-6">
                <label className="form-label">レビュー期限</label>
                <input
                  type="date"
                  className="form-control"
                  defaultValue="2026-04-25"
                />
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
            <button
              className="btn btn-primary review-submit-button"
              onClick={handleSubmitReview}
              disabled={!reviewerEmail || !userComment}
            >
              レビュー申請を送信
              <img
                src="../../static/icons/send.svg"
                alt="send"
                width="16"
                className="ms-2 dokuly-filter-white"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // After submission - waiting for review
  if (reviewPhase === "submitted") {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">
            ステップ6: レビュー中
          </h4>

          {/* Submission Status */}
          <div className="alert alert-success mb-4">
            <h5 className="alert-heading">✓ レビュー申請完了</h5>
            <p className="mb-2">
              レビュアーにメールを送信しました。承認またはコメントがあり次第、通知されます。
            </p>
            <small className="text-muted">申請日時: 2026-04-20 17:30</small>
          </div>

          {/* Review Status */}
          <div className="mb-4">
            <h5 className="mb-3">レビュー状況</h5>
            <div className="card bg-light">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6 className="mb-0">レビュアー</h6>
                    <small className="text-muted">{reviewerEmail || "review-team@example.com"}</small>
                  </div>
                  <span className="badge bg-warning">レビュー待ち</span>
                </div>
                <div className="progress" style={{ height: 25 }}>
                  <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                       style={{ width: "33%" }}>
                    レビュー中...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Content Preview */}
          <div className="mb-4">
            <h5 className="mb-3">提出内容</h5>
            <div className="card">
              <div className="card-body">
                <h6>設計方針・コメント</h6>
                <p style={{ whiteSpace: "pre-wrap" }}>{userComment || "設計方針が記載されています。"}</p>

                <hr />

                <div className="row mt-3">
                  <div className="col-md-4">
                    <small className="text-muted">変更部品</small>
                    <div className="fs-5">4件</div>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">推定コスト増</small>
                    <div className="fs-5 text-danger">+¥650</div>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">高リスク変化点</small>
                    <div className="fs-5 text-warning">2件</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo: Simulate receiving comments */}
          <div className="alert alert-info">
            <strong>デモモード:</strong> レビューコメントを受信した状態を確認するには、下のボタンをクリックしてください。
            <div className="mt-2">
              <button className="btn btn-sm btn-primary" onClick={handleMoveToReviewing}>
                レビューコメントを受信 →
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary">
              申請を取り消し
            </button>
            <button className="btn btn-outline-primary">
              通知設定
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reviewing phase - comments received
  if (reviewPhase === "reviewing") {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">
            ステップ6: レビュー中（コメント対応）
          </h4>

          {/* Alert for new comments */}
          <div className="alert alert-warning mb-4">
            <h5 className="alert-heading">📬 レビューコメントが届きました</h5>
            <p className="mb-0">
              レビュアーからコメントが投稿されました。各コメントに対応してください。
            </p>
          </div>

          {/* Review Comments */}
          <div className="mb-4">
            <h5 className="mb-3">
              レビューコメント
              <span className="badge bg-warning ms-2">
                {mockReviewComments.filter(c => c.status !== "approved").length} 対応中
              </span>
            </h5>
            {mockReviewComments.map((comment) => (
              <div key={comment.id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{comment.author}</strong>
                      <small className="text-muted ms-2">{comment.date}</small>
                    </div>
                    <span className={`badge bg-${
                      comment.status === "approved" ? "success" :
                      comment.status === "resolved" ? "primary" : "warning"
                    }`}>
                      {comment.status === "approved" ? "承認済み" :
                       comment.status === "resolved" ? "対応済み" : "未対応"}
                    </span>
                  </div>
                  <p className="mb-2">{comment.comment}</p>

                  {/* Response if exists */}
                  {comment.response && (
                    <div className="alert alert-light mt-2">
                      <small><strong>対応内容:</strong></small>
                      <p className="mb-1">{comment.response}</p>
                      <small className="text-muted">{comment.response_date}</small>
                    </div>
                  )}

                  {/* Reply input */}
                  {selectedComment === comment.id ? (
                    <div className="mt-3">
                      <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="返信内容を入力..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleSubmitReply(comment.id)}
                        >
                          返信を送信
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSelectedComment(null)}
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    comment.status !== "resolved" && comment.status !== "approved" && (
                      <div className="mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleReplyToComment(comment.id)}
                        >
                          返信する
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Demo: Move to approval */}
          <div className="alert alert-info">
            <strong>デモモード:</strong> 全てのコメントに対応完了し、承認プロセスに進むには下のボタンをクリックしてください。
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={handleApprove}>
                承認プロセスへ進む →
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary">
              差し戻し
            </button>
            <button className="btn btn-primary">
              全て対応完了を通知
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Approval phase
  if (reviewPhase === "approved") {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">
            ステップ7: 承認待ち
          </h4>

          {/* Approval Progress */}
          <div className="alert alert-info mb-4">
            <h5 className="alert-heading">🔍 承認プロセス進行中</h5>
            <p className="mb-0">
              複数の承認者による承認プロセスが進行しています。
            </p>
          </div>

          {/* Approval Workflow */}
          <div className="mb-4">
            <h5 className="mb-3">承認フロー</h5>
            {mockApprovalHistory.map((approval, index) => (
              <div key={approval.id} className="d-flex align-items-start mb-3">
                <div className="me-3" style={{ minWidth: 40 }}>
                  {approval.status === "approved" ? (
                    <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                         style={{ width: 40, height: 40 }}>
                      ✓
                    </div>
                  ) : (
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                         style={{ width: 40, height: 40 }}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-0">{approval.reviewer}</h6>
                          <small className="text-muted">{approval.role}</small>
                        </div>
                        <span className={`badge bg-${
                          approval.status === "approved" ? "success" :
                          approval.status === "rejected" ? "danger" : "secondary"
                        }`}>
                          {approval.status === "approved" ? "承認済み" :
                           approval.status === "rejected" ? "差し戻し" : "承認待ち"}
                        </span>
                      </div>
                      {approval.comment && (
                        <p className="mb-1 mt-2">{approval.comment}</p>
                      )}
                      {approval.date && (
                        <small className="text-muted">{approval.date}</small>
                      )}
                      {approval.status === "pending" && index === mockApprovalHistory.findIndex(a => a.status === "pending") && (
                        <div className="mt-2">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <small className="text-muted">承認待ち...</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span>承認進捗</span>
              <span>
                {mockApprovalHistory.filter(a => a.status === "approved").length} / {mockApprovalHistory.length}
              </span>
            </div>
            <div className="progress" style={{ height: 25 }}>
              <div
                className="progress-bar bg-success"
                style={{
                  width: `${(mockApprovalHistory.filter(a => a.status === "approved").length / mockApprovalHistory.length) * 100}%`
                }}>
                {Math.round((mockApprovalHistory.filter(a => a.status === "approved").length / mockApprovalHistory.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Demo: Complete approval */}
          <div className="alert alert-success">
            <strong>デモモード:</strong> 全承認者の承認が完了した状態を確認するには下のボタンをクリックしてください。
            <div className="mt-2">
              <button className="btn btn-sm btn-success" onClick={handleComplete}>
                全承認完了 → 完了画面へ
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary">
              承認者に催促
            </button>
            <button className="btn btn-outline-primary">
              PDFでエクスポート
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed phase
  if (reviewPhase === "completed") {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-4">
            ステップ8: 完了
          </h4>

          {/* Success Message */}
          <div className="alert alert-success mb-4">
            <div className="d-flex align-items-center">
              <div className="me-3" style={{ fontSize: "3rem" }}>🎉</div>
              <div>
                <h4 className="alert-heading mb-2">承認完了！</h4>
                <p className="mb-0">
                  全ての承認者による承認が完了しました。設計を開始できます。
                </p>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="mb-4">
            <h5 className="mb-3">プロジェクトサマリー</h5>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">プロジェクト名:</td>
                          <td><strong>{mockFinalSummary.project_name}</strong></td>
                        </tr>
                        <tr>
                          <td className="text-muted">基準モデル:</td>
                          <td>{mockFinalSummary.base_model}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">作成日:</td>
                          <td>{mockFinalSummary.created_date}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">承認完了日:</td>
                          <td>{mockFinalSummary.approved_date}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-sm table-borderless">
                      <tbody>
                        <tr>
                          <td className="text-muted">設計レビュー予定:</td>
                          <td>{mockFinalSummary.timeline.design_review}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">試作予定:</td>
                          <td>{mockFinalSummary.timeline.prototype}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">量産開始予定:</td>
                          <td>{mockFinalSummary.timeline.mass_production}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-4">
            <h5 className="mb-3">主要指標</h5>
            <div className="row">
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">変更部品</h6>
                    <h2 className="text-primary">{mockFinalSummary.changes.changed_parts}</h2>
                    <small className="text-muted">/ {mockFinalSummary.changes.total_parts} 部品</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">コスト増</h6>
                    <h2 className="text-danger">+{mockFinalSummary.cost.percentage}%</h2>
                    <small className="text-muted">¥{mockFinalSummary.cost.difference.toLocaleString()}</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">高リスク</h6>
                    <h2 className="text-warning">{mockFinalSummary.risks.high}</h2>
                    <small className="text-muted">変化点</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h6 className="card-title text-muted">承認者</h6>
                    <h2 className="text-success">{mockFinalSummary.approvers.length}</h2>
                    <small className="text-muted">全員承認済み</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approvers List */}
          <div className="mb-4">
            <h5 className="mb-3">承認者</h5>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  {mockFinalSummary.approvers.map((approver, index) => (
                    <div key={index} className="col-md-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle bg-success text-white me-2"
                             style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          ✓
                        </div>
                        <div>
                          <strong>{approver.name}</strong>
                          <br />
                          <small className="text-muted">{approver.role}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-4">
            <h5 className="mb-3">次のアクション</h5>
            <div className="list-group">
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">詳細設計の開始</h6>
                  <small className="text-success">Ready</small>
                </div>
                <p className="mb-1">承認された設計方針に基づいて詳細設計を開始してください。</p>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">部品発注</h6>
                  <small className="text-warning">Pending</small>
                </div>
                <p className="mb-1">NFCモジュール等の新規部品を調達部門に依頼してください。</p>
              </div>
              <div className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1">試験計画作成</h6>
                  <small className="text-info">Scheduled</small>
                </div>
                <p className="mb-1">熱試験、EMC試験、防水試験の計画を作成してください。</p>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="mb-4">
            <h5 className="mb-3">エクスポート</h5>
            <div className="btn-group" role="group">
              <button className="btn btn-outline-primary">
                <img src="../../static/icons/file.svg" alt="pdf" width="16" className="me-2" />
                PDFレポート
              </button>
              <button className="btn btn-outline-primary">
                <img src="../../static/icons/file.svg" alt="excel" width="16" className="me-2" />
                Excelデータ
              </button>
              <button className="btn btn-outline-primary">
                <img src="../../static/icons/file.svg" alt="json" width="16" className="me-2" />
                JSON
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={() => updatePhase("initial")}>
              新しいプロジェクトを開始
            </button>
            <button className="btn btn-success">
              ダッシュボードへ戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ReviewWorkflow;
