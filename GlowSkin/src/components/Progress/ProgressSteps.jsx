import { Check } from "lucide-react";
import "./ProgressSteps.css";

export default function ProgressSteps({ currentStep }) {
  const steps = [
    { id: 1, label: "Upload Photo" },
    { id: 2, label: "Analysis" },
  ];

  return (
    <div className="progress-steps">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="progress-step-group">
            <div className={`progress-step ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}>
              <div className="step-circle">
                {isCompleted ? <Check size={20} /> : <span>{step.id}</span>}
              </div>
              <span className="step-label">{step.label}</span>
            </div>

            {index < steps.length - 1 && (
              <div className={`progress-line ${isCompleted ? "active" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}