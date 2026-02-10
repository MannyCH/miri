import React from 'react';
import { Badge } from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Badge component for displaying notification counts. Exactly as designed in Figma.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
};

export const Default = {
  args: {
    children: '1',
  },
};

export const MultiDigit = {
  args: {
    children: '99',
  },
};

export const LargeNumber = {
  args: {
    children: '999+',
  },
};
