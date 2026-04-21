import React, { useState } from "react";
import { mockProjectItem, mockDrawing, mockQuotations } from "./mockData";

const ProjectSetup = ({ project, onComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [projectItem, setProjectItem] = useState(null);
  const [drawing, setDrawing] = useState(null);
  const [quotations, setQuotations] = useState(null);

  const handleUseSampleData = () => {
    setUploading(true);

    // Simulate AI processing
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      setProjectItem(mockProjectItem);
      setDrawing(mockDrawing);
      setQuotations(mockQuotations);
    }, 2000);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ1: 査定対象品目の情報入力
        </h4>

        {/* File Upload */}
        {!uploadComplete && (
          <div className="mb-4">
            <label className="form-label fw-bold">図面・見積書をアップロード</label>
            <div className="border border-2 border-dashed rounded p-4 text-center">
              <div className="mb-3">
                <img
                  src="../../static/icons/upload-cloud.svg"
                  alt="Upload"
                  width="48"
                  className="dokuly-filter-secondary mb-2"
                />
                <p className="text-muted mb-2">
                  図面ファイル（PDF, JPEG, 3D CAD）または見積書（PDF, Excel）をドラッグ＆ドロップ
                </p>
                <input
                  type="file"
                  className="form-control mb-3"
                  accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.step,.iges"
                  multiple
                />
              </div>
              <div className="d-flex gap-2 justify-content-center">
                <button
                  className="btn btn-primary"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      AI解析中...
                    </>
                  ) : (
                    "アップロードして解析"
                  )}
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={handleUseSampleData}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      AI解析中...
                    </>
                  ) : (
                    <>
                      <img
                        src="../../static/icons/file.svg"
                        alt="sample"
                        width="16"
                        className="me-2"
                      />
                      サンプルデータで体験
                    </>
                  )}
                </button>
              </div>
            </div>
            <small className="text-muted">
              対応形式: PDF, JPEG, Excel, 3D CAD (STEP, IGES) | 最大60MB
            </small>
          </div>
        )}

        {/* AI Processing Status */}
        {uploading && (
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <span className="spinner-border spinner-border-sm me-3" />
              <div>
                <strong>Gemini AIが図面・見積書を解析中...</strong>
                <br />
                <small>OCR処理、仕様抽出、工程推定を実行しています</small>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Information */}
        {uploadComplete && projectItem && (
          <div>
            <div className="alert alert-success mb-4">
              <strong>✓ 図面・見積書の解析が完了しました</strong>
              <br />
              <small>以下の内容を確認し、必要に応じて修正してください</small>
            </div>

            <div className="row">
              {/* Left: Item Information */}
              <div className="col-md-6">
                <h5 className="mb-3">品目情報</h5>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="mb-2">
                      <label className="form-label text-muted small">品番</label>
                      <input
                        type="text"
                        className="form-control"
                        value={projectItem.item_number}
                        readOnly
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label text-muted small">品名</label>
                      <input
                        type="text"
                        className="form-control"
                        value={projectItem.item_name}
                        readOnly
                      />
                    </div>
                    <div className="row mb-2">
                      <div className="col-6">
                        <label className="form-label text-muted small">材質</label>
                        <input
                          type="text"
                          className="form-control"
                          value={projectItem.material}
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted small">表面処理</label>
                        <input
                          type="text"
                          className="form-control"
                          value={projectItem.surface_treatment}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4">
                        <label className="form-label text-muted small">
                          寸法 X (mm)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={projectItem.max_dimension_x}
                          readOnly
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label text-muted small">
                          寸法 Y (mm)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={projectItem.max_dimension_y}
                          readOnly
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label text-muted small">
                          寸法 Z (mm)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={projectItem.max_dimension_z}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className="form-label text-muted small">重量 (kg)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={projectItem.weight}
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label text-muted small">数量</label>
                        <input
                          type="number"
                          className="form-control"
                          value={projectItem.quantity}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Analyzed Specs */}
                <h6 className="mb-2">AI解析仕様</h6>
                <div className="card mb-3">
                  <div className="card-body">
                    <table className="table table-sm table-borderless mb-0">
                      <tbody>
                        {Object.entries(projectItem.ai_analyzed_specs).map(
                          ([key, value]) => (
                            <tr key={key}>
                              <td className="text-muted" style={{ width: "50%" }}>
                                {key}
                              </td>
                              <td className="fw-bold">{value}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Estimated Processes */}
                <h6 className="mb-2">推定工程</h6>
                <div className="card">
                  <div className="card-body">
                    <ol className="mb-0">
                      {drawing.ai_analysis_result.estimated_processes.map(
                        (process, idx) => (
                          <li key={idx}>{process}</li>
                        )
                      )}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Right: Quotation Information */}
              <div className="col-md-6">
                <h5 className="mb-3">見積情報（{quotations.length}社）</h5>
                {quotations.map((quote) => (
                  <div key={quote.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{quote.supplier_name}</h6>
                          <small className="text-muted">
                            見積番号: {quote.quotation_number}
                          </small>
                        </div>
                        {quote.is_selected && (
                          <span className="badge bg-primary">選択中</span>
                        )}
                      </div>
                      <div className="row mb-2">
                        <div className="col-6">
                          <small className="text-muted">単価</small>
                          <div className="fw-bold text-primary">
                            ¥{quote.unit_price.toLocaleString()}
                          </div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">総額</small>
                          <div className="fw-bold">
                            ¥{quote.total_amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-6">
                          <small className="text-muted">数量</small>
                          <div>{quote.quoted_quantity.toLocaleString()}個</div>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">納期</small>
                          <div>{quote.lead_time_days}日</div>
                        </div>
                      </div>
                      {quote.supplier_comment && (
                        <div className="mt-2 p-2 bg-light rounded">
                          <small className="text-muted d-block">
                            サプライヤコメント:
                          </small>
                          <small>{quote.supplier_comment}</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 d-flex justify-content-between">
              <button className="btn btn-outline-secondary">
                <img
                  src="../../static/icons/edit.svg"
                  alt="Edit"
                  width="16"
                  className="me-2"
                />
                内容を手動編集
              </button>
              <button className="btn btn-success" onClick={onComplete}>
                次へ: 類似品目を検索
                <img
                  src="../../static/icons/arrow-right.svg"
                  alt="next"
                  width="16"
                  className="ms-2 dokuly-filter-white"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSetup;
