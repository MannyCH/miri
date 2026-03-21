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
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [acceptLink, setAcceptLink] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setErrorMsg('');
      setAcceptLink('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleGetLink = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const result = await onShare?.();
      if (result?.token) {
        setAcceptLink(`${window.location.origin}/shopping-list/accept?token=${result.token}`);
      }
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message ?? 'Could not create link');
    }
  };

  const handleCopyLink = () => {
    if (navigator.share) {
      navigator.share({ url: acceptLink }).catch(() => {});
    } else {
      navigator.clipboard.writeText(acceptLink).catch(() => {});
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
                  Create a link and send it via WhatsApp, iMessage, or any app.
                </p>

                {status !== 'success' && (
                  <button
                    type="button"
                    className="share-sheet-send-btn text-body-regular"
                    onClick={handleGetLink}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Creating…' : 'Create invite link'}
                  </button>
                )}

                {status === 'success' && acceptLink && (
                  <div className="share-sheet-link-row">
                    <span className="text-body-small-regular share-sheet-link">{acceptLink}</span>
                    <button
                      type="button"
                      className="share-sheet-copy-btn text-body-small-regular"
                      onClick={handleCopyLink}
                    >
                      {navigator.share ? 'Share' : 'Copy'}
                    </button>
                  </div>
                )}

                {status === 'error' && (
                  <p className="text-body-small-regular share-sheet-feedback share-sheet-feedback--error">
                    {errorMsg}
                  </p>
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
