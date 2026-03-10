import React from 'react';
import './RadioButton.css';

export function RadioButton({ label, value, checked, onChange, name }) {
  return (
    <label className="radio-button">
      <input
        type="radio"
        className="radio-button-input"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span className="radio-button-circle" aria-hidden="true">
        <span className="radio-button-dot" />
      </span>
      {label ? <span className="radio-button-label text-body-small-regular">{label}</span> : null}
    </label>
  );
}

RadioButton.displayName = 'RadioButton';
