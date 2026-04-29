import React, { useState } from 'react';
import { SuggestionList } from './SuggestionList';

export default {
  title: 'Components/SuggestionList',
  component: SuggestionList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Dropdown suggestion list shown above the search bar in the shopping list when the user types. Displays up to 3 matching ingredient suggestions from the ingredient catalogue.

## When to use
Use inside \`ShoppingListView\` to surface autocomplete suggestions as the user types in the add-ingredient search bar. Render only when \`suggestions.length > 0\`.

## When NOT to use
Do not use as a general-purpose dropdown or for non-ingredient contexts. Do not show more than 3 suggestions.

## Key props
- \`suggestions\` — array of ingredient name strings to display (max 3, already filtered by caller)
- \`onSelect\` — called with the selected ingredient name string when the user taps a row
- \`label\` — optional section label, defaults to \`"Suggestion"\`

## Token usage
| Property | Token |
|---|---|
| Background | \`--color-background-sunken\` |
| Border | \`--color-stroke-brand-weak\` |
| Corner radius | \`--corner-radius-card\` |
| Elevation | \`--elevation-raised\` |
| Label color | \`--color-text-weak\` |
| Item color | \`--color-text-strong\` |
| Item padding | \`--spacing-gap-sm\` (top/bottom) |
        `,
      },
    },
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Three matching suggestions — the maximum number shown at once.',
      },
    },
  },
  args: {
    suggestions: ['Kartoffeln', 'Karotten', 'Karfiol'],
    label: 'Suggestion',
  },
};

export const SingleItem = {
  parameters: {
    docs: {
      description: {
        story: 'Only one suggestion matched — no divider is shown.',
      },
    },
  },
  args: {
    suggestions: ['Kartoffeln'],
    label: 'Suggestion',
  },
};

export const TwoItems = {
  parameters: {
    docs: {
      description: {
        story: 'Two matching suggestions with one divider between them.',
      },
    },
  },
  args: {
    suggestions: ['Kartoffeln', 'Karotten'],
    label: 'Suggestion',
  },
};

export const Empty = {
  parameters: {
    docs: {
      description: {
        story: 'Empty suggestions array — renders nothing (null). The parent should not mount this component when there are no suggestions.',
      },
    },
  },
  args: {
    suggestions: [],
  },
};

export const Interactive = () => {
  const allSuggestions = [
    'Kartoffeln', 'Karotten', 'Karfiol', 'Käse', 'Knoblauch',
    'Milch', 'Mehl', 'Mandeln', 'Mais',
    'Tomaten', 'Tofu',
  ];
  const [query, setQuery] = useState('K');
  const [selected, setSelected] = useState(null);

  const suggestions = query.length > 0
    ? allSuggestions
        .filter(s => s.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 3)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-md)', maxWidth: 358 }}>
      <input
        style={{
          padding: 'var(--spacing-inset-sm)',
          border: '1px solid var(--color-stroke-weak)',
          borderRadius: 'var(--corner-radius-input)',
          font: 'inherit',
          color: 'var(--color-text-strong)',
          background: 'var(--color-background-base)',
        }}
        placeholder="Type to filter suggestions…"
        value={query}
        onChange={e => { setQuery(e.target.value); setSelected(null); }}
      />
      <SuggestionList
        suggestions={suggestions}
        onSelect={name => setSelected(name)}
      />
      {selected && (
        <p className="text-body-small-regular" style={{ color: 'var(--color-text-brand)' }}>
          Selected: <strong>{selected}</strong>
        </p>
      )}
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Type in the input to filter suggestions in real time. Selecting a suggestion reports it below the list.',
    },
  },
};
