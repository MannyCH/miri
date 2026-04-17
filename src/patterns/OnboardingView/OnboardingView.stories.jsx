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
Full-screen onboarding flow presented to new users immediately after account creation, before they reach the main app.

## When to use
Render this pattern after a successful sign-up when the user has no stored preferences. Each step is its own screen — navigate between them with the Continue / Skip for now actions.

## When NOT to use
Do not use for in-app preference editing. Returning users who want to change their preferences should use the AccountView SettingsSection instead.

## Composed of
- **ChoiceTile** — large tap-target selection tiles (steps 1 and 2)
- **Stepper** — numeric increment/decrement control for serving size (step 3)
- **Button** — primary "Continue" / "Done" CTA (disabled until a choice is made) and tertiary "Skip for now"
- **ProgressDots** — inline \`progressbar\` showing current step out of 3 (pattern-scoped, not a shared component)

## Key props
Each step story is self-contained with local state. In the app, collected values are written to PreferencesContext and persisted to Neon Postgres on completion.
- Steps 1 and 2: single-select — Continue is disabled until a ChoiceTile is selected
- Step 3: Stepper defaults to 2 servings; Continue is always enabled (pre-filled value)
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
  parameters: {
    docs: {
      description: {
        story: 'Step 1 of 3 — "What\'s your goal?" Presents four ChoiceTile options (Lose weight, Maintain, Gain muscle, Eat healthier). Continue is disabled until one is selected.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Step 2 of 3 — "How do you like to eat?" Presents five eating style options (No preference, Mediterranean, Plant-forward, High protein, Intermittent fasting). Continue is disabled until one is selected.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Step 3 of 3 — "How many people are you cooking for?" Stepper defaults to 2. The subtitle explains that recipe quantities will be scaled automatically. Done is always enabled.',
      },
    },
  },
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
