import React from 'react';
import { Button } from '@base-ui/react/button';
import './SearchFab.css';

export const SearchFab = ({ onClick, className, style, 'aria-label': ariaLabel = 'Search', ...props }) => (
  <Button
    className={['search-fab', className].filter(Boolean).join(' ')}
    style={style}
    onClick={onClick}
    aria-label={ariaLabel}
    {...props}
  >
    <SearchIcon />
  </Button>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

SearchFab.displayName = 'SearchFab';
