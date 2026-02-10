import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with 4 variants as designed in Figma. Built with Base UI for accessibility.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'tertiary-delete'],
      description: 'Button variant',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show/hide icon',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    children: {
      control: 'text',
      description: 'Button text',
    },
  },
};

// Icon component for stories (from Figma)
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Label',
    showIcon: true,
    icon: <HeartIcon />,
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Label',
    showIcon: true,
    icon: <HeartIcon />,
  },
};

export const Tertiary = {
  args: {
    variant: 'tertiary',
    children: 'Label',
    showIcon: false,
  },
};

export const TertiaryDelete = {
  args: {
    variant: 'tertiary-delete',
    children: 'Label',
    showIcon: false,
  },
};

export const AllVariants = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)', alignItems: 'flex-start' }}>
    <Button variant="primary" icon={<HeartIcon />}>
      Label
    </Button>
    <Button variant="secondary" icon={<HeartIcon />}>
      Label
    </Button>
    <Button variant="tertiary">
      Label
    </Button>
    <Button variant="tertiary-delete">
      Label
    </Button>
  </div>
);
