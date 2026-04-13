import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
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
  const { lists, loadLists, showToast, switchList, shoppingList, activeListId } = useApp();

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
          <Button variant="secondary" onClick={() => navigate('/shopping-list', { replace: true })}>
            Go to Shopping List
          </Button>
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
          <Button
            variant="primary"
            onClick={() => {
              switchList(info.listId);
              navigate('/shopping-list', { replace: true });
            }}
          >
            Open List
          </Button>
        </div>
      </div>
    );
  }

  // Solo list with items → offer merge choice; empty solo list → just join directly
  // item_count isn't on the lists API, so we check the loaded shoppingList if the
  // solo list is the currently active list (the common case when opening a join link).
  const soloList = lists.find((l) => l.member_count === 1);
  const soloIsActive = soloList?.id === activeListId;
  const soloHasItems = soloList && soloIsActive && shoppingList.length > 0;

  return (
    <div className="join-page">
      <div className="join-card">
        <h2 className="text-h3-bold">Join Shopping List</h2>
        <p className="text-body-regular join-list-name">"{info.listName}"</p>
        <p className="text-caption-regular join-meta">
          {info.itemCount} item{info.itemCount !== 1 ? 's' : ''}
        </p>

        <div className="join-actions">
          {soloHasItems ? (
            <>
              <Button
                variant="primary"
                disabled={joining}
                onClick={() => handleJoin(true)}
              >
                {joining ? 'Joining…' : 'Merge & join'}
              </Button>
              <Button
                variant="text"
                disabled={joining}
                onClick={() => handleJoin(false)}
              >
                Keep mine separate
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              disabled={joining}
              onClick={() => handleJoin(false)}
            >
              {joining ? 'Joining…' : 'Join List'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
