import React from 'react';
import { NavItem } from './NavItem';

export default {
  title: 'Components/NavItem',
  component: NavItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Navigation item component with icon and text. 2 states: Default and Pressed.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'pressed'],
      description: 'Navigation item state',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show/hide icon',
    },
    children: {
      control: 'text',
      description: 'Label text',
    },
  },
};

const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

export const Default = {
  args: {
    state: 'default',
    children: 'Recipes',
    showIcon: true,
    icon: <ListIcon />,
  },
};

export const Pressed = {
  args: {
    state: 'pressed',
    children: 'Recipes',
    showIcon: true,
    icon: <ListIcon />,
  },
};

export const BothStates = () => (
  <div style={{ display: 'flex', gap: 'var(--spacing-24)' }}>
    <NavItem state="default" icon={<ListIcon />}>
      Recipes
    </NavItem>
    <NavItem state="pressed" icon={<ListIcon />}>
      Recipes
    </NavItem>
  </div>
);
