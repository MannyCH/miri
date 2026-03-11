import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check, CheckCircle, Circle, Loader, X } from 'react-feather';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button/Button';
import { TextField } from '../components/TextField/TextField';
import './AuthPage.css';

const AUTH_MODES = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  VERIFY_EMAIL: 'verify-email',
};
const OTP_LENGTH = 6;
const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_HAS_NUMBER_REGEX = /\d/;
const PASSWORD_HAS_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_HAS_SPECIAL_REGEX = /[^A-Za-z0-9]/;
const PENDING_SIGNUP_NAMES_STORAGE_KEY = 'miri-pending-signup-names';

function normalizeEmailAddress(email) {
  return String(email || '').trim().toLowerCase();
}

export function AuthPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const { showToast } = useApp();
  const { isAuthenticated, isAuthReady, signIn, signUp, requestPasswordReset, resetPassword, verifyEmail, sendVerificationCode } = useAuth();
  const hasTokenParam = Boolean(params.get('token'));

  const initialMode = useMemo(() => {
    const modeFromUrl = params.get('mode');
    if (Object.values(AUTH_MODES).includes(modeFromUrl)) {
      return modeFromUrl;
    }
    const tokenFromUrl = params.get('token');
    const typeFromUrl = params.get('type');
    if (tokenFromUrl && typeFromUrl === 'reset-password') {
      return AUTH_MODES.RESET_PASSWORD;
    }
    if (location.pathname === '/auth/reset-password') {
      return AUTH_MODES.RESET_PASSWORD;
    }
    if (tokenFromUrl) {
      return AUTH_MODES.RESET_PASSWORD;
    }
    return AUTH_MODES.SIGN_IN;
  }, [location.pathname, params]);

  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyEmailAddress, setVerifyEmailAddress] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyToken, setVerifyToken] = useState(params.get('token') || '');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [resendCodeActionState, setResendCodeActionState] = useState('default');
  const [forgotActionState, setForgotActionState] = useState('default');
  const [verifyActionState, setVerifyActionState] = useState('default');
  const [resetActionState, setResetActionState] = useState('default');
  const [signInToastMessage, setSignInToastMessage] = useState('');
  const [signInEmailError, setSignInEmailError] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState('');
  const [signUpPasswordRulesTouched, setSignUpPasswordRulesTouched] = useState(false);
  const [resetPasswordRulesTouched, setResetPasswordRulesTouched] = useState(false);
  const [resetNewPasswordError, setResetNewPasswordError] = useState('');
  const [resetConfirmPasswordError, setResetConfirmPasswordError] = useState('');
  const [showForgotLoadingIcon, setShowForgotLoadingIcon] = useState(false);
  const [verifyInfoMessage, setVerifyInfoMessage] = useState('');
  const [pendingSignUpNamesByEmail, setPendingSignUpNamesByEmail] = useState(() => {
    try {
      const stored = window.localStorage.getItem(PENDING_SIGNUP_NAMES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (_error) {
      return {};
    }
  });
  const suppressSignInBlurValidationRef = useRef(false);
  const resendInFlightRef = useRef(false);
  const resendSuccessTimeoutRef = useRef(null);
  const codeInputRefs = useRef([]);

  if (!isAuthReady) {
    return <div className="auth-page-status">Loading authentication...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/planning" replace />;
  }

  const clearFeedback = () => {
    setMessage('');
    setErrorMessage('');
  };

  const rememberPendingSignUpName = (emailAddress, firstName) => {
    const normalizedEmail = normalizeEmailAddress(emailAddress);
    const normalizedName = String(firstName || '').trim();
    if (!normalizedEmail || !normalizedName) {
      return;
    }
    setPendingSignUpNamesByEmail((prev) => {
      if (prev[normalizedEmail] === normalizedName) {
        return prev;
      }
      const next = { ...prev, [normalizedEmail]: normalizedName };
      window.localStorage.setItem(PENDING_SIGNUP_NAMES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearPendingSignUpName = (emailAddress) => {
    const normalizedEmail = normalizeEmailAddress(emailAddress);
    if (!normalizedEmail) {
      return;
    }
    setPendingSignUpNamesByEmail((prev) => {
      if (!prev[normalizedEmail]) {
        return prev;
      }
      const next = { ...prev };
      delete next[normalizedEmail];
      window.localStorage.setItem(PENDING_SIGNUP_NAMES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearAuthFormValues = () => {
    setName('');
    setEmail('');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setVerifyToken(params.get('token') || '');
    setVerifyEmailAddress('');
    setVerifyInfoMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let forgotLoadingDelayTimer = null;
    setIsSubmitting(true);
    clearFeedback();

    try {
      if (mode === AUTH_MODES.SIGN_IN) {
        const trimmedEmail = email.trim();
        if (!EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
          setSignInEmailError('Please enter a valid email address.');
          return;
        }
        setSignInEmailError('');
        await signIn({ email, password });
        return;
      }

      if (mode === AUTH_MODES.SIGN_UP) {
        const trimmedEmail = normalizeEmailAddress(email);
        if (!EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
          setSignUpEmailError('Please enter a valid email address.');
          return;
        }
        setSignUpEmailError('');
        const rememberedName = pendingSignUpNamesByEmail[trimmedEmail];
        const signUpName = rememberedName || String(name || '').trim();
        const allPasswordRulesMet = (
          signUpPasswordChecks.minLength
          && signUpPasswordChecks.hasNumber
          && signUpPasswordChecks.hasUppercase
          && signUpPasswordChecks.hasSpecial
        );
        if (!allPasswordRulesMet) {
          setSignUpPasswordRulesTouched(true);
          return;
        }
        await signUp({ name: signUpName, email: trimmedEmail, password });
        rememberPendingSignUpName(trimmedEmail, signUpName);
        setName(signUpName);
        setVerifyEmailAddress(email);
        setMode(AUTH_MODES.VERIFY_EMAIL);
        setPassword('');
        setSignUpPasswordRulesTouched(false);
        return;
      }

      if (mode === AUTH_MODES.FORGOT_PASSWORD) {
        setShowForgotLoadingIcon(false);
        forgotLoadingDelayTimer = setTimeout(() => {
          setShowForgotLoadingIcon(true);
        }, 2000);
        await requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        clearTimeout(forgotLoadingDelayTimer);
        setShowForgotLoadingIcon(false);
        setForgotActionState('success');
        setTimeout(() => {
          setForgotActionState('default');
        }, 3000);
        return;
      }

      if (mode === AUTH_MODES.RESET_PASSWORD) {
        setResetNewPasswordError('');
        setResetConfirmPasswordError('');
        if (!verifyToken) {
          setResetNewPasswordError('Missing reset token. Open the reset link from your email again.');
          return;
        }
        if (!allResetPasswordChecksMet) {
          setResetPasswordRulesTouched(true);
          return;
        }
        if (newPassword !== confirmPassword) {
          setResetConfirmPasswordError('Passwords do not match.');
          return;
        }
        if (password && newPassword === password) {
          setResetNewPasswordError('New password must be different from your current password.');
          return;
        }
        await resetPassword({ token: verifyToken, newPassword });
        setResetActionState('success');
        setResetPasswordRulesTouched(false);
        setSignInToastMessage('Password has been updated successfully.');
        setMode(AUTH_MODES.SIGN_IN);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }

      if (mode === AUTH_MODES.VERIFY_EMAIL) {
        const hasCodeInput = Boolean(verifyEmailAddress && verificationCode);
        const hasTokenInput = Boolean(verifyToken);
        if (!hasCodeInput && !hasTokenInput) {
          throw new Error('Enter email + verification code, or paste a verification token.');
        }

        const verifyResult = await verifyEmail({
          token: verifyToken,
          email: verifyEmailAddress,
          code: verificationCode,
        });
        setVerifyActionState('success');
        const normalizedVerifyEmail = normalizeEmailAddress(verifyEmailAddress || email);
        const welcomeName = verifyResult?.session?.user?.name
          || verifyResult?.user?.name
          || pendingSignUpNamesByEmail[normalizedVerifyEmail]
          || name.trim()
          || verifyEmailAddress.split('@')[0]
          || 'there';
        showToast('Success', `Welcome to Miri, ${welcomeName}. Account successfully created.`);
        clearPendingSignUpName(normalizedVerifyEmail);
        await new Promise((resolve) => setTimeout(resolve, 1100));
        setVerifyInfoMessage('');
        setMode(AUTH_MODES.SIGN_IN);
        return;
      }
    } catch (error) {
      if (forgotLoadingDelayTimer) {
        clearTimeout(forgotLoadingDelayTimer);
      }
      setShowForgotLoadingIcon(false);
      const authErrorMessage = error.message || 'Authentication failed.';
      if (mode === AUTH_MODES.VERIFY_EMAIL) {
        setVerifyActionState('error');
      }
      if (mode === AUTH_MODES.RESET_PASSWORD) {
        setResetActionState('error');
        if (/same old|same as old|different from your current|must be different/i.test(authErrorMessage)) {
          setResetNewPasswordError(authErrorMessage);
          setErrorMessage('');
          return;
        }
      }
      if (mode === AUTH_MODES.SIGN_IN && /email not verified/i.test(authErrorMessage)) {
        setMode(AUTH_MODES.VERIFY_EMAIL);
        setVerifyEmailAddress(email);
        setVerifyInfoMessage('');
        setErrorMessage('');
      } else if (mode === AUTH_MODES.SIGN_UP && /user already exists/i.test(authErrorMessage)) {
        const normalizedEmail = normalizeEmailAddress(email);
        const rememberedName = pendingSignUpNamesByEmail[normalizedEmail];
        if (rememberedName) {
          setName(rememberedName);
        }
        try {
          await sendVerificationCode({ email: normalizedEmail });
        } catch (_resendError) {
          // Keep UX focused on verify step even if resend fails transiently.
        }
        setVerifyEmailAddress(normalizedEmail);
        setVerifyInfoMessage('Account already exists. Please verify your email.');
        setMode(AUTH_MODES.VERIFY_EMAIL);
        setErrorMessage('');
      } else {
        setErrorMessage(authErrorMessage);
      }
    } finally {
      if (forgotLoadingDelayTimer) {
        clearTimeout(forgotLoadingDelayTimer);
      }
      setShowForgotLoadingIcon(false);
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendInFlightRef.current || resendCodeActionState === 'success') {
      return;
    }
    resendInFlightRef.current = true;
    clearFeedback();
    setIsResendingCode(true);
    try {
      if (!verifyEmailAddress) {
        throw new Error('Enter your email first.');
      }
      await sendVerificationCode({ email: verifyEmailAddress });
      setVerificationCode('');
      codeInputRefs.current[0]?.focus();
      setResendCodeActionState('success');
      if (resendSuccessTimeoutRef.current) {
        clearTimeout(resendSuccessTimeoutRef.current);
      }
      resendSuccessTimeoutRef.current = setTimeout(() => {
        setResendCodeActionState('default');
        resendSuccessTimeoutRef.current = null;
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Could not send verification code.');
    } finally {
      setIsResendingCode(false);
      resendInFlightRef.current = false;
    }
  };

  const resetModeUiState = (nextMode) => {
    clearAuthFormValues();
    clearFeedback();
    setSignInEmailError('');
    setSignUpEmailError('');
    setSignUpPasswordRulesTouched(false);
    setResetPasswordRulesTouched(false);
    setResetNewPasswordError('');
    setResetConfirmPasswordError('');
    setShowForgotLoadingIcon(false);
    setForgotActionState('default');
    setVerifyActionState('default');
    setResetActionState('default');
    setResendCodeActionState('default');
    setSignInToastMessage('');
    setVerifyInfoMessage('');
    resendInFlightRef.current = false;
    if (resendSuccessTimeoutRef.current) {
      clearTimeout(resendSuccessTimeoutRef.current);
      resendSuccessTimeoutRef.current = null;
    }
    setMode(nextMode);
    setTimeout(() => {
      suppressSignInBlurValidationRef.current = false;
    }, 0);
  };

  const resolveSignInFieldError = (rawMessage) => {
    const normalized = String(rawMessage || '').toLowerCase();
    if (!normalized) return { email: '', password: '', generic: '' };
    if (normalized.includes('invalid email or password')) {
      return { email: '', password: rawMessage, generic: '' };
    }
    if (normalized.includes('email') && !normalized.includes('password') && !normalized.includes('credential')) {
      return { email: rawMessage, password: '', generic: '' };
    }
    if (
      normalized.includes('password')
      || normalized.includes('credential')
      || normalized.includes('invalid')
      || normalized.includes('wrong')
    ) {
      return { email: '', password: rawMessage, generic: '' };
    }
    return { email: '', password: '', generic: rawMessage };
  };

  const resolveSignUpFieldError = (rawMessage) => {
    const normalized = String(rawMessage || '').toLowerCase();
    if (!normalized) return { email: '', generic: '' };
    if (normalized.includes('user already exists')) {
      return { email: rawMessage, generic: '' };
    }
    return { email: '', generic: rawMessage };
  };

  const handleSignInEmailChange = (value) => {
    setEmail(value);
    if (signInEmailError) {
      setSignInEmailError('');
    }
  };

  const handleSignInEmailBlur = () => {
    if (suppressSignInBlurValidationRef.current) {
      setSignInEmailError('');
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setSignInEmailError('');
      return;
    }
    if (!EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
      setSignInEmailError('Please enter a valid email address.');
      return;
    }
    setSignInEmailError('');
  };

  const handleSignUpEmailChange = (value) => {
    setEmail(value);
    if (signUpEmailError) {
      setSignUpEmailError('');
    }
  };

  const handleSignUpEmailBlur = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setSignUpEmailError('');
      return;
    }
    if (!EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
      setSignUpEmailError('Please enter a valid email address.');
      return;
    }
    setSignUpEmailError('');
  };

  const handleResetNewPasswordChange = (value) => {
    setNewPassword(value);
    if (resetNewPasswordError) {
      setResetNewPasswordError('');
    }
    if (resetConfirmPasswordError) {
      setResetConfirmPasswordError('');
    }
  };

  const handleResetConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (resetConfirmPasswordError) {
      setResetConfirmPasswordError('');
    }
  };

  const handleResetConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      setResetConfirmPasswordError('');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetConfirmPasswordError('Passwords do not match.');
      return;
    }
    if (password && newPassword === password) {
      setResetNewPasswordError('New password must be different from your current password.');
      return;
    }
    setResetConfirmPasswordError('');
  };

  const signUpPasswordChecks = {
    minLength: password.length >= 8,
    hasNumber: PASSWORD_HAS_NUMBER_REGEX.test(password),
    hasUppercase: PASSWORD_HAS_UPPERCASE_REGEX.test(password),
    hasSpecial: PASSWORD_HAS_SPECIAL_REGEX.test(password),
  };

  const resetPasswordChecks = {
    minLength: newPassword.length >= 8,
    hasNumber: PASSWORD_HAS_NUMBER_REGEX.test(newPassword),
    hasUppercase: PASSWORD_HAS_UPPERCASE_REGEX.test(newPassword),
    hasSpecial: PASSWORD_HAS_SPECIAL_REGEX.test(newPassword),
  };
  const allResetPasswordChecksMet = Object.values(resetPasswordChecks).every(Boolean);

  const animatedIcon = (type) => {
    if (type === 'success') {
      return (
        <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
          <Check size={18} />
        </motion.span>
      );
    }
    if (type === 'error') {
      return (
        <motion.span initial={{ rotate: -12, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
          <AlertTriangle size={18} />
        </motion.span>
      );
    }
    if (type === 'loading') {
      return (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Loader size={18} className="auth-spinning-icon" />
        </motion.span>
      );
    }
    return null;
  };

  const handleCodeDigitChange = (index, value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) {
      const nextChars = verificationCode.padEnd(OTP_LENGTH, ' ').split('');
      nextChars[index] = ' ';
      setVerificationCode(nextChars.join('').trimEnd());
      return;
    }
    const nextChars = verificationCode.padEnd(OTP_LENGTH, ' ').split('');
    const codeSlice = digits.slice(0, OTP_LENGTH - index).split('');
    codeSlice.forEach((digit, offset) => {
      nextChars[index + offset] = digit;
    });
    const nextCode = nextChars.join('').trimEnd();
    setVerificationCode(nextCode);

    const nextFocusIndex = Math.min(index + codeSlice.length, OTP_LENGTH - 1);
    if (codeSlice.length > 0) {
      codeInputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (index, event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    handleCodeDigitChange(index, pastedText);
  };

  const renderSignInContent = () => (
    <>
      <h1 className="auth-title text-h2-bold">Log in to Miri</h1>
      {signInToastMessage ? (
        <div className="auth-success-message text-body-small-bold">
          <Check size={16} aria-hidden="true" />
          <span>{signInToastMessage}</span>
        </div>
      ) : null}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleSignInEmailChange}
          onBlur={handleSignInEmailBlur}
          error={signInEmailError || resolveSignInFieldError(errorMessage).email}
          autoComplete="email"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={resolveSignInFieldError(errorMessage).password}
          autoComplete="current-password"
        />

        <div className="auth-field-meta">
          <button
            type="button"
            className="auth-field-link text-tiny-regular"
            onClick={() => resetModeUiState(AUTH_MODES.FORGOT_PASSWORD)}
            onMouseDown={() => {
              suppressSignInBlurValidationRef.current = true;
            }}
          >
            Forgot password?
          </button>
        </div>

        {resolveSignInFieldError(errorMessage).generic ? (
          <p className="auth-error">{resolveSignInFieldError(errorMessage).generic}</p>
        ) : null}

        <div className="auth-button-row">
          <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : 'Log in'}
          </Button>
        </div>
      </form>

      <p className="auth-footer-copy text-body-small-regular">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          className="auth-footer-link text-body-small-bold-underlined"
          onClick={() => resetModeUiState(AUTH_MODES.SIGN_UP)}
          onMouseDown={() => {
            suppressSignInBlurValidationRef.current = true;
          }}
        >
          Sign up
        </button>
      </p>
    </>
  );

  const renderVerifyContent = () => (
    <section className="auth-verify-layout">
      <h1 className="auth-verify-title text-h2-bold">Check your email</h1>
      <p className="auth-verify-subtitle text-body-small-regular">
        Enter the login code sent to:
        <br />
        {verifyEmailAddress || email || 'your email'}
      </p>
      {verifyInfoMessage ? (
        <p className="auth-verify-info text-body-small-regular">{verifyInfoMessage}</p>
      ) : null}

      {!verifyEmailAddress ? (
        <TextField
          label="Email"
          type="email"
          value={verifyEmailAddress}
          onChange={setVerifyEmailAddress}
          autoComplete="email"
        />
      ) : null}

      <form className="auth-form auth-verify-form" onSubmit={handleSubmit}>
        <div className="auth-code-group" role="group" aria-label="Verification code">
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <input
              key={`code-${index}`}
              ref={(element) => {
                codeInputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              className="auth-code-input text-body-regular"
              value={verificationCode[index] || ''}
              onChange={(event) => handleCodeDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleCodeKeyDown(index, event)}
              onPaste={(event) => handleCodePaste(index, event)}
            />
          ))}
        </div>

        {hasTokenParam ? (
          <TextField
            label="Verification token"
            value={verifyToken}
            onChange={setVerifyToken}
          />
        ) : null}

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        <div className="auth-button-row auth-verify-actions">
          <Button
            variant="primary"
            showIcon={verifyActionState !== 'default'}
            icon={verifyActionState === 'success' ? animatedIcon('success') : verifyActionState === 'error' ? animatedIcon('error') : null}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : verifyActionState === 'success' ? 'Verified' : verifyActionState === 'error' ? 'Wrong code' : 'Continue'}
          </Button>
          {resendCodeActionState === 'success' ? (
            <p className="auth-success-message text-body-small-bold">
              <Check size={16} aria-hidden="true" />
              <span>Code resent</span>
            </p>
          ) : (
            <p className="auth-footer-copy text-body-small-regular">
              Code not received?{' '}
              <button
                type="button"
                className="auth-footer-link text-body-small-bold-underlined"
                onClick={handleResendCode}
                disabled={isResendingCode}
              >
                Resend code
              </button>
            </p>
          )}
        </div>
      </form>
      <button
        type="button"
        className="auth-inline-link text-body-small-bold-underlined"
        onClick={() => resetModeUiState(AUTH_MODES.SIGN_IN)}
      >
        Back to login
      </button>
    </section>
  );

  const renderSignUpContent = () => (
    <>
      <h1 className="auth-title text-h2-bold">Create your account</h1>
      <p className="auth-subtitle text-body-regular">Start planning meals with Miri.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <TextField
          label="First name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleSignUpEmailChange}
          onBlur={handleSignUpEmailBlur}
          error={signUpEmailError || resolveSignUpFieldError(errorMessage).email}
          autoComplete="email"
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />

        <ul className="auth-password-requirements" aria-live="polite">
          {[
            { key: 'minLength', label: 'at least 8 characters' },
            { key: 'hasNumber', label: 'at least 1 number' },
            { key: 'hasUppercase', label: 'at least 1 uppercase letter' },
            { key: 'hasSpecial', label: 'at least 1 special sign' },
          ].map(({ key, label }) => {
            const met = signUpPasswordChecks[key];
            const hasError = !met && signUpPasswordRulesTouched;
            return (
              <li
                key={key}
                className={`auth-password-requirement${met ? ' is-met' : ''}${hasError ? ' is-error' : ''}`}
              >
                {met
                  ? <CheckCircle size={14} aria-hidden="true" />
                  : hasError
                    ? <X size={14} aria-hidden="true" />
                    : <Circle size={14} aria-hidden="true" />}
                <span className={met || hasError ? 'text-body-small-bold' : 'text-body-small-regular'}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        {resolveSignUpFieldError(errorMessage).generic ? <p className="auth-error">{resolveSignUpFieldError(errorMessage).generic}</p> : null}

        <div className="auth-button-row">
          <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : 'Create Account'}
          </Button>
        </div>
      </form>

      <p className="auth-footer-copy text-body-small-regular">
        Already have an account?{' '}
        <button
          type="button"
          className="auth-footer-link text-body-small-bold-underlined"
          onClick={() => resetModeUiState(AUTH_MODES.SIGN_IN)}
        >
          Log in
        </button>
      </p>

    </>
  );

  const renderForgotPasswordContent = () => (
    <>
      <h1 className="auth-title text-h2-bold">Forgot password</h1>
      <p className="auth-subtitle text-body-regular">We&apos;ll send a reset link to your email.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

        <div className="auth-button-row">
          <Button
            variant="primary"
            showIcon={forgotActionState === 'success' || (isSubmitting && showForgotLoadingIcon)}
            icon={forgotActionState === 'success' ? animatedIcon('success') : (isSubmitting && showForgotLoadingIcon ? animatedIcon('loading') : null)}
            type="submit"
            disabled={isSubmitting}
          >
            {forgotActionState === 'success' ? 'Sent' : 'Send reset mail'}
          </Button>
        </div>
      </form>

      <button
        type="button"
        className="auth-inline-link text-body-small-bold-underlined"
        onClick={() => resetModeUiState(AUTH_MODES.SIGN_IN)}
      >
        Back to login
      </button>
    </>
  );

  const renderResetPasswordContent = () => (
    <>
      <h1 className="auth-title text-h2-bold">Reset password</h1>
      <p className="auth-subtitle text-body-regular">Create a new password to continue.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={handleResetNewPasswordChange}
          error={resetNewPasswordError}
          autoComplete="new-password"
        />

        <ul className="auth-password-requirements" aria-live="polite">
          {[
            { key: 'minLength', label: 'at least 8 characters' },
            { key: 'hasNumber', label: 'at least 1 number' },
            { key: 'hasUppercase', label: 'at least 1 uppercase letter' },
            { key: 'hasSpecial', label: 'at least 1 special sign' },
          ].map(({ key, label }) => {
            const met = resetPasswordChecks[key];
            const hasError = !met && resetPasswordRulesTouched;
            return (
              <li
                key={key}
                className={`auth-password-requirement${met ? ' is-met' : ''}${hasError ? ' is-error' : ''}`}
              >
                {met
                  ? <CheckCircle size={14} aria-hidden="true" />
                  : hasError
                    ? <X size={14} aria-hidden="true" />
                    : <Circle size={14} aria-hidden="true" />}
                <span className={met || hasError ? 'text-body-small-bold' : 'text-body-small-regular'}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <TextField
          label="Retype password"
          type="password"
          value={confirmPassword}
          onChange={handleResetConfirmPasswordChange}
          onBlur={handleResetConfirmPasswordBlur}
          error={resetConfirmPasswordError}
          autoComplete="new-password"
        />

        {errorMessage && !resetNewPasswordError && !resetConfirmPasswordError ? <p className="auth-error">{errorMessage}</p> : null}

        <div className="auth-button-row">
          <Button
            variant="primary"
            showIcon={resetActionState !== 'default'}
            icon={resetActionState === 'success' ? animatedIcon('success') : resetActionState === 'error' ? animatedIcon('error') : null}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : resetActionState === 'success' ? 'Updated' : resetActionState === 'error' ? 'Try again' : 'Update Password'}
          </Button>
        </div>
      </form>

      <button
        type="button"
        className="auth-inline-link text-body-small-bold-underlined"
        onClick={() => resetModeUiState(AUTH_MODES.SIGN_IN)}
      >
        Back to login
      </button>
    </>
  );

  return (
    <main className="auth-page">
      <section className="auth-card">
        {mode === AUTH_MODES.SIGN_IN ? renderSignInContent() : null}
        {mode === AUTH_MODES.SIGN_UP ? renderSignUpContent() : null}
        {mode === AUTH_MODES.VERIFY_EMAIL ? renderVerifyContent() : null}
        {mode === AUTH_MODES.FORGOT_PASSWORD ? renderForgotPasswordContent() : null}
        {mode === AUTH_MODES.RESET_PASSWORD ? renderResetPasswordContent() : null}
      </section>
    </main>
  );
}
