import React, { useImperativeHandle, useRef } from 'react';
import './OtpCodeInput.css';

export const OtpCodeInput = React.forwardRef(({
  length = 6,
  value = '',
  onChange,
  disabled = false,
  error = false,
}, ref) => {
  const inputRefs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  useImperativeHandle(ref, () => ({
    focus: () => inputRefs.current[0]?.focus(),
  }));

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    onChange?.(next.join(''));
    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange?.(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      className={`otp-code-input${error ? ' otp-code-input--error' : ''}`}
      role="group"
      aria-label="Verification code"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}
          className="otp-code-input__digit text-body-regular"
          type="text"
          inputMode="numeric"
          pattern="\d"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
});

OtpCodeInput.displayName = 'OtpCodeInput';
