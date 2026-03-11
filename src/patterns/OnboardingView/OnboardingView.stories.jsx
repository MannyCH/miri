import React, { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { ChoiceTile } from '../../components/ChoiceTile/ChoiceTile';
import { Stepper } from '../../components/Stepper/Stepper';
import './OnboardingView.css';

export default {
  title: 'Patterns/Onboarding',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Onboarding flow shown to new users after sign-up.
Three steps: goal → eating style → servings.
One question per screen, large tap-target tiles, progress dots.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

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
    <div className="onboarding-progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={`onboarding-progress-dot${i < step ? ' onboarding-progress-dot-active' : ''}`} />
      ))}
    </div>
  );
}

export const StepGoal = {
  render: () => {
    const [selected, setSelected] = useState('');
    return (
      <div className="onboarding-view">
        <ProgressDots step={1} />
        <div className="onboarding-content">
          <div>
            <h1 className="onboarding-heading text-h2-bold">What&apos;s your goal?</h1>
          </div>
          <div className="onboarding-choices" role="group" aria-label="Select your goal">
            {GOAL_OPTIONS.map((o) => (
              <ChoiceTile key={o.value} label={o.label} value={o.value} selected={selected === o.value} onClick={setSelected} />
            ))}
          </div>
        </div>
        <div className="onboarding-actions">
          <Button variant="primary" showIcon={false} disabled={!selected}>Continue</Button>
          <Button variant="tertiary" showIcon={false}>Skip for now</Button>
        </div>
      </div>
    );
  },
};

export const StepEatingStyle = {
  render: () => {
    const [selected, setSelected] = useState('');
    return (
      <div className="onboarding-view">
        <ProgressDots step={2} />
        <div className="onboarding-content">
          <div>
            <h1 className="onboarding-heading text-h2-bold">How do you like to eat?</h1>
          </div>
          <div className="onboarding-choices" role="group" aria-label="Select your eating style">
            {EATING_OPTIONS.map((o) => (
              <ChoiceTile key={o.value} label={o.label} value={o.value} selected={selected === o.value} onClick={setSelected} />
            ))}
          </div>
        </div>
        <div className="onboarding-actions">
          <Button variant="primary" showIcon={false} disabled={!selected}>Continue</Button>
          <Button variant="tertiary" showIcon={false}>Skip for now</Button>
        </div>
      </div>
    );
  },
};

export const StepServings = {
  render: () => {
    const [servings, setServings] = useState(2);
    return (
      <div className="onboarding-view">
        <ProgressDots step={3} />
        <div className="onboarding-content">
          <div>
            <h1 className="onboarding-heading text-h2-bold">How many people are you cooking for?</h1>
            <p className="onboarding-subtitle text-body-regular" style={{ marginTop: 'var(--spacing-8)' }}>
              We&apos;ll scale recipe quantities for you.
            </p>
          </div>
          <div className="onboarding-stepper-wrap">
            <Stepper value={servings} min={1} max={10} onChange={setServings} />
          </div>
        </div>
        <div className="onboarding-actions">
          <Button variant="primary" showIcon={false}>Done</Button>
          <Button variant="tertiary" showIcon={false}>Skip for now</Button>
        </div>
      </div>
    );
  },
};
