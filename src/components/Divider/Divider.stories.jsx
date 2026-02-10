import React from 'react';
import { Divider } from './Divider';

export default {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Divider component for separating content sections. Exactly as designed in Figma.',
      },
    },
  },
};

export const Default = {
  args: {},
};

export const InList = () => (
  <div style={{
    background: 'var(--color-background-raised)',
    borderRadius: 'var(--corner-radius-12)',
    padding: 'var(--spacing-16)',
    maxWidth: '300px'
  }}>
    <div className="text-body-small-bold" style={{ 
      padding: 'var(--spacing-8) 0',
      color: 'var(--color-text-strong)'
    }}>
      Item 1
    </div>
    <Divider />
    <div className="text-body-small-bold" style={{ 
      padding: 'var(--spacing-8) 0',
      color: 'var(--color-text-strong)'
    }}>
      Item 2
    </div>
    <Divider />
    <div className="text-body-small-bold" style={{ 
      padding: 'var(--spacing-8) 0',
      color: 'var(--color-text-strong)'
    }}>
      Item 3
    </div>
  </div>
);
