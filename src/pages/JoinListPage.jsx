import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import * as listApi from '../lib/shoppingListApi';
import './JoinListPage.css';

/**
 * /join/:token — Accept-or-decline screen when a user opens a share link.
 * Shows the list name, item count, and lets the user join (optionally merging
 * their current solo list into the shared one).
 */
export function JoinListPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { lists, loadLists, showToast, switchList } = useApp();

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    listApi.fetchJoinInfo(token)
      .then((data) => {
        if (cancelled) return;
        setInfo(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  const handleJoin = async (merge) => {
    setJoining(true);
    try {
      // If merging, use current solo list (first non-shared list with 1 member)
      const soloList = merge
        ? lists.find((l) => l.member_count === 1)
        : null;

      const { listId } = await listApi.joinList(token, soloList?.id || null);
      await loadLists();
      switchList(listId);
      showToast('success', `Joined "${info.listName}"`);
      navigate('/shopping-list', { replace: true });
    } catch (err) {
      showToast('error', err.message || 'Could not join list');
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="join-page">
        <div className="join-card">
          <p className="text-body-regular">Loading invite…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="join-page">
        <div className="join-card">
          <h2 className="text-h3-bold">Invalid Invite</h2>
          <p className="text-body-regular join-error">{error}</p>
          <button className="join-btn join-btn--secondary" onClick={() => navigate('/shopping-list', { replace: true })}>
            Go to Shopping List
          </button>
        </div>
      </div>
    );
  }

  if (info.alreadyMember) {
    return (
      <div className="join-page">
        <div className="join-card">
          <h2 className="text-h3-bold">Already a Member</h2>
          <p className="text-body-regular">You're already on "{info.listName}".</p>
          <button
            className="join-btn join-btn--primary"
            onClick={() => {
              switchList(info.listId);
              navigate('/shopping-list', { replace: true });
            }}
          >
            Open List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <h2 className="text-h3-bold">Join Shopping List</h2>
        <p className="text-body-regular join-list-name">"{info.listName}"</p>
        <p className="text-caption-regular join-meta">
          {info.itemCount} item{info.itemCount !== 1 ? 's' : ''}
        </p>

        <div className="join-actions">
          <button
            className="join-btn join-btn--primary"
            disabled={joining}
            onClick={() => handleJoin(false)}
          >
            {joining ? 'Joining…' : 'Join List'}
          </button>
          {lists.some((l) => l.member_count === 1) && (
            <button
              className="join-btn join-btn--secondary"
              disabled={joining}
              onClick={() => handleJoin(true)}
            >
              Join & Merge My Items
            </button>
          )}
          <button
            className="join-btn join-btn--ghost"
            disabled={joining}
            onClick={() => navigate('/shopping-list', { replace: true })}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
