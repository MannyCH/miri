import React from 'react';
import './UnitField.css';

export function UnitField({ label, unit, value = '', placeholder = '', onChange, type = 'number', min, max, step }) {
  return (
    <div className="unit-field">
      {label ? (
        <span className="unit-field-label text-body-small-regular">{label}</span>
      ) : null}
      <div className="unit-field-row">
        <div className="unit-field-input-frame">
          <input
            className="unit-field-input text-body-regular"
            type={type}
            value={value}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange && onChange(e.target.value)}
            aria-label={label}
          />
        </div>
        {unit ? (
          <span className="unit-field-unit text-body-small-regular">{unit}</span>
        ) : null}
      </div>
    </div>
  );
}

UnitField.displayName = 'UnitField';
