import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import './ShareSheet.css';

/**
 * ShareSheet — Bottom sheet for sharing a shopping list.
 * Shows copy link + native share actions, plus a members list with remove.
 *
 * Props:
 *   isOpen            – controls visibility
 *   onClose()         – backdrop tap or Escape
 *   listName          – name of the list being shared
 *   members           – array of { id, name?, isSelf? }
 *   onCopyLink()      – copy invite link action
 *   onNativeShare()   – native OS share sheet action
 *   onRemoveMember(id) – remove a member
 */
export function ShareSheet({
  isOpen,
  onClose,
  listName = '',
  members = [],
  onCopyLink,
  onNativeShare,
  onRemoveMember,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
            aria-label={`Share ${listName}`}
            className="share-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="share-sheet-handle" aria-hidden="true" />
            <h2 className="text-h3-bold share-sheet-title">
              Share &ldquo;{listName}&rdquo;
            </h2>
            <p className="text-body-small-regular share-sheet-description">
              Anyone with the link can view and edit this list.
            </p>

            <div className="share-sheet-actions">
              <Button
                variant="primary"
                icon={<LinkIcon />}
                onClick={onCopyLink}
              >
                Copy link
              </Button>
              {typeof navigator?.share === 'function' && (
                <Button
                  variant="secondary"
                  icon={<ShareIcon />}
                  onClick={onNativeShare}
                >
                  Share...
                </Button>
              )}
            </div>

            {members.length > 0 && (
              <div className="share-sheet-members">
                <h3 className="text-body-small-bold share-sheet-members-label">Members</h3>
                <ul className="share-sheet-members-list" role="list">
                  {members.map((member) => (
                    <li key={member.id} className="share-sheet-member">
                      <div className="share-sheet-member-avatar">
                        <span className="text-tiny-bold">{getInitials(member.name)}</span>
                      </div>
                      <span className="share-sheet-member-name text-body-regular">
                        {member.name || 'Unknown'}
                        {member.isSelf && (
                          <span className="share-sheet-member-self text-body-small-regular"> (you)</span>
                        )}
                      </span>
                      {!member.isSelf && onRemoveMember && (
                        <button
                          type="button"
                          className="share-sheet-member-remove"
                          onClick={() => onRemoveMember(member.id)}
                          aria-label={`Remove ${member.name || 'member'}`}
                        >
                          <CloseIcon />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

ShareSheet.displayName = 'ShareSheet';
