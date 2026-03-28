import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { dataClient, setDataJWT, clearDataJWT } from '../lib/dataClient';

const authClient = dataClient.auth;

const AuthContext = createContext(null);

// Safari ITP blocks cross-domain cookies from the Neon Auth server, causing
// getSession() to return null and the Data API to have no JWT for RLS.
//
// Fix:
// 1. After sign-in/signUp, call the server-side proxy (/api/auth/jwt) with
//    result.data.token (raw session ID). The proxy calls /get-session on the
//    Neon Auth server — no ITP restriction server-side — and extracts the JWT
//    from the set-auth-jwt response header.
// 2. Save the JWT in localStorage (miri-jwt-v1) and restore it on page reload
//    via setDataJWT() so data queries can authenticate immediately.
//
// NOTE: result.data.session.token after sign-in is the RAW session token, not
// a JWT. The SDK only replaces it with a JWT during getSession() responses
// (onSuccess hook). That's why we need the proxy for the initial JWT.
const SESSION_STORAGE_KEY = 'miri-session-v1';
const JWT_STORAGE_KEY = 'miri-jwt-v1';

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days fallback

// --- Session storage ---

function saveSessionToStorage(data) {
  if (!data?.user) return;
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
  } catch (_e) {
    // localStorage unavailable (e.g. private browsing with restrictions)
  }
}

function loadSessionFromStorage() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    if (!stored?.user) return null;
    const expiresAt = stored.session?.expiresAt;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    if (!expiresAt && stored.savedAt && Date.now() - stored.savedAt > SESSION_TTL_MS) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return { user: stored.user, session: stored.session ?? { token: null } };
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

// --- JWT storage ---

function jwtExpiresAt(jwt) {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch (_e) {
    return null;
  }
}

function saveJWTToStorage(jwt) {
  if (!jwt) return;
  try {
    localStorage.setItem(JWT_STORAGE_KEY, jwt);
  } catch (_e) {
    // ignore
  }
}

function loadJWTFromStorage() {
  try {
    const jwt = localStorage.getItem(JWT_STORAGE_KEY);
    if (!jwt) return null;
    const exp = jwtExpiresAt(jwt);
    if (exp && exp < Date.now()) {
      localStorage.removeItem(JWT_STORAGE_KEY);
      return null;
    }
    return jwt;
  } catch (_e) {
    return null;
  }
}

function clearJWTFromStorage() {
  try {
    localStorage.removeItem(JWT_STORAGE_KEY);
  } catch (_e) {
    // ignore
  }
}

// --- Helpers ---

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getErrorMessage(result, fallbackMessage) {
  if (!result?.error) return null;
  return result.error.message || fallbackMessage;
}

/**
 * Exchange a raw Better Auth session token for a Neon JWT via our server-side
 * proxy. The proxy calls the Neon Auth server without ITP restrictions and
 * reads the JWT from the set-auth-jwt response header.
 *
 * Pass result.data.token (the raw session ID), NOT session.token which the
 * SDK overwrites with a JWT during getSession() responses.
 */
async function fetchJWT(rawSessionToken) {
  if (!rawSessionToken) return null;
  try {
    const res = await fetch('/api/auth/jwt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken: rawSessionToken }),
    });
    if (!res.ok) return null;
    const { jwt } = await res.json();
    return jwt ?? null;
  } catch {
    return null;
  }
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
      // When getSession() works, session.token IS the JWT (SDK onSuccess hook).
      const jwt = data.session?.token ?? null;
      if (jwt) {
        setDataJWT(jwt);
        saveJWTToStorage(jwt);
      }
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
        // Prefer live API session; fall back to localStorage when cookies
        // are blocked (Safari ITP).
        const data = apiData ?? loadSessionFromStorage();
        if (apiData) {
          saveSessionToStorage(apiData);
        }

        // Restore JWT before setting session so data queries have a token
        // the moment isAuthenticated becomes true.
        if (apiData) {
          // When getSession() works, session.token IS the JWT.
          const jwt = apiData.session?.token ?? null;
          if (jwt && isMounted) {
            setDataJWT(jwt);
            saveJWTToStorage(jwt);
          }
        } else {
          // getSession() failed (Safari ITP) — use cached JWT from localStorage.
          const cachedJWT = loadJWTFromStorage();
          if (cachedJWT && isMounted) {
            setDataJWT(cachedJWT);
          }
        }

        if (isMounted) setSessionData(data);
      } catch (_error) {
        if (!isMounted) return;
        const stored = loadSessionFromStorage();
        const cachedJWT = loadJWTFromStorage();
        if (cachedJWT && isMounted) setDataJWT(cachedJWT);
        if (isMounted) setSessionData(stored);
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
    if (result?.data?.user) {
      const data = {
        user: result.data.user,
        session: result.data.session ?? { token: null },
      };
      const rawToken = result.data.token ?? result.data.session?.token ?? null;
      // DEBUG: log sign-in response structure to diagnose Safari ITP issue
      console.log('[auth:signIn] result.data.token:', result.data.token);
      console.log('[auth:signIn] result.data.session:', JSON.stringify(result.data.session));
      console.log('[auth:signIn] rawToken:', rawToken);
      if (rawToken) {
        const jwt = await fetchJWT(rawToken);
        console.log('[auth:signIn] proxy jwt:', jwt ? jwt.substring(0, 20) + '...' : null);
        if (jwt) {
          setDataJWT(jwt);
          saveJWTToStorage(jwt);
        }
      }
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
    if (result?.data?.user) {
      const data = {
        user: result.data.user,
        session: result.data.session ?? { token: null },
      };
      const rawToken = result.data.token ?? result.data.session?.token ?? null;
      if (rawToken) {
        const jwt = await fetchJWT(rawToken);
        if (jwt) {
          setDataJWT(jwt);
          saveJWTToStorage(jwt);
        }
      }
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
    if (result?.data?.user) {
      const data = {
        user: result.data.user,
        session: result.data.session ?? { token: null },
      };
      const rawToken = result.data.token ?? result.data.session?.token ?? null;
      if (rawToken) {
        const jwt = await fetchJWT(rawToken);
        if (jwt) {
          setDataJWT(jwt);
          saveJWTToStorage(jwt);
        }
      }
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
    clearJWTFromStorage();
    clearDataJWT();
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
    clearJWTFromStorage();
    clearDataJWT();
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
