import React from 'react';
import { SearchBar } from './SearchBar';

export default {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Search bar component with trailing search icon. Exactly as designed in Figma.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    showTrailingIcon: {
      control: 'boolean',
      description: 'Show trailing search icon',
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
};

export const WithoutIcon = {
  args: {
    placeholder: 'Ich brauche...',
    showTrailingIcon: false,
  },
};

export const CustomPlaceholder = {
  args: {
    placeholder: 'Search recipes...',
    showTrailingIcon: true,
    trailingIcon: <SearchIcon />,
  },
};
