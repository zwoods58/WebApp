import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { setProgressState } from '../utils/accessibility';

/**
 * Onboarding Progress Indicator
 * Shows progress through onboarding steps
 */
export default function OnboardingProgress({ currentStep, totalSteps, steps = [] }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const progressId = 'onboarding-progress';

  // Set ARIA attributes for accessibility
  if (typeof window !== 'undefined') {
    const progressElement = document.getElementById(progressId);
    if (progressElement) {
      setProgressState(progressElement, currentStep, totalSteps, `Onboarding progress: ${percentage}%`);
    }
  }

  return (
    <div className="onboarding-progress">
      <div className="onboarding-progress-header">
        <span className="onboarding-progress-text">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="onboarding-progress-percentage">{percentage}%</span>
      </div>
      
      <div
        id={progressId}
        className="onboarding-progress-bar"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={`Onboarding progress: ${percentage}%`}
      >
        <div
          className="onboarding-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {steps.length > 0 && (
        <div className="onboarding-progress-steps">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={stepNumber}
                className={`onboarding-progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                {isCompleted ? (
                  <CheckCircle size={20} className="text-success" />
                ) : (
                  <div className="onboarding-progress-step-number">{stepNumber}</div>
                )}
                <span className="onboarding-progress-step-label">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

