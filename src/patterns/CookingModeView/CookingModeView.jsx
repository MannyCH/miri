import React from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { Button } from '../../components/Button';
import { CookingStepCard } from '../../components/CookingStepCard';
import './CookingModeView.css';

const PEEK_OPACITIES = [1, 0.6, 0.3];

/**
 * CookingModeView — full-screen step-by-step cooking mode.
 * Shows a card stack with the active step at full opacity and up to two peek cards below it.
 * Navigation: Back / Next / Quit cooking.
 */
export const CookingModeView = ({
  title,
  steps = [],
  currentStepIndex = 0,
  onNext,
  onBack,
  onQuit,
}) => {
  const totalSteps = steps.length;
  const visibleSteps = steps.slice(currentStepIndex, currentStepIndex + 3);
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="cooking-mode-view">
      <div className="cooking-mode-view__content">
        <h1 className="text-h1-bold cooking-mode-view__title">{title}</h1>

        <div className="cooking-mode-view__card-stack">
          {visibleSteps.map((step, i) => {
            const stepNumber = currentStepIndex + i + 1;
            const isActive = i === 0;
            return (
              <div
                key={stepNumber}
                className="cooking-mode-view__card-group"
                style={{ opacity: PEEK_OPACITIES[i] }}
                aria-hidden={!isActive}
              >
                <p className="text-tiny-regular cooking-mode-view__step-counter">
                  Step {stepNumber} of {totalSteps}
                </p>
                <CookingStepCard
                  emoji={step.icon}
                  verb={step.verb}
                  items={step.items ?? []}
                  duration={step.duration}
                  style={{ pointerEvents: isActive ? undefined : 'none' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="cooking-mode-view__footer" role="navigation" aria-label="Step navigation">
        <div className="cooking-mode-view__nav-buttons">
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            showIcon
            onClick={onBack}
            disabled={isFirstStep}
            aria-label="Go to previous step"
          >
            Back
          </Button>
          <Button
            variant="secondary"
            iconRight={<ArrowRight size={16} />}
            showIcon
            onClick={onNext}
            aria-label="Go to next step"
          >
            Next
          </Button>
        </div>

        <Button
          variant="tertiary-delete"
          showIcon={false}
          onClick={onQuit}
        >
          Quit cooking
        </Button>
      </div>
    </div>
  );
};

CookingModeView.displayName = 'CookingModeView';
