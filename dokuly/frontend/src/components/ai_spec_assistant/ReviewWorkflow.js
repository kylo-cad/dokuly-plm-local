import React, { useState } from "react";
import { mockReviewComments } from "./mockData";

const ReviewWorkflow = () => {
  const [userComment, setUserComment] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = () => {
    if (reviewerEmail && userComment) {
      setSubmitted(true);
      // Simulate sending email
      setTimeout(() => {
        alert(`レビュー申請を ${reviewerEmail} に送信しました`);
      }, 500);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ6: レビュー申請
        </h4>

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
            disabled={submitted}
          />

          {/* Example Comments */}
          {!submitted && (
            <div className="alert alert-light">
              <small><strong>記載例:</strong></small>
              <ul className="mb-0" style={{ fontSize: "0.85rem" }}>
                <li>バッテリー容量増加に伴う発熱対策として、熱シミュレーションを実施済み。放熱フィンを追加する設計とする。</li>
                <li>NFC追加による電磁干渉リスクについて、アンテナ配置を最適化。EMC試験を実施予定（XX月XX日）。</li>
                <li>ケース設計変更に伴う防水試験を実施予定。Oリング仕様を見直し、IP68を維持する。</li>
              </ul>
            </div>
          )}
        </div>

        {/* Reviewer Selection */}
        {!submitted && (
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
                />
              </div>
            </div>
          </div>
        )}

        {/* Existing Comments */}
        {submitted && mockReviewComments.length > 0 && (
          <div className="mb-4">
            <h5 className="mb-3">
              レビューコメント
              <span className="badge bg-warning ms-2">
                {mockReviewComments.filter(c => c.status === "open").length} 未対応
              </span>
            </h5>
            {mockReviewComments.map((comment) => (
              <div key={comment.id} className="card mb-2">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong>{comment.author}</strong>
                      <small className="text-muted ms-2">{comment.date}</small>
                    </div>
                    <span className={`badge bg-${comment.status === "open" ? "warning" : "success"}`}>
                      {comment.status === "open" ? "未対応" : "対応済み"}
                    </span>
                  </div>
                  <p className="mb-0">{comment.comment}</p>
                  {comment.status === "open" && (
                    <div className="mt-2">
                      <button className="btn btn-sm btn-outline-primary">返信</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submission Status */}
        {submitted && (
          <div className="alert alert-success mb-4">
            <h5 className="alert-heading">✓ レビュー申請完了</h5>
            <p className="mb-0">
              レビュアーにメールを送信しました。承認またはコメントがあり次第、通知されます。
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="d-flex justify-content-between">
          <button className="btn btn-outline-secondary" disabled={submitted}>
            <img
              src="../../static/icons/arrow-left.svg"
              alt="back"
              width="16"
              className="me-2"
            />
            戻る
          </button>
          {!submitted ? (
            <button
              className="btn btn-primary"
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
          ) : (
            <div>
              <button className="btn btn-outline-primary me-2">
                PDFでエクスポート
              </button>
              <button className="btn btn-success">
                完了してダッシュボードへ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewWorkflow;
