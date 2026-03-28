import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dataClient } from '../lib/dataClient';

// Use dataClient.auth as the single auth client so it shares the same session
// as all Data API requests. Having a separate authClient causes two different
// user IDs to be issued by the different adapters, breaking RLS.
const authClient = dataClient.auth;

const AuthContext = createContext(null);

// Safari ITP blocks cross-domain cookies from the Neon Auth server, causing
// getSession() to return null. We persist session data in localStorage so the
// session survives page reloads. The server is still the source of truth for
// new sign-ins; this only affects the bootstrap check on reload.
const SESSION_STORAGE_KEY = 'miri-session-v1';

function saveSessionToStorage(data) {
  if (!data?.user || !data?.session) return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
  } catch (_e) {
    // localStorage unavailable (e.g. private browsing with restrictions)
  }
}

function loadSessionFromStorage() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.user || !data?.session) return null;
    const expiresAt = data.session?.expiresAt;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return data;
  } catch (_e) {
    return null;
  }
}

function clearSessionFromStorage() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (_e) {
    // ignore
  }
}

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
    const data = result?.data ?? null;
    setSessionData(data);
    if (data) {
      saveSessionToStorage(data);
    }
    return data;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const result = await authClient.getSession();
        if (!isMounted) return;
        const apiData = result?.data ?? null;
        // Prefer the live API session; fall back to localStorage when cookies
        // are blocked (Safari ITP).
        const data = apiData ?? loadSessionFromStorage();
        setSessionData(data);
        if (apiData) {
          saveSessionToStorage(apiData);
        }
      } catch (_error) {
        if (!isMounted) return;
        setSessionData(loadSessionFromStorage());
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
    if (result?.data?.user && result?.data?.session) {
      const data = { user: result.data.user, session: result.data.session };
      setSessionData(data);
      saveSessionToStorage(data);
    } else {
      await refreshSession();
    }
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
    if (result?.data?.user && result?.data?.session) {
      const data = { user: result.data.user, session: result.data.session };
      setSessionData(data);
      saveSessionToStorage(data);
    } else {
      await refreshSession();
    }
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
    if (result?.data?.user && result?.data?.session) {
      const data = { user: result.data.user, session: result.data.session };
      setSessionData(data);
      saveSessionToStorage(data);
    } else {
      await refreshSession();
    }
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
    clearSessionFromStorage();
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
    const result = await authClient.deleteUser();
    const message = getErrorMessage(result, 'Could not delete account.');
    if (message) throw new Error(message);
    clearSessionFromStorage();
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
