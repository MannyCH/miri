import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './ShareListSheet.css';

/**
 * ShareListSheet — Bottom sheet for sharing the shopping list.
 *
 * Props:
 *   isOpen          – controls visibility
 *   onClose()       – called when backdrop tapped or Escape pressed
 *   onShare(email)  – called with the invitee email; returns a promise
 *   isSharedList    – true when currently viewing another user's list
 *   onLeave()       – called when user wants to leave the shared list
 *   sharedWith      – array of { invitee_email, status } for owner view
 */
export function ShareListSheet({ isOpen, onClose, onShare, isSharedList, onLeave, sharedWith = [] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleShare = async () => {
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await onShare?.(email.trim());
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message ?? 'Could not send invite');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="share-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Share shopping list"
            className="share-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="share-sheet-handle" aria-hidden="true" />

            {isSharedList ? (
              <>
                <h2 className="text-h3-bold share-sheet-title">Shared List</h2>
                <p className="text-body-regular share-sheet-description">
                  You are viewing a shared list. Your changes sync in real time.
                </p>
                <button
                  type="button"
                  className="share-sheet-leave-btn text-body-regular"
                  onClick={() => { onLeave?.(); onClose?.(); }}
                >
                  Leave shared list
                </button>
              </>
            ) : (
              <>
                <h2 className="text-h3-bold share-sheet-title">Share List</h2>
                <p className="text-body-regular share-sheet-description">
                  Invite someone to view and edit your shopping list together.
                </p>

                <div className="share-sheet-input-row">
                  <input
                    type="email"
                    className="text-body-regular share-sheet-input"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                    aria-label="Invitee email"
                    disabled={status === 'loading'}
                  />
                  <button
                    type="button"
                    className="share-sheet-send-btn text-body-regular"
                    onClick={handleShare}
                    disabled={!email.trim() || status === 'loading'}
                  >
                    {status === 'loading' ? 'Sending…' : 'Invite'}
                  </button>
                </div>

                {status === 'success' && (
                  <p className="text-body-small-regular share-sheet-feedback share-sheet-feedback--success">
                    Invite sent! Share the link with them to accept.
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-body-small-regular share-sheet-feedback share-sheet-feedback--error">
                    {errorMsg}
                  </p>
                )}

                {sharedWith.length > 0 && (
                  <div className="share-sheet-members">
                    <h3 className="text-tiny-bold share-sheet-members-title">SHARED WITH</h3>
                    <ul className="share-sheet-members-list">
                      {sharedWith.map((share) => (
                        <li key={share.invitee_email} className="share-sheet-member-row">
                          <span className="text-body-regular share-sheet-member-email">
                            {share.invitee_email}
                          </span>
                          <span className={`text-body-small-regular share-sheet-member-status share-sheet-member-status--${share.status}`}>
                            {share.status === 'accepted' ? 'Active' : 'Pending'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

ShareListSheet.displayName = 'ShareListSheet';
