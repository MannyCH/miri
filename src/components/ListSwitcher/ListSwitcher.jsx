import React, { useState, useRef, useEffect } from 'react';
import './ListSwitcher.css';

/**
 * ListSwitcher — Tappable list name pill that opens a dropdown to switch between lists.
 * Only shows the chevron and dropdown when the user has 2+ lists.
 *
 * Props:
 *   lists          – array of { id, name, isShared?, memberCount? }
 *   activeListId   – currently active list ID
 *   onSwitch(id)   – called when user picks a different list
 *   onCreateNew()  – called when user taps "+ New list"
 */
export function ListSwitcher({ lists = [], activeListId, onSwitch, onCreateNew }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const hasMultiple = lists.length >= 2;

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

  const activeList = lists.find((l) => l.id === activeListId);
  const displayName = activeList?.name || 'Shopping list';

  return (
    <div className="list-switcher" ref={wrapperRef}>
      <button
        type="button"
        className={`list-switcher-pill${hasMultiple ? ' list-switcher-pill--tappable' : ''}`}
        onClick={hasMultiple ? () => setOpen((prev) => !prev) : undefined}
        aria-expanded={hasMultiple ? open : undefined}
        aria-haspopup={hasMultiple ? 'listbox' : undefined}
        disabled={!hasMultiple}
      >
        <span className="list-switcher-name text-body-small-bold">{displayName}</span>
        {hasMultiple && (
          <ChevronIcon className={`list-switcher-chevron${open ? ' list-switcher-chevron--open' : ''}`} />
        )}
      </button>

      {open && (
        <div className="list-switcher-dropdown" role="listbox" aria-label="Switch list">
          {lists.map((list) => (
            <button
              key={list.id}
              type="button"
              className={`list-switcher-option text-body-base-regular${list.id === activeListId ? ' list-switcher-option--active' : ''}`}
              role="option"
              aria-selected={list.id === activeListId}
              onClick={() => { onSwitch?.(list.id); setOpen(false); }}
            >
              <span className="list-switcher-option-name">{list.name}</span>
              {list.isShared && (
                <span className="list-switcher-option-shared text-tiny-bold">
                  {list.memberCount || 0}
                  <UsersIcon />
                </span>
              )}
              {list.id === activeListId && <CheckIcon />}
            </button>
          ))}
          {onCreateNew && (
            <>
              <div className="list-switcher-separator" role="separator" />
              <button
                type="button"
                className="list-switcher-option list-switcher-option--create text-body-base-regular"
                onClick={() => { onCreateNew?.(); setOpen(false); }}
              >
                <PlusIcon />
                <span>New list</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const ChevronIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UsersIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

ListSwitcher.displayName = 'ListSwitcher';
