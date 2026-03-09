import React, { useMemo, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button/Button';
import './AuthPage.css';

const AUTH_MODES = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  VERIFY_EMAIL: 'verify-email',
};
const OTP_LENGTH = 6;

export function AuthPage() {
  const [params] = useSearchParams();
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
    if (tokenFromUrl) {
      return AUTH_MODES.RESET_PASSWORD;
    }
    return AUTH_MODES.SIGN_IN;
  }, [params]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearFeedback();

    try {
      if (mode === AUTH_MODES.SIGN_IN) {
        await signIn({ email, password });
        return;
      }

      if (mode === AUTH_MODES.SIGN_UP) {
        await signUp({ name, email, password });
        setMessage('Account created. Enter your email code to verify.');
        setVerifyEmailAddress(email);
        setMode(AUTH_MODES.VERIFY_EMAIL);
        setPassword('');
        return;
      }

      if (mode === AUTH_MODES.FORGOT_PASSWORD) {
        await requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/auth?mode=reset-password`,
        });
        setMessage('Password reset email sent.');
        return;
      }

      if (mode === AUTH_MODES.RESET_PASSWORD) {
        if (!verifyToken) {
          throw new Error('Missing reset token. Open the reset link from your email again.');
        }
        if (newPassword !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await resetPassword({ token: verifyToken, newPassword });
        setMessage('Password updated. You can now sign in.');
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

        await verifyEmail({
          token: verifyToken,
          email: verifyEmailAddress,
          code: verificationCode,
        });
        setMessage('Email verified. You can now sign in.');
        setMode(AUTH_MODES.SIGN_IN);
        return;
      }
    } catch (error) {
      const authErrorMessage = error.message || 'Authentication failed.';
      if (mode === AUTH_MODES.SIGN_IN && /email not verified/i.test(authErrorMessage)) {
        setMode(AUTH_MODES.VERIFY_EMAIL);
        setVerifyEmailAddress(email);
        setMessage('Enter the verification code from your email.');
        setErrorMessage('');
      } else {
        setErrorMessage(authErrorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    clearFeedback();
    setIsResendingCode(true);
    try {
      if (!verifyEmailAddress) {
        throw new Error('Enter your email first.');
      }
      await sendVerificationCode({ email: verifyEmailAddress });
      setMessage('Verification code sent.');
    } catch (error) {
      setErrorMessage(error.message || 'Could not send verification code.');
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleCodeDigitChange = (index, value) => {
    const lastTypedChar = value.slice(-1);
    if (lastTypedChar && !/^\d$/.test(lastTypedChar)) {
      return;
    }

    const nextChars = verificationCode.padEnd(OTP_LENGTH, ' ').split('');
    nextChars[index] = lastTypedChar || ' ';
    const nextCode = nextChars.join('').trimEnd();
    setVerificationCode(nextCode);

    if (lastTypedChar && index < OTP_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const renderSignInContent = () => (
    <>
      <h1 className="auth-title text-h2-bold">Log in to Miri</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="text-body-small-regular">Email</span>
          <input
            type="email"
            className="text-body-regular"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="auth-field">
          <span className="text-body-small-regular">Password</span>
          <input
            type="password"
            className="text-body-regular"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <div className="auth-field-meta">
          <button
            type="button"
            className="auth-field-link text-tiny-regular"
            onClick={() => { clearFeedback(); setMode(AUTH_MODES.FORGOT_PASSWORD); }}
          >
            Forgot password?
          </button>
        </div>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        {message ? <p className="auth-message">{message}</p> : null}

        <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : 'Continue'}
        </Button>
      </form>

      <p className="auth-footer-copy text-body-small-regular">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          className="auth-footer-link text-body-small-bold-underlined"
          onClick={() => { clearFeedback(); setMode(AUTH_MODES.SIGN_UP); }}
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

      {!verifyEmailAddress ? (
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            className="text-body-regular"
            value={verifyEmailAddress}
            onChange={(event) => setVerifyEmailAddress(event.target.value)}
            autoComplete="email"
            required
          />
        </label>
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
            />
          ))}
        </div>

        {hasTokenParam ? (
          <label className="auth-field">
            <span>Verification token</span>
            <input
              type="text"
              className="text-body-regular"
              value={verifyToken}
              onChange={(event) => setVerifyToken(event.target.value)}
            />
          </label>
        ) : null}

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        {message ? <p className="auth-message">{message}</p> : null}

        <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Continue'}
        </Button>
      </form>

      <button
        type="button"
        className="auth-inline-link text-tiny-regular"
        onClick={handleResendCode}
        disabled={isResendingCode}
      >
        {isResendingCode ? 'Sending code...' : 'Resend code'}
      </button>
      <button
        type="button"
        className="auth-inline-link text-body-small-bold-underlined"
        onClick={() => { clearFeedback(); setMode(AUTH_MODES.SIGN_IN); }}
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
        <label className="auth-field">
          <span className="text-body-small-regular">Name</span>
          <input
            type="text"
            className="text-body-regular"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
          />
        </label>

        <label className="auth-field">
          <span className="text-body-small-regular">Email</span>
          <input
            type="email"
            className="text-body-regular"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="auth-field">
          <span className="text-body-small-regular">Password</span>
          <input
            type="password"
            className="text-body-regular"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        {message ? <p className="auth-message">{message}</p> : null}

        <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : 'Create account'}
        </Button>
      </form>

    </>
  );

  const renderForgotPasswordContent = () => (
    <>
      <h1 className="auth-title text-h2-bold">Forgot password</h1>
      <p className="auth-subtitle text-body-regular">We&apos;ll send a reset link to your email.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="text-body-small-regular">Email</span>
          <input
            type="email"
            className="text-body-regular"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        {message ? <p className="auth-message">{message}</p> : null}

        <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : 'Send reset email'}
        </Button>
      </form>

      <button
        type="button"
        className="auth-inline-link"
        onClick={() => { clearFeedback(); setMode(AUTH_MODES.SIGN_IN); }}
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
        <label className="auth-field">
          <span className="text-body-small-regular">New password</span>
          <input
            type="password"
            className="text-body-regular"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        <label className="auth-field">
          <span className="text-body-small-regular">Retype password</span>
          <input
            type="password"
            className="text-body-regular"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
        {message ? <p className="auth-message">{message}</p> : null}

        <Button variant="primary" showIcon={false} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : 'Update password'}
        </Button>
      </form>

      <button
        type="button"
        className="auth-inline-link"
        onClick={() => { clearFeedback(); setMode(AUTH_MODES.SIGN_IN); }}
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
