import React from 'react';
import './SearchBar.css';

/**
 * SearchBar component - Matches Figma search bar design
 * Plain input with trailing search icon
 */
export const SearchBar = ({ 
  placeholder = 'Ich brauche...',
  value,
  onChange,
  trailingIcon,
  showTrailingIcon = true,
  ...props 
}) => {
  return (
    <div className="search-bar">
      <div className="search-bar-container">
        <input
          className="search-bar-input text-body-small-regular"
          placeholder={placeholder}
          type="search"
          value={value}
          onChange={onChange}
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
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
