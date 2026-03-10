import React from 'react';
import { ChevronDown } from 'react-feather';
import './SelectField.css';

export function SelectField({ label, value = '', options = [], placeholder = 'Select', onChange }) {
  return (
    <div className="select-field">
      {label ? (
        <span className="select-field-label text-body-small-regular">{label}</span>
      ) : null}
      <div className="select-field-control">
        <select
          className="select-field-native text-body-regular"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          aria-label={label}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="select-field-icon" aria-hidden="true">
          <ChevronDown size={24} />
        </span>
      </div>
    </div>
  );
}

SelectField.displayName = 'SelectField';
