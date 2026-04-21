import React, { useState, useEffect } from "react";
import { mockWorkflowSteps } from "./mockData";
import SpecUpload from "./SpecUpload";
import SimilarProjectList from "./SimilarProjectList";
import SpecComparison from "./SpecComparison";
import RiskDashboard from "./RiskDashboard";
import ReviewWorkflow from "./ReviewWorkflow";
import InteractiveWalkthrough from "./InteractiveWalkthrough";
import QuickStartGuide from "./QuickStartGuide";

const AISpecAssistantDashboard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewPhase, setReviewPhase] = useState("initial"); // Track review workflow phase
  const [showInteractiveWalkthrough, setShowInteractiveWalkthrough] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [interactiveStep, setInteractiveStep] = useState(1);

  // Show quick start guide on first visit
  useEffect(() => {
    const hasSeenWalkthrough = localStorage.getItem("ai_spec_assistant_walkthrough_seen");
    if (!hasSeenWalkthrough) {
      setShowQuickStart(true);
    }
  }, []);

  const handleReviewPhaseChange = (phase) => {
    setReviewPhase(phase);
    // Update current step based on review phase
    if (phase === "approved") {
      setCurrentStep(7);
    } else if (phase === "completed") {
      setCurrentStep(8);
    }
  };

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
      case 7:
      case 8:
        return <ReviewWorkflow onPhaseChange={handleReviewPhaseChange} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  // Get workflow step status based on current progress
  const getStepStatus = (step) => {
    const stepNum = step.step;

    if (stepNum < currentStep) {
      return "completed";
    }

    if (stepNum === currentStep) {
      // Special handling for review workflow
      if (stepNum === 6) {
        if (reviewPhase === "initial" || reviewPhase === "submitted") {
          return "in_progress";
        }
        if (reviewPhase === "reviewing") {
          return "in_progress";
        }
        if (reviewPhase === "approved" || reviewPhase === "completed") {
          return "completed";
        }
      }
      return "in_progress";
    }

    if (stepNum === 7 && reviewPhase === "approved") {
      return "in_progress";
    }

    if (stepNum === 8 && reviewPhase === "completed") {
      return "completed";
    }

    return "pending";
  };

  const handleInteractiveWalkthroughClose = () => {
    setShowInteractiveWalkthrough(false);
    localStorage.setItem("ai_spec_assistant_walkthrough_seen", "true");
  };

  const handleInteractiveWalkthroughNext = () => {
    if (interactiveStep < 6) {
      setInteractiveStep(interactiveStep + 1);
      // Auto-advance the workflow step if needed
      if (interactiveStep === 1 && currentStep === 1) {
        // User will click sample data button
      } else if (interactiveStep === 2 && currentStep === 2) {
        // User will select a project
      }
    }
  };

  const handleInteractiveWalkthroughComplete = () => {
    setShowInteractiveWalkthrough(false);
    localStorage.setItem("ai_spec_assistant_walkthrough_seen", "true");
  };

  const handleQuickStartClose = () => {
    setShowQuickStart(false);
  };

  const handleStartWalkthrough = () => {
    setShowQuickStart(false);
    setInteractiveStep(1);
    setShowInteractiveWalkthrough(true);
  };

  return (
    <div className="container-fluid">
      {/* Quick Start Guide */}
      {showQuickStart && (
        <QuickStartGuide
          onClose={handleQuickStartClose}
          onStartWalkthrough={handleStartWalkthrough}
        />
      )}

      {/* Interactive Walkthrough */}
      {showInteractiveWalkthrough && (
        <InteractiveWalkthrough
          currentStep={interactiveStep}
          workflowStep={currentStep}
          onClose={handleInteractiveWalkthroughClose}
          onNext={handleInteractiveWalkthroughNext}
          onComplete={handleInteractiveWalkthroughComplete}
        />
      )}

      {/* Header */}
      <div className="row mt-4 mb-3">
        <div className="col">
          <div className="d-flex justify-content-between align-items-start">
            <div>
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
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowInteractiveWalkthrough(true);
                setInteractiveStep(currentStep);
              }}
            >
              <img
                src="../../static/icons/help-circle.svg"
                alt="Help"
                width="20"
                className="me-2"
              />
              使い方ガイド
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
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
                          ) : status === "in_progress" ? (
                            step.step
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

      {/* Main Content */}
      <div className="row">
        <div className="col">{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default AISpecAssistantDashboard;
