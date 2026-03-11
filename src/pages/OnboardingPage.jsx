import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { ChoiceTile } from '../components/ChoiceTile/ChoiceTile';
import { Stepper } from '../components/Stepper/Stepper';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import '../patterns/OnboardingView/OnboardingView.css';

const GOAL_OPTIONS = [
  { value: 'lose-weight', label: 'Lose weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain-muscle', label: 'Gain muscle' },
  { value: 'eat-healthier', label: 'Eat healthier' },
];

const EATING_OPTIONS = [
  { value: 'no-preference', label: 'No preference' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'plant-forward', label: 'Plant-forward' },
  { value: 'high-protein', label: 'High protein' },
  { value: 'intermittent-fasting', label: 'Intermittent fasting' },
];

const TOTAL_STEPS = 3;

function ProgressDots({ step }) {
  return (
    <div
      className="onboarding-progress"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-label={`Step ${step} of ${TOTAL_STEPS}`}
    >
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`onboarding-progress-dot${i < step ? ' onboarding-progress-dot-active' : ''}`}
        />
      ))}
    </div>
  );
}

export function OnboardingPage() {
  const navigate = useNavigate();
  const { updatePreferences } = usePreferences();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [eatingStyle, setEatingStyle] = useState('');
  const [servings, setServings] = useState(2);

  function markOnboardingDone() {
    if (user?.id) {
      localStorage.setItem(`miri_onboarding_${user.id}`, '1');
    }
  }

  function handleSkip() {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      markOnboardingDone();
      navigate('/planning', { replace: true });
    }
  }

  function handleContinue() {
    if (step === 1) {
      if (goal) updatePreferences({ goal });
      setStep(2);
    } else if (step === 2) {
      if (eatingStyle) updatePreferences({ eatingStyle });
      setStep(3);
    } else {
      updatePreferences({ servings });
      markOnboardingDone();
      navigate('/planning', { replace: true });
    }
  }

  return (
    <div className="onboarding-view">
      <ProgressDots step={step} />

      <div className="onboarding-content">
        {step === 1 && (
          <>
            <h1 className="onboarding-heading text-h2-bold">What&apos;s your goal?</h1>
            <div className="onboarding-choices" role="group" aria-label="Select your goal">
              {GOAL_OPTIONS.map((o) => (
                <ChoiceTile
                  key={o.value}
                  label={o.label}
                  value={o.value}
                  selected={goal === o.value}
                  onClick={setGoal}
                />
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="onboarding-heading text-h2-bold">How do you like to eat?</h1>
            <div className="onboarding-choices" role="group" aria-label="Select your eating style">
              {EATING_OPTIONS.map((o) => (
                <ChoiceTile
                  key={o.value}
                  label={o.label}
                  value={o.value}
                  selected={eatingStyle === o.value}
                  onClick={setEatingStyle}
                />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h1 className="onboarding-heading text-h2-bold">How many people are you cooking for?</h1>
              <p className="onboarding-subtitle text-body-regular" style={{ marginTop: 'var(--spacing-8)' }}>
                We&apos;ll scale recipe quantities for you.
              </p>
            </div>
            <div className="onboarding-stepper-wrap">
              <Stepper value={servings} min={1} max={10} onChange={setServings} />
            </div>
          </>
        )}
      </div>

      <div className="onboarding-actions">
        <Button
          variant="primary"
          showIcon={false}
          onClick={handleContinue}
          disabled={step === 1 && !goal || step === 2 && !eatingStyle}
        >
          {step === TOTAL_STEPS ? 'Done' : 'Continue'}
        </Button>
        <Button variant="tertiary" showIcon={false} onClick={handleSkip}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}
