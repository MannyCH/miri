import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { ShoppingListPage } from './ShoppingListPage';
import * as listApi from '../lib/shoppingListApi';
import './JoinListPage.css';

/**
 * /join/:token — Join dialog shown as an overlay on top of ShoppingListPage.
 * Shows the inviter name, list name, and item count. Lets the user merge their
 * current list, keep it separate, or cancel.
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
      .then((data) => { if (!cancelled) setInfo(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const handleJoin = async (merge) => {
    setJoining(true);
    try {
      const soloList = merge ? lists.find((l) => l.member_count === 1) : null;
      const { listId } = await listApi.joinList(token, soloList?.id || null);
      await loadLists();
      switchList(listId);
      showToast('success', `Joined "${info.list.name}"`);
      navigate('/shopping-list', { replace: true });
    } catch (err) {
      showToast('error', err.message || 'Could not join list');
      setJoining(false);
    }
  };

  const handleCancel = () => navigate('/shopping-list', { replace: true });

  // Solo list with items → offer merge choice; empty solo list → just join
  const soloList = lists.find((l) => l.member_count === 1);
  const soloIsActive = soloList?.id === activeListId;
  const soloHasItems = soloList && soloIsActive && shoppingList.length > 0;

  const renderDialog = () => {
    if (loading) {
      return (
        <div className="join-dialog">
          <p className="text-body-regular join-dialog-loading">Loading invite…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="join-dialog">
          <h3 className="text-h3-bold join-dialog-title">Invalid Invite</h3>
          <p className="text-body-regular join-dialog-message join-dialog-error">{error}</p>
          <div className="join-dialog-actions">
            <Button variant="secondary" onClick={handleCancel}>
              Go to Shopping List
            </Button>
          </div>
        </div>
      );
    }

    if (info?.alreadyMember) {
      return (
        <div className="join-dialog">
          <h3 className="text-h3-bold join-dialog-title">Already a Member</h3>
          <p className="text-body-regular join-dialog-message">
            You're already on "{info.list.name}".
          </p>
          <div className="join-dialog-actions">
            <Button
              variant="primary"
              onClick={() => {
                switchList(info.list.id);
                navigate('/shopping-list', { replace: true });
              }}
            >
              Open List
            </Button>
          </div>
        </div>
      );
    }

    if (info) {
      const sharerLabel = info.inviterName || 'Someone';
      const itemLabel = info.itemCount === 1 ? '1 ingredient' : `${info.itemCount} ingredients`;

      return (
        <div className="join-dialog">
          <div className="join-dialog-header">
            <h3 className="text-h3-bold join-dialog-title">
              {sharerLabel} is sharing a list with you
            </h3>
          </div>
          <p className="text-body-regular join-dialog-message">
            <strong className="text-body-bold">{info.list.name}</strong> contains {itemLabel}.
            {soloHasItems
              ? ' Would you like to merge with your current list or keep it separate?'
              : ' Would you like to join?'}
          </p>
          <div className="join-dialog-actions">
            <Button
              variant="primary"
              disabled={joining}
              onClick={() => handleJoin(soloHasItems)}
            >
              {joining ? 'Joining…' : soloHasItems ? 'Merge & join' : 'Join list'}
            </Button>
            {soloHasItems && (
              <Button
                variant="secondary"
                disabled={joining}
                onClick={() => handleJoin(false)}
              >
                Keep separate
              </Button>
            )}
            <Button variant="text" disabled={joining} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <ShoppingListPage />
      <motion.div
        className="join-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={joining ? undefined : handleCancel}
      >
        <motion.div
          className="join-dialog-wrapper"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {renderDialog()}
        </motion.div>
      </motion.div>
    </>
  );
}
