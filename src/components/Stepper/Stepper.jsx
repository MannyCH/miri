import React from 'react';
import { Minus, Plus } from 'react-feather';
import './Stepper.css';

export function Stepper({ label, value = 1, min = 1, max = 99, onChange }) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="stepper">
      {label ? (
        <span className="stepper-label text-body-small-regular">{label}</span>
      ) : null}
      <div className="stepper-control" role="group" aria-label={label}>
        <button
          type="button"
          className="stepper-button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease"
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="stepper-value text-body-regular" aria-live="polite" aria-atomic="true">
          {value}
        </span>
        <button
          type="button"
          className="stepper-button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

Stepper.displayName = 'Stepper';
