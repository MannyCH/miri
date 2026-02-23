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
  inputRef,
  trailingIcon,
  showTrailingIcon = true,
  ...props 
}) => {
  return (
    <div className="search-bar">
      <div className="search-bar-container">
        <input
          className="search-bar-input"
          ref={inputRef}
          placeholder={placeholder}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={value}
          onChange={onChange}
          {...props}
        />
        
        {showTrailingIcon && trailingIcon && (
          <span className="search-bar-icon-button" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>
    </div>
  );
};

SearchBar.displayName = 'SearchBar';
