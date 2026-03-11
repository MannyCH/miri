import React, { useState } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'react-feather';
import './TextField.css';

/**
 * Text input field with label, error state and optional eye toggle for passwords.
 * Variant is derived automatically: 'filled' when value is present, 'empty' otherwise.
 * Pass `error` to switch to the error state with a message.
 */
export function TextField({
  label,
  type = 'text',
  value = '',
  placeholder = '',
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  error = '',
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const variant = error ? 'error' : value ? 'filled' : 'empty';

  return (
    <div className={`text-field text-field-${variant}`}>
      {label ? (
        <span className="text-field-label text-body-small-regular">{label}</span>
      ) : null}
      {error ? (
        <span className="text-field-error-message text-body-small-regular">
          <AlertTriangle size={14} aria-hidden="true" />
          {error}
        </span>
      ) : null}
      <div className="text-field-control">
        <input
          className="text-field-input text-body-regular"
          type={inputType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          onChange={(e) => onChange && onChange(e.target.value)}
          onBlur={onBlur}
          aria-label={label}
          aria-invalid={Boolean(error)}
        />
        {isPassword && !disabled && !readOnly ? (
          <button
            type="button"
            className="text-field-eye-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword
              ? <Eye size={18} aria-hidden="true" />
              : <EyeOff size={18} aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

TextField.displayName = 'TextField';
