import React, { useState } from "react";
import { mockWorkflowSteps } from "./mockData";
import SpecUpload from "./SpecUpload";
import SimilarProjectList from "./SimilarProjectList";
import SpecComparison from "./SpecComparison";
import RiskDashboard from "./RiskDashboard";
import ReviewWorkflow from "./ReviewWorkflow";

const AISpecAssistantDashboard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SpecUpload onComplete={() => setCurrentStep(2)} />;
      case 2:
        return (
          <SimilarProjectList
            onSelectProject={(project) => {
              setSelectedProject(project);
              setCurrentStep(3);
            }}
          />
        );
      case 3:
        return (
          <SpecComparison
            selectedProject={selectedProject}
            onComplete={() => setCurrentStep(5)}
          />
        );
      case 5:
        return <RiskDashboard onComplete={() => setCurrentStep(6)} />;
      case 6:
        return <ReviewWorkflow />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mt-4 mb-3">
        <div className="col">
          <h2>
            <img
              src="../../static/icons/cpu.svg"
              alt="AI"
              width="32"
              className="dokuly-filter-primary me-2"
            />
            AI類似仕様アシスト
          </h2>
          <p className="text-muted">
            過去案件から最適な基準モデルを選定し、QDリスクとコストを予測します
          </p>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">ワークフロー進捗</h5>
              <div className="d-flex justify-content-between align-items-center">
                {mockWorkflowSteps.map((step, index) => (
                  <React.Fragment key={step.step}>
                    <div
                      className="text-center"
                      style={{ flex: 1, cursor: "pointer" }}
                      onClick={() => {
                        if (step.status === "completed") {
                          setCurrentStep(step.step);
                        }
                      }}
                    >
                      <div
                        className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                          step.status === "completed"
                            ? "bg-success text-white"
                            : step.status === "in_progress"
                            ? "bg-primary text-white"
                            : "bg-secondary text-white"
                        }`}
                        style={{ width: 40, height: 40 }}
                      >
                        {step.status === "completed" ? (
                          "✓"
                        ) : step.status === "in_progress" ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          step.step
                        )}
                      </div>
                      <div>
                        <small
                          className={
                            currentStep === step.step ? "fw-bold" : ""
                          }
                        >
                          {step.name}
                        </small>
                        {step.date && (
                          <div>
                            <small className="text-muted">{step.date}</small>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < mockWorkflowSteps.length - 1 && (
                      <div
                        style={{
                          flex: 0.5,
                          height: 2,
                          backgroundColor:
                            step.status === "completed" ? "#28a745" : "#dee2e6",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default AISpecAssistantDashboard;
