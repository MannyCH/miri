import React from 'react';
import { Chip } from './Chip';

export default {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Toggle pill used for filter selection and category tags.

## When to use
- Category/filter toggles inside search overlays (e.g. meal type, recipe category)
- Active-filter pills displayed above a list to show current selection
- Any toggle chip where the user picks one or more options from a set

## When NOT to use
- Navigation tabs — use a tab bar
- Single-line text input — use TextField
- Call-to-action — use Button

## Behaviour
- \`active\` drives the visual state (filled brand) and \`aria-pressed\` for screen readers
- \`showClose\` renders a × indicator inside the chip when active (signals "tap to remove")
- Keyboard: Space/Enter toggles the chip

## Token usage
| Property | Token |
|---|---|
| Padding | \`--spacing-inset-xs\` (vertical) + \`--spacing-12\` (horizontal) |
| Gap | \`--spacing-gap-xs\` |
| Border radius | \`--corner-radius-pill\` |
| Default bg | \`--color-background-sunken\` |
| Active bg | \`--color-fill-brand-strong\` |
        `,
      },
    },
  },
  argTypes: {
    active: {
      control: 'boolean',
      description: 'Toggle selected state — fills with brand colour and updates aria-pressed',
      table: { defaultValue: { summary: 'false' } },
    },
    showClose: {
      control: 'boolean',
      description: 'Show × remove indicator — use when chip is removable (e.g. active filter pill)',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Chip label',
    },
  },
};

export const Default = {
  args: { children: 'Breakfast', active: false },
  parameters: {
    docs: { description: { story: 'Default state — unselected chip with neutral stroke border.' } },
  },
};

export const Active = {
  args: { children: 'Breakfast', active: true, showClose: true },
  parameters: {
    docs: { description: { story: 'Selected state — brand-filled with × close indicator. Use showClose when the chip can be removed by tapping it again.' } },
  },
};

export const WithoutClose = {
  args: { children: 'Dinner', active: true, showClose: false },
  parameters: {
    docs: { description: { story: 'Active chip without close indicator — use in search overlay filter chips where the chip itself is the toggle (not a separate remove button).' } },
  },
};

export const Disabled = {
  args: { children: 'Breakfast', active: false, disabled: true },
  parameters: {
    docs: { description: { story: 'Disabled state — not interactive.' } },
  },
};

export const Interactive = {
  name: 'Interactive — filter group',
  parameters: {
    docs: { description: { story: 'Live demo — tap chips to toggle. Simulates the search overlay filter chip group in RecipesView.' } },
  },
  render: () => {
    const filters = ['Breakfast', 'Lunch', 'Dinner', 'Italian', 'Asian', 'Vegetarian'];
    const [active, setActive] = React.useState([]);
    const toggle = (label) =>
      setActive(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-gap-sm)' }}>
        {filters.map(label => (
          <Chip
            key={label}
            active={active.includes(label)}
            showClose={active.includes(label)}
            onClick={() => toggle(label)}
          >
            {label}
          </Chip>
        ))}
      </div>
    );
  },
};

export const ActiveFilterPills = {
  name: 'Active filter pills (above list)',
  parameters: {
    docs: { description: { story: 'Active filter pills rendered above the recipe list — each chip shows the active filter with a × remove indicator.' } },
  },
  render: () => {
    const [active, setActive] = React.useState(['Breakfast', 'Italian']);
    const remove = (label) => setActive(prev => prev.filter(l => l !== label));
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-gap-sm)' }}>
        {active.map(label => (
          <Chip key={label} active showClose onClick={() => remove(label)}>
            {label}
          </Chip>
        ))}
      </div>
    );
  },
};
