import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './ActionSheet.css';

/**
 * ActionSheet — Bottom sheet with a list of tappable actions.
 * Supports destructive items (styled in red) and separators.
 *
 * Props:
 *   isOpen       – controls visibility
 *   onClose()    – called on backdrop tap or Escape
 *   title        – optional sheet title
 *   items        – array of { label, icon?, destructive?, onAction() } or '---' for separator
 */
export function ActionSheet({ isOpen, onClose, title, items = [] }) {
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
            className="action-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Actions'}
            className="action-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="action-sheet-handle" aria-hidden="true" />
            {title && (
              <h2 className="text-h3-bold action-sheet-title">{title}</h2>
            )}
            <ul className="action-sheet-items" role="list">
              {items.map((item, index) => {
                if (item === '---') {
                  return <li key={`sep-${index}`} className="action-sheet-separator" role="separator" />;
                }
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      className={`action-sheet-item${item.destructive ? ' action-sheet-item--destructive' : ''}`}
                      onClick={() => { item.onAction?.(); onClose?.(); }}
                    >
                      {item.icon && (
                        <span className="action-sheet-item-icon" aria-hidden="true">{item.icon}</span>
                      )}
                      <span className="action-sheet-item-label text-body-regular">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

ActionSheet.displayName = 'ActionSheet';
