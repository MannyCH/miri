import React, { useState } from 'react';
import { CookingModeView } from './CookingModeView';
import { Button } from '../../components/Button/Button';

const lentilSoupSteps = [
  {
    verb: 'Wash',
    icon: '💧',
    items: [{ qty: '75g', name: 'yellow lentils', note: 'rinse under cold water until clear' }],
    duration: null,
  },
  {
    verb: 'Prep',
    icon: '🔪',
    items: [
      { qty: '50g', name: 'potato', note: 'cut into quarters' },
      { qty: '½', name: 'onion (60g)', note: 'cut into quarters' },
    ],
    duration: null,
  },
  {
    verb: 'Add into pan',
    icon: '🥣',
    items: [
      { qty: '1l', name: 'water' },
      { qty: '75g', name: 'lentils', note: 'the washed ones' },
      { qty: '50g', name: 'potato', note: 'the quartered pieces' },
      { qty: '½', name: 'onion', note: 'the quartered pieces' },
      { qty: '1 tsp', name: 'salt' },
    ],
    duration: null,
  },
  {
    verb: 'Boil',
    icon: '🔥',
    items: [{ note: 'bring to the boil' }],
    duration: { num: 10, unit: 'min' },
  },
  {
    verb: 'Simmer',
    icon: '🌡️',
    items: [
      { note: 'reduce heat' },
      { note: 'skim surface', qty: null, name: null },
    ],
    duration: { num: 25, unit: 'min' },
  },
  {
    verb: 'Mash',
    icon: '💪',
    items: [
      { note: 'remove from heat' },
      { note: 'mash everything in the pan' },
    ],
    duration: null,
  },
  {
    verb: 'Add & whisk',
    icon: '🥣',
    items: [
      { qty: '1l', name: 'boiling water' },
      { qty: '½ tsp', name: 'cumin' },
      { qty: '½ tsp', name: 'turmeric' },
      { qty: '¼ tsp', name: 'white pepper' },
    ],
    duration: { num: 1, unit: 'min — whisk constantly' },
  },
  {
    verb: 'Cook',
    icon: '🔥',
    items: [{ note: 'return to heat' }],
    duration: { num: 5, unit: 'min' },
  },
  {
    verb: 'Serve',
    icon: '🍋',
    items: [{ qty: '1', name: 'lemon', note: 'squeeze over each bowl' }],
    duration: null,
  },
];

export default {
  title: 'Patterns/CookingModeView',
  component: CookingModeView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-screen cooking mode view. The user steps through a recipe one action card at a time.
Active card is fully visible; up to two subsequent cards peek below at reduced opacity.

## When to use
Rendered when the user taps "Cook" on a RecipeDetailView. Never shown standalone in the normal recipe browse flow.

## States
- **Step 1**: "← Back" is disabled; "Next →" is active
- **Middle steps**: both navigation buttons are active
- **Last step**: tapping "Next →" should transition to a completion screen (handled by the parent)
- **Quit cooking**: exits immediately, handled by the parent

## Composed of
- **CookingStepCard** — the action card for each step
- **Button (secondary)** — Back / Next navigation
- **Button (tertiary-delete)** — Quit cooking link

## Opacity pattern for peek cards
| Card | Opacity |
|------|---------|
| Active (current) | 100% |
| Next step | 60% |
| Next + 1 step | 30% |

Peek cards have \`pointer-events: none\` and are \`aria-hidden\`.
        `,
      },
    },
  },
};

export const Step1 = {
  name: 'Step 1 (Back disabled)',
  args: {
    title: 'Yellow lentil soup',
    steps: lentilSoupSteps,
    currentStepIndex: 0,
    onNext: undefined,
    onBack: undefined,
    onQuit: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'First step — "← Back" is disabled. Three cards visible: active + two peek cards at 60% and 30%.',
      },
    },
  },
};

export const Step2 = {
  name: 'Step 2 (both buttons active)',
  args: {
    title: 'Yellow lentil soup',
    steps: lentilSoupSteps,
    currentStepIndex: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Second step — both Back and Next are enabled.',
      },
    },
  },
};

export const LastStep = {
  name: 'Last step',
  args: {
    title: 'Yellow lentil soup',
    steps: lentilSoupSteps,
    currentStepIndex: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Last step — only the active card is shown (no peek cards). Next → should transition to the completion screen.',
      },
    },
  },
};

export const SingleStep = {
  name: 'Single step recipe',
  args: {
    title: 'Boiled egg',
    steps: [
      {
        verb: 'Boil',
        icon: '🥚',
        items: [{ qty: '2', name: 'eggs' }],
        duration: { num: 10, unit: 'min' },
      },
    ],
    currentStepIndex: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Edge case: recipe with a single step — no peek cards rendered, Back is disabled.',
      },
    },
  },
};

export const Interactive = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [exited, setExited] = useState(false);

  const handleNext = () => {
    if (stepIndex < lentilSoupSteps.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handleBack = () => setStepIndex(i => Math.max(0, i - 1));
  const handleQuit = () => setExited(true);
  const handleRestart = () => { setStepIndex(0); setFinished(false); setExited(false); };

  if (exited) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 'var(--spacing-gap-lg)',
        padding: 'var(--spacing-inset-lg)',
      }}>
        <p className="text-h3-bold" style={{ color: 'var(--color-text-strong)', margin: 0 }}>
          Cooking cancelled.
        </p>
        <Button variant="tertiary" onClick={handleRestart}>
          Start over
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 'var(--spacing-gap-lg)',
        padding: 'var(--spacing-inset-lg)',
      }}>
        <p className="text-h3-bold" style={{ color: 'var(--color-text-strong)', margin: 0 }}>
          You're done! Enjoy your meal. 🎉
        </p>
        <Button variant="tertiary" onClick={handleRestart}>
          Back to recipe
        </Button>
      </div>
    );
  }

  return (
    <CookingModeView
      title="Yellow lentil soup"
      steps={lentilSoupSteps}
      currentStepIndex={stepIndex}
      onNext={handleNext}
      onBack={handleBack}
      onQuit={handleQuit}
    />
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Fully interactive — tap Next/Back to step through all 9 steps. Completing the last step shows a done screen; Quit cooking exits immediately.',
    },
  },
};
