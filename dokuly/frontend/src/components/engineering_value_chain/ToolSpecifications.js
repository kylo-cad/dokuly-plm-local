import React from "react";

const ToolSpecifications = ({ tool }) => {
  if (!tool) return null;

  return (
    <div className="row mb-4">
      {/* Required Inputs */}
      <div className="col-md-4">
        <div className="card h-100">
          <div className="card-body">
            <h6 className="card-title">
              <img
                src="../../static/icons/download.svg"
                alt="input"
                width="18"
                className="me-2 dokuly-filter-primary"
              />
              必要なデータ・情報
            </h6>

            <div className="mb-3">
              <small className="text-muted d-block mb-2">
                <strong>成果物:</strong>
              </small>
              {tool.required_artifacts && tool.required_artifacts.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {tool.required_artifacts.map((artifact, idx) => (
                    <li key={idx} className="mb-2">
                      <div className="d-flex align-items-center">
                        {artifact.required ? (
                          <span className="badge bg-danger me-2" style={{ fontSize: "10px" }}>
                            必須
                          </span>
                        ) : (
                          <span className="badge bg-secondary me-2" style={{ fontSize: "10px" }}>
                            任意
                          </span>
                        )}
                        <span style={{ fontSize: "13px" }}>{artifact.name}</span>
                      </div>
                      <small className="text-muted ms-4">({artifact.type})</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <small className="text-muted">なし</small>
              )}
            </div>

            <div>
              <small className="text-muted d-block mb-2">
                <strong>入力パラメータ:</strong>
              </small>
              {tool.required_inputs && tool.required_inputs.length > 0 ? (
                <ul className="list-unstyled mb-0">
                  {tool.required_inputs.map((input, idx) => (
                    <li key={idx} className="mb-2">
                      <div className="d-flex align-items-center">
                        {input.required ? (
                          <span className="badge bg-danger me-2" style={{ fontSize: "10px" }}>
                            必須
                          </span>
                        ) : (
                          <span className="badge bg-secondary me-2" style={{ fontSize: "10px" }}>
                            任意
                          </span>
                        )}
                        <span style={{ fontSize: "13px" }}>{input.name}</span>
                      </div>
                      <small className="text-muted ms-4">
                        ({input.type}
                        {input.unit && `, ${input.unit}`})
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <small className="text-muted">なし</small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Output Artifacts */}
      <div className="col-md-4">
        <div className="card h-100 border-success">
          <div className="card-body">
            <h6 className="card-title">
              <img
                src="../../static/icons/upload.svg"
                alt="output"
                width="18"
                className="me-2 dokuly-filter-success"
              />
              生成される成果物
            </h6>

            {tool.output_artifacts && tool.output_artifacts.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {tool.output_artifacts.map((artifact, idx) => (
                  <li key={idx} className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <img
                        src="../../static/icons/file.svg"
                        alt="file"
                        width="14"
                        className="me-2"
                      />
                      <strong style={{ fontSize: "13px" }}>{artifact.name}</strong>
                    </div>
                    <small className="text-muted ms-4">
                      形式: {artifact.format} ({artifact.type})
                    </small>
                  </li>
                ))}
              </ul>
            ) : (
              <small className="text-muted">なし</small>
            )}
          </div>
        </div>
      </div>

      {/* Output KPIs */}
      <div className="col-md-4">
        <div className="card h-100 border-info">
          <div className="card-body">
            <h6 className="card-title">
              <img
                src="../../static/icons/bar-chart.svg"
                alt="kpi"
                width="18"
                className="me-2 dokuly-filter-info"
              />
              分析KPI
            </h6>

            {tool.output_kpis && tool.output_kpis.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {tool.output_kpis.map((kpi, idx) => (
                  <li key={idx} className="mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: "13px" }}>{kpi.name}</span>
                      <span className="badge bg-light text-dark" style={{ fontSize: "10px" }}>
                        {kpi.unit}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <small className="text-muted">なし</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolSpecifications;
