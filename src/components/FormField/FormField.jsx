import React from 'react';
import { AlertTriangle } from 'react-feather';
import './FormField.css';

const FIELD_VARIANTS = {
  EMPTY: 'empty',
  FILLED: 'filled',
  ERROR: 'error',
};

export function FormField({
  label,
  variant = FIELD_VARIANTS.FILLED,
  message = '',
  children,
}) {
  const isError = variant === FIELD_VARIANTS.ERROR;

  return (
    <label className={`form-field form-field-${variant}`}>
      <span className="form-field-label text-body-small-regular">{label}</span>
      {isError && message ? (
        <span className="form-field-message text-body-small-regular">
          <AlertTriangle size={14} aria-hidden="true" />
          {message}
        </span>
      ) : null}
      <div className="form-field-control">
        {children}
      </div>
    </label>
  );
}

FormField.displayName = 'FormField';

