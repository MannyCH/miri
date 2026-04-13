import React from 'react';
import { SearchBar } from './SearchBar';

export default {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Search bar input with an optional trailing icon. Matches the Figma search bar design — plain input with no border frame, relying on background fill for visual containment.

## When to use
- Any screen where the user needs to filter or find items from a list (recipes, ingredients, shopping list)
- Top-of-view search that spans full width
- When the search action is the primary interaction on the screen

## When NOT to use
- For freeform text entry that is not a search (name, email, password) — use \`TextField\` instead
- When search is one of many form fields — use \`TextField\` with \`type="search"\` in that context
- When a label is required above the input — \`TextField\` or \`UnitField\` carry their own label

## Pairs well with
- A results list or filtered recipe grid rendered below it
- \`Button\` with a clear/cancel action to dismiss the search
        `.trim(),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown before the user starts typing. Should hint at what to search for (e.g. "Ich brauche..." or "Search recipes...").',
    },
    showTrailingIcon: {
      control: 'boolean',
      description: 'Whether to render the trailing icon slot. Set to false when the icon is not relevant (e.g. a minimal inline filter).',
    },
  },
};

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export const Default = {
  args: {
    placeholder: 'Ich brauche...',
    showTrailingIcon: true,
    trailingIcon: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard search bar as used on the shopping list screen — full-width with a trailing search icon.',
      },
    },
  },
};

export const WithoutIcon = {
  args: {
    placeholder: 'Ich brauche...',
    showTrailingIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Search bar with the icon slot hidden. Useful when a clean, minimal layout is needed or when a clear button will occupy the trailing slot instead.',
      },
    },
  },
};

export const CustomPlaceholder = {
  args: {
    placeholder: 'Search recipes...',
    showTrailingIcon: true,
    trailingIcon: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Same component used on the recipes screen — only the placeholder text changes to match the context.',
      },
    },
  },
};
