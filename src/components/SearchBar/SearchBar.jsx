import React from 'react';
import { Field } from '@base-ui/react/field';
import './SearchBar.css';

/**
 * SearchBar component - Exactly as designed in Figma
 * Search input with trailing search icon
 */
export const SearchBar = ({ 
  placeholder = 'Ich brauche...',
  trailingIcon,
  showTrailingIcon = true,
  ...props 
}) => {
  return (
    <Field.Root className="search-bar">
      <div className="search-bar-container">
        <Field.Control
          className="search-bar-input text-body-small-regular"
          placeholder={placeholder}
          type="search"
          {...props}
        />
        
        {showTrailingIcon && trailingIcon && (
          <button
            type="button"
            className="search-bar-icon-button"
            aria-label="Search"
          >
            {trailingIcon}
          </button>
        )}
      </div>
    </Field.Root>
  );
};

SearchBar.displayName = 'SearchBar';
