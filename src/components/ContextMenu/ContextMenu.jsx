import React, { useState, useRef, useEffect } from 'react';
import './ContextMenu.css';

/**
 * ContextMenu — Dropdown menu anchored to a three-dot trigger button.
 * Closes on outside click or Escape. Supports destructive items and separators.
 *
 * Props:
 *   items      – array of { label, icon?, destructive?, disabled?, onAction() } or '---' for separator
 *   ariaLabel  – accessible label for the trigger button (default: 'More options')
 */
export function ContextMenu({ items = [], ariaLabel = 'More options' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleAction = (action) => {
    setOpen(false);
    action?.();
  };

  return (
    <div className="context-menu-wrapper" ref={wrapperRef}>
      <button
        type="button"
        className="context-menu-trigger"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreIcon />
      </button>
      {open && (
        <div className="context-menu" role="menu">
          {items.map((item, index) => {
            if (item === '---') {
              return <div key={`sep-${index}`} className="context-menu-separator" role="separator" />;
            }
            return (
              <button
                key={item.label}
                type="button"
                className={`context-menu-item text-body-base-regular${item.destructive ? ' context-menu-item--destructive' : ''}`}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleAction(item.onAction)}
              >
                {item.icon && (
                  <span className="context-menu-item-icon" aria-hidden="true">{item.icon}</span>
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

ContextMenu.displayName = 'ContextMenu';
