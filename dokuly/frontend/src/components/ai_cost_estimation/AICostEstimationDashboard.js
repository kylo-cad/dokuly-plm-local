import React, { useState } from "react";
import { mockWorkflowSteps } from "./mockData";
import ProjectList from "./ProjectList";
import ProjectSetup from "./ProjectSetup";
import SimilarItemSelection from "./SimilarItemSelection";
import CostAssessment from "./CostAssessment";
import ImprovementProposal from "./ImprovementProposal";
import ApprovalDocument from "./ApprovalDocument";

const AICostEstimationDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectList
            onSelectProject={(project) => {
              setSelectedProject(project);
              setCurrentStep(1);
            }}
            onCreateNew={() => setCurrentStep(1)}
          />
        );
      case 1:
        return (
          <ProjectSetup
            project={selectedProject}
            onComplete={() => setCurrentStep(2)}
          />
        );
      case 2:
        return (
          <SimilarItemSelection
            project={selectedProject}
            onComplete={() => setCurrentStep(3)}
          />
        );
      case 3:
        return (
          <CostAssessment
            project={selectedProject}
            onComplete={() => setCurrentStep(4)}
          />
        );
      case 4:
        return (
          <ImprovementProposal
            project={selectedProject}
            onComplete={() => setCurrentStep(5)}
          />
        );
      case 5:
        return (
          <ApprovalDocument
            project={selectedProject}
            onComplete={() => setCurrentStep(0)}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  const getStepStatus = (step) => {
    const stepNum = step.step;

    if (currentStep === 0) {
      return "pending"; // プロジェクト一覧画面
    }

    if (stepNum < currentStep) {
      return "completed";
    }

    if (stepNum === currentStep) {
      return "in_progress";
    }

    return "pending";
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row mt-4 mb-3">
        <div className="col">
          <h2>
            <img
              src="../../static/icons/dollar-sign.svg"
              alt="Cost"
              width="32"
              className="dokuly-filter-primary me-2"
            />
            AI原価査定
          </h2>
          <p className="text-muted">
            類似品比較とAI推論による妥当原価の算出で、最適な調達判断を支援します
          </p>
        </div>
      </div>

      {/* Workflow Progress - Only show when project is selected */}
      {currentStep > 0 && (
        <div className="row mb-4">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">ワークフロー進捗</h5>
                <div className="d-flex justify-content-between align-items-center">
                  {mockWorkflowSteps.map((step, index) => {
                    const status = getStepStatus(step);
                    return (
                      <React.Fragment key={step.step}>
                        <div
                          className="text-center"
                          style={{ flex: 1, cursor: "pointer" }}
                          onClick={() => {
                            if (status === "completed" && step.step <= currentStep) {
                              setCurrentStep(step.step);
                            }
                          }}
                        >
                          <div
                            className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 ${
                              status === "completed"
                                ? "bg-success text-white"
                                : status === "in_progress"
                                ? "bg-primary text-white"
                                : "bg-secondary text-white"
                            }`}
                            style={{ width: 40, height: 40 }}
                          >
                            {status === "completed" ? (
                              "✓"
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
                          </div>
                        </div>
                        {index < mockWorkflowSteps.length - 1 && (
                          <div
                            style={{
                              flex: 0.5,
                              height: 2,
                              backgroundColor:
                                status === "completed" ? "#28a745" : "#dee2e6",
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        <div className="col">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default AICostEstimationDashboard;
