import React, { useState } from 'react';
import { AlertTriangle, Eye, EyeOff } from 'react-feather';
import './TextField.css';

export const TextField = React.forwardRef(({
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
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const variant = error ? 'error' : value ? 'filled' : 'empty';
  const { 'aria-label': ariaLabel, ...restProps } = rest;

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
          ref={ref}
          className="text-field-input text-body-regular"
          type={inputType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          onChange={(e) => onChange && onChange(e.target.value)}
          onBlur={onBlur}
          aria-label={ariaLabel ?? label}
          aria-invalid={Boolean(error)}
          {...restProps}
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
});

TextField.displayName = 'TextField';
