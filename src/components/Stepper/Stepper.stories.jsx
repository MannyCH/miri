import React, { useState } from 'react';
import { Stepper } from './Stepper';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component: 'Number stepper for selecting quantities. Used for default serving size in account settings.',
      },
    },
  },
};

function StepperWithState({ initialValue = 2, ...props }) {
  const [value, setValue] = useState(initialValue);
  return <Stepper {...props} value={value} onChange={setValue} />;
}

export const Default = {
  render: () => (
    <StepperWithState
      label="How many people are you usually cooking for?"
      initialValue={2}
      min={1}
      max={20}
    />
  ),
};

export const WithoutLabel = {
  render: () => <StepperWithState initialValue={4} min={1} max={20} />,
};

export const AtMinimum = {
  render: () => <StepperWithState initialValue={1} min={1} max={20} label="Servings" />,
};

export const AtMaximum = {
  render: () => <StepperWithState initialValue={20} min={1} max={20} label="Servings" />,
};
