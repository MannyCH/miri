import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavigationBarConnected } from '../components/NavigationBar/NavigationBarConnected';
import './AccountPage.css';

export function AccountPage() {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setErrorMessage('');
    try {
      await signOut();
    } catch (error) {
      setErrorMessage(error.message || 'Could not sign out.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="account-page">
      <section className="account-content">
        <section className="account-card">
          <h1 className="account-title">Account</h1>
          <p className="account-email">{user?.email}</p>
          <p className="account-name">{user?.name || 'No name set'}</p>

          {errorMessage ? <p className="account-error">{errorMessage}</p> : null}

          <button
            type="button"
            className="account-signout"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </button>
        </section>
      </section>

      <section className="account-navigation">
        <NavigationBarConnected activeItem="account" />
      </section>
    </main>
  );
}
