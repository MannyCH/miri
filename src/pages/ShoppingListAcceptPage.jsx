import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * /shopping-list/accept?token=<invite-token>
 * Accepts a shared list invite and redirects to /shopping-list.
 */
export function ShoppingListAcceptPage() {
  const [searchParams] = useSearchParams();
  const { acceptSharedList } = useApp();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setErrorMsg('No invite token found in the link.');
      return;
    }

    acceptSharedList(token)
      .then(() => navigate('/shopping-list', { replace: true }))
      .catch((err) => {
        setStatus('error');
        setErrorMsg(err.message ?? 'Could not accept the invite.');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p className="text-body-regular">Accepting invite…</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 'var(--spacing-16)', padding: 'var(--spacing-24)' }}>
      <p className="text-body-regular">{errorMsg}</p>
      <button
        type="button"
        className="text-body-regular"
        onClick={() => navigate('/shopping-list', { replace: true })}
      >
        Go to shopping list
      </button>
    </div>
  );
}
