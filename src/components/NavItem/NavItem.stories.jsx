import React from 'react';
import { NavItem } from './NavItem';

export default {
  title: 'Components/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A single bottom-navigation tab composed of an icon and a text label. Built on Base UI Button for full keyboard and screen-reader support.

## When to use
- As a building block inside \`NavigationBar\` — use \`NavigationBar\` for the full app chrome rather than wiring up NavItems individually
- When a custom navigation bar layout is needed that cannot be expressed through \`NavigationBar\` props

## When NOT to use
- Do not use for in-page tab switching (use a Tabs component instead)
- Do not use for actions — NavItem signals "go to a section", not "do something"
- Do not use standalone outside a navigation bar context; the visual treatment assumes peer items

## Pairs well with
- \`NavigationBar\` — the standard container that renders four NavItems and manages the active state`,
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'pressed'],
      description: '`default` — the tab is not the current section; icon and label render at reduced emphasis. `pressed` — the tab is the active section; label switches to bold weight to reinforce selection.',
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
  parameters: {
    docs: {
      description: {
        story: 'The inactive state — used for all tabs that are not the current route. Icon and label appear at standard (not bold) weight.',
      },
    },
  },
};

export const Pressed = {
  args: {
    state: 'pressed',
    children: 'Recipes',
    showIcon: true,
    icon: <ListIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'The active/selected state — used for the tab matching the current route. The label becomes bold to reinforce which section the user is in.',
      },
    },
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

BothStates.parameters = {
  docs: {
    description: {
      story: 'Side-by-side comparison of the default and pressed states — useful for verifying the visual distinction between an inactive and active tab.',
    },
  },
};
