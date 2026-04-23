import React from 'react';
import { fn } from 'storybook/test';
import { Meta, StoryObj } from '@storybook/react-vite';
import { SearchFab } from './SearchFab';

/** @type {Meta<typeof SearchFab>} */
export default {
  title: 'Components/SearchFab',
  component: SearchFab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Floating action button for triggering search. 48×48 pill shape with brand icon color and overlay elevation.

Used in **RecipesView** anchored just above the NavigationBar. Positioning (absolute, bottom, right) is handled by the parent — this component only defines its intrinsic appearance.

## Tokens used
- Size: \`--spacing-48\`
- Shape: \`--corner-radius-pill\`
- Elevation: \`--elevation-overlay\`
- Border: \`--color-stroke-weak\`
- Background: \`--color-background-raised\`
- Icon: \`--color-icon-brand\`
        `,
      },
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the button',
    },
  },
};

/** @type {StoryObj<typeof SearchFab>} */
export const Default = {
  args: {
    onClick: fn(),
    'aria-label': 'Search recipes',
  },
};

export const AboveNavBar = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Shown in its typical position — anchored above a navigation bar. Positioning is applied by the parent container.',
      },
    },
  },
  render: () => (
    <div style={{ position: 'relative', width: '390px', height: '120px' }}>
      <SearchFab
        aria-label="Search recipes"
        onClick={fn()}
        style={{ position: 'absolute', bottom: 'calc(76px + var(--spacing-16))', right: 'var(--spacing-16)' }}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '76px',
        background: 'var(--color-background-base)',
        borderTop: '1px solid var(--color-stroke-weak)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span className="text-body-small-regular" style={{ color: 'var(--color-text-weak)' }}>Navigation Bar</span>
      </div>
    </div>
  ),
};
