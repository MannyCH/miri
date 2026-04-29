import React from 'react';
import { Divider } from '../Divider';
import './SuggestionList.css';

export const SuggestionList = ({
  suggestions = [],
  onSelect,
  label = 'Suggestion',
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className="suggestion-list"
      role="listbox"
      aria-label="Ingredient suggestions"
    >
      <span className="suggestion-list-label text-tiny-regular">{label}</span>
      <ul className="suggestion-list-items">
        {suggestions.map((name, index) => (
          <li key={name} role="presentation">
            {index > 0 && <Divider />}
            {/* eslint-disable-next-line design-system/no-native-interactive-elements -- role="option" inside role="listbox" is the correct ARIA pattern; Button cannot carry role="option" */}
            <button
              type="button"
              className="suggestion-list-item text-body-regular"
              role="option"
              aria-selected="false"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect?.(name);
              }}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

SuggestionList.displayName = 'SuggestionList';
