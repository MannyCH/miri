import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dataClient } from '../lib/dataClient';

// Use dataClient.auth as the single auth client so it shares the same session
// as all Data API requests. Having a separate authClient causes two different
// user IDs to be issued by the different adapters, breaking RLS.
const authClient = dataClient.auth;

const AuthContext = createContext(null);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getErrorMessage(result, fallbackMessage) {
  if (!result?.error) return null;
  return result.error.message || fallbackMessage;
}

export function AuthProvider({ children }) {
  const [sessionData, setSessionData] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const refreshSession = useCallback(async () => {
    const result = await authClient.getSession();
    setSessionData(result?.data ?? null);
    return result?.data ?? null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const result = await authClient.getSession();
        if (!isMounted) return;
        setSessionData(result?.data ?? null);
      } catch (_error) {
        if (!isMounted) return;
        setSessionData(null);
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const result = await authClient.signIn.email({
      email: normalizeEmail(email),
      password,
    });
    const message = getErrorMessage(result, 'Sign-in failed.');
    if (message) {
      throw new Error(message);
    }
    await refreshSession();
    return result?.data ?? null;
  }, [refreshSession]);

  const signUp = useCallback(async ({ email, password, name }) => {
    const result = await authClient.signUp.email({
      email: normalizeEmail(email),
      password,
      name,
    });
    const message = getErrorMessage(result, 'Sign-up failed.');
    if (message) {
      throw new Error(message);
    }
    await refreshSession();
    return result?.data ?? null;
  }, [refreshSession]);

  const verifyEmail = useCallback(async ({ token, email, code }) => {
    const hasOtpMethod = Boolean(authClient.emailOtp?.verifyEmail);
    let result;

    if (hasOtpMethod && email && code) {
      result = await authClient.emailOtp.verifyEmail({
        email: normalizeEmail(email),
        otp: code,
      });
    } else if (token) {
      result = await authClient.verifyEmail({
        query: {
          token,
        },
      });
    } else {
      throw new Error('Missing verification token or code.');
    }

    const message = getErrorMessage(result, 'Email verification failed.');
    if (message) {
      throw new Error(message);
    }
    await refreshSession();
    return result?.data ?? null;
  }, [refreshSession]);

  const sendVerificationCode = useCallback(async ({ email }) => {
    const hasOtpMethod = Boolean(authClient.emailOtp?.sendVerificationOtp);
    let result;

    if (hasOtpMethod) {
      result = await authClient.emailOtp.sendVerificationOtp({
        email: normalizeEmail(email),
        type: 'email-verification',
      });
    } else {
      result = await authClient.sendVerificationEmail({
        email: normalizeEmail(email),
      });
    }

    const message = getErrorMessage(result, 'Could not send verification code.');
    if (message) {
      throw new Error(message);
    }
    return result?.data ?? null;
  }, []);

  const requestPasswordReset = useCallback(async ({ email, redirectTo }) => {
    const result = await authClient.requestPasswordReset({
      email: normalizeEmail(email),
      ...(redirectTo ? { redirectTo } : {}),
    });
    const message = getErrorMessage(result, 'Password reset request failed.');
    if (message) {
      throw new Error(message);
    }
    return result?.data ?? null;
  }, []);

  const resetPassword = useCallback(async ({ token, newPassword }) => {
    const result = await authClient.resetPassword({
      token,
      newPassword,
    });
    const message = getErrorMessage(result, 'Password reset failed.');
    if (message) {
      throw new Error(message);
    }
    return result?.data ?? null;
  }, []);

  const signOut = useCallback(async () => {
    const result = await authClient.signOut();
    const message = getErrorMessage(result, 'Sign-out failed.');
    if (message) {
      throw new Error(message);
    }
    setSessionData(null);
  }, []);

  const updateUser = useCallback(async ({ name, email }) => {
    const result = await authClient.updateUser({ name, email });
    const message = getErrorMessage(result, 'Could not update user details.');
    if (message) throw new Error(message);
    await refreshSession();
    return result?.data ?? null;
  }, [refreshSession]);

  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: false });
    const message = getErrorMessage(result, 'Could not change password.');
    if (message) throw new Error(message);
    return result?.data ?? null;
  }, []);

  const verifyCurrentPassword = useCallback(async ({ password }) => {
    const result = await authClient.verifyPassword({ password });
    const message = getErrorMessage(result, 'Could not verify current password.');
    if (message) throw new Error(message);

    const verified = typeof result?.data === 'boolean' ? result.data : result?.data?.verified;
    if (verified === false) {
      throw new Error('Incorrect password. Please try again.');
    }
    return result?.data ?? null;
  }, []);

  const changeEmail = useCallback(async ({ newEmail }) => {
    const result = await authClient.changeEmail({
      newEmail,
      callbackURL: `${window.location.origin}/account`,
    });
    const message = getErrorMessage(result, 'Could not initiate email change.');
    if (message) throw new Error(message);
    return result?.data ?? null;
  }, []);

  const deleteUser = useCallback(async () => {
    // authClient.deleteUser() returns 404 on the Neon Auth hosted instance
    // because that endpoint is not exposed. Use our own API route instead.
    const { data: sessionData } = await authClient.getSession();
    const token = sessionData?.session?.token;
    if (!token) throw new Error('Not authenticated');

    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Could not delete account.');
    }
    setSessionData(null);
  }, []);

  const value = useMemo(() => {
    const user = sessionData?.user ?? null;
    const session = sessionData?.session ?? null;

    return {
      user,
      session,
      isAuthReady,
      isAuthenticated: Boolean(user && session),
      refreshSession,
      signIn,
      signUp,
      verifyEmail,
      sendVerificationCode,
      requestPasswordReset,
      resetPassword,
      signOut,
      updateUser,
      changePassword,
      verifyCurrentPassword,
      changeEmail,
      deleteUser,
    };
  }, [isAuthReady, refreshSession, sessionData, signIn, signOut, signUp, verifyEmail, sendVerificationCode, requestPasswordReset, resetPassword, updateUser, changePassword, verifyCurrentPassword, changeEmail, deleteUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
