import React, { useState } from "react";
import { mockSpecifications } from "./mockData";

const SpecUpload = ({ onComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [extractedSpecs, setExtractedSpecs] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploadComplete(false);
    setExtractedSpecs(null);
  };

  const handleUpload = () => {
    setUploading(true);

    // Simulate AI processing
    setTimeout(() => {
      setUploading(false);
      setUploadComplete(true);
      setExtractedSpecs(mockSpecifications.current);
    }, 2000);
  };

  const handleConfirm = () => {
    onComplete();
  };

  const renderSpecValue = (spec) => {
    const confidenceColor =
      spec.confidence > 0.9 ? "success" :
      spec.confidence > 0.8 ? "warning" : "danger";

    return (
      <div className="d-flex align-items-center">
        <span className="me-2">{spec.value}</span>
        <span className={`badge bg-${confidenceColor} badge-sm`}>
          確信度: {(spec.confidence * 100).toFixed(0)}%
        </span>
        <small className="text-muted ms-2">p.{spec.page}</small>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title mb-4">
          ステップ1: 新規案件の要求仕様と図面を入力
        </h4>

        {/* File Upload */}
        {!uploadComplete && (
          <div className="mb-4">
            <label className="form-label fw-bold">要求仕様書をアップロード</label>
            <div className="border border-2 border-dashed rounded p-4 text-center">
              <input
                type="file"
                className="form-control mb-3"
                accept=".pdf,.tiff,.png"
                onChange={handleFileChange}
              />
              {file && (
                <div className="alert alert-info">
                  <strong>選択ファイル:</strong> {file.name}
                  <br />
                  <small>サイズ: {(file.size / 1024 / 1024).toFixed(2)} MB</small>
                </div>
              )}
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!file || uploading}
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
            </div>
            <small className="text-muted">
              対応形式: PDF, TIFF, PNG (最大30MB)
            </small>
          </div>
        )}

        {/* AI Processing Status */}
        {uploading && (
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <span className="spinner-border spinner-border-sm me-3" />
              <div>
                <strong>Gemini AIが仕様書を解析中...</strong>
                <br />
                <small>OCR処理、構造化、RFLP抽出を実行しています</small>
              </div>
            </div>
          </div>
        )}

        {/* Extracted Specifications */}
        {uploadComplete && extractedSpecs && (
          <div>
            <div className="alert alert-success mb-4">
              <strong>✓ 仕様書の解析が完了しました</strong>
              <br />
              <small>以下の内容を確認し、必要に応じて修正してください</small>
            </div>

            <div className="row">
              {/* Left: Extracted Specs */}
              <div className="col-md-8">
                <h5 className="mb-3">抽出された仕様一覧</h5>

                {Object.entries(extractedSpecs).map(([category, specs]) => (
                  <div key={category} className="mb-4">
                    <h6 className="text-primary">{category}</h6>
                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th style={{ width: "30%" }}>項目</th>
                          <th>値</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(specs).map(([key, spec]) => (
                          <tr key={key}>
                            <td className="fw-bold">{key}</td>
                            <td>{renderSpecValue(spec)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Right: Document Preview */}
              <div className="col-md-4">
                <h5 className="mb-3">仕様書プレビュー</h5>
                <div className="border rounded p-3 bg-light text-center">
                  <img
                    src="../../static/icons/file.svg"
                    alt="document"
                    width="64"
                    className="dokuly-filter-secondary mb-2"
                  />
                  <p className="mb-1"><strong>{file?.name}</strong></p>
                  <small className="text-muted">
                    ページ数: 12 | サイズ: {(file?.size / 1024 / 1024).toFixed(2)} MB
                  </small>
                  <div className="mt-3">
                    <button className="btn btn-sm btn-outline-primary">
                      PDFを開く
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 d-flex justify-content-between">
              <button className="btn btn-outline-secondary">
                仕様を手動編集
              </button>
              <button className="btn btn-success" onClick={handleConfirm}>
                次へ: 類似案件を検索
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

export default SpecUpload;
