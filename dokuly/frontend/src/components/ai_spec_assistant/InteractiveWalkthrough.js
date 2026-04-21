import React, { useState, useEffect, useRef } from "react";

const InteractiveWalkthrough = ({ currentStep, workflowStep, onClose, onNext, onComplete }) => {
  const [targetElement, setTargetElement] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const walkthroughSteps = {
    1: {
      title: "要求仕様書をアップロード",
      description: "まず、サンプルデータボタンをクリックして体験してみましょう",
      targetSelector: ".sample-data-button",
      position: "bottom",
      action: "click",
      workflowStep: 1,
    },
    2: {
      title: "類似案件を選択",
      description: "AIが検出した類似案件から、基準にするモデルを選んでください",
      targetSelector: "tbody tr:first-child",
      position: "right",
      action: "click",
      workflowStep: 2,
    },
    3: {
      title: "次へ進む",
      description: "選択した基準モデルで続行します",
      targetSelector: ".confirm-selection-button",
      position: "top",
      action: "click",
      workflowStep: 2,
    },
    4: {
      title: "仕様差分を確認",
      description: "新規案件と基準モデルの仕様差分とBOMを確認してください",
      targetSelector: ".spec-differences-table",
      position: "top",
      action: "view",
      workflowStep: 3,
    },
    5: {
      title: "リスク評価を確認",
      description: "AIが推論したQDリスクを確認し、対策を検討してください",
      targetSelector: ".risk-overview-cards",
      position: "bottom",
      action: "view",
      workflowStep: 5,
    },
    6: {
      title: "レビューを申請",
      description: "設計方針をコメントして、レビュー者に承認を依頼します",
      targetSelector: ".review-submit-button",
      position: "top",
      action: "click",
      workflowStep: 6,
    },
  };

  const currentStepConfig = walkthroughSteps[currentStep];

  // Auto-advance walkthrough if workflow has moved ahead
  useEffect(() => {
    if (currentStepConfig && workflowStep > currentStepConfig.workflowStep) {
      onNext();
    }
  }, [workflowStep, currentStepConfig, onNext]);

  useEffect(() => {
    if (!currentStepConfig) return;

    // Find the target element
    const findElement = () => {
      const element = document.querySelector(currentStepConfig.targetSelector);
      if (element) {
        setTargetElement(element);
        calculatePopupPosition(element);
      } else {
        // Retry after a short delay if element not found
        setTimeout(findElement, 500);
      }
    };

    findElement();
  }, [currentStep, currentStepConfig]);

  const calculatePopupPosition = (element) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const popupWidth = 320;
    const popupHeight = 200;
    const offset = 20;

    let top = 0;
    let left = 0;

    switch (currentStepConfig.position) {
      case "top":
        top = rect.top - popupHeight - offset;
        left = rect.left + rect.width / 2 - popupWidth / 2;
        break;
      case "bottom":
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - popupWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - popupHeight / 2;
        left = rect.left - popupWidth - offset;
        break;
      case "right":
        top = rect.top + rect.height / 2 - popupHeight / 2;
        left = rect.right + offset;
        break;
      default:
        top = rect.bottom + offset;
        left = rect.left;
    }

    // Keep popup within viewport
    if (left < 10) left = 10;
    if (left + popupWidth > window.innerWidth - 10) {
      left = window.innerWidth - popupWidth - 10;
    }
    if (top < 10) top = 10;
    if (top + popupHeight > window.innerHeight - 10) {
      top = rect.top - popupHeight - offset;
    }

    setPopupPosition({ top, left });
  };

  useEffect(() => {
    // Scroll target element into view
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Add click listener to auto-advance on action
      if (currentStepConfig.action === "click") {
        const handleClick = () => {
          // Small delay to let the UI update
          setTimeout(() => {
            onNext();
          }, 500);
        };

        targetElement.addEventListener("click", handleClick, { once: true });

        return () => {
          targetElement.removeEventListener("click", handleClick);
        };
      }
    }
  }, [targetElement, currentStepConfig, onNext]);

  // Don't show if workflow hasn't reached this step yet
  if (!currentStepConfig || workflowStep < currentStepConfig.workflowStep) {
    return null;
  }

  if (!targetElement) {
    return null;
  }

  const targetRect = targetElement.getBoundingClientRect();

  // Calculate pointer position based on element position
  const getPointerPosition = () => {
    const offset = 20;
    switch (currentStepConfig.position) {
      case "top":
        return {
          top: targetRect.bottom + offset,
          left: targetRect.left + targetRect.width / 2 - 20,
        };
      case "bottom":
        return {
          top: targetRect.top - 60,
          left: targetRect.left + targetRect.width / 2 - 20,
        };
      case "left":
        return {
          top: targetRect.top + targetRect.height / 2 - 20,
          left: targetRect.right + offset,
        };
      case "right":
        return {
          top: targetRect.top + targetRect.height / 2 - 20,
          left: targetRect.left - 60,
        };
      default:
        return {
          top: targetRect.top - 60,
          left: targetRect.left + targetRect.width / 2 - 20,
        };
    }
  };

  const pointerPosition = getPointerPosition();

  return (
    <>
      {/* Small pointer icon near the target */}
      <div
        style={{
          position: "fixed",
          top: pointerPosition.top,
          left: pointerPosition.left,
          zIndex: 10001,
          pointerEvents: "none",
          animation: "bounce 1s infinite",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            backgroundColor: currentStepConfig.action === "click" ? "#0d6efd" : "#28a745",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
            {currentStep}
          </span>
        </div>
      </div>

      {/* Compact bottom-right notification */}
      <div
        className="card shadow-lg"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 300,
          zIndex: 10000,
          pointerEvents: "auto",
        }}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="badge bg-primary">ステップ {currentStep} / 6</span>
            <button
              type="button"
              className="btn-close btn-close-sm"
              onClick={onClose}
              style={{ fontSize: "10px" }}
            />
          </div>

          <h6 className="mb-1" style={{ fontSize: "14px" }}>
            {currentStepConfig.title}
          </h6>
          <p className="small text-muted mb-2" style={{ fontSize: "12px" }}>
            {currentStepConfig.description}
          </p>

          {currentStepConfig.action === "click" && (
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "#0d6efd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>
                  {currentStep}
                </span>
              </div>
              <small style={{ fontSize: "11px" }}>
                青いアイコンの場所をクリック
              </small>
            </div>
          )}

          {currentStepConfig.action === "view" && (
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: "#28a745",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: "white", fontSize: "12px", fontWeight: "bold" }}>
                    {currentStep}
                  </span>
                </div>
                <small style={{ fontSize: "11px" }}>
                  緑のアイコンを確認
                </small>
              </div>
              <button
                className="btn btn-sm btn-primary"
                onClick={onNext}
                style={{ fontSize: "11px", padding: "2px 8px" }}
              >
                次へ
              </button>
            </div>
          )}

          {currentStep === 6 && (
            <button
              className="btn btn-sm btn-success w-100 mt-2"
              onClick={onComplete}
              style={{ fontSize: "11px" }}
            >
              ガイドを終了
            </button>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default InteractiveWalkthrough;
