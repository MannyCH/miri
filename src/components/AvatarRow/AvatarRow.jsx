import React from 'react';
import './AvatarRow.css';

/**
 * AvatarRow — Horizontal row of member avatars with overflow indicator and invite button.
 * Shows up to `maxVisible` avatars, then "+N" for the rest. A "+" button triggers sharing.
 *
 * Props:
 *   members       – array of { id, name?, avatarUrl? }
 *   maxVisible    – max avatars to show before "+N" (default: 3)
 *   onInvite()    – called when "+" button is tapped
 */
export function AvatarRow({ members = [], maxVisible = 3, onInvite }) {
  if (members.length < 2) return null;

  const visible = members.slice(0, maxVisible);
  const overflow = members.length - maxVisible;

  return (
    <div className="avatar-row" aria-label={`${members.length} members`}>
      {visible.map((member) => (
        <div
          key={member.id}
          className="avatar-row-item"
          title={member.name || undefined}
          aria-label={member.name || 'Member'}
        >
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.name || 'Member'}
              className="avatar-row-img"
            />
          ) : (
            <span className="avatar-row-initials text-tiny-bold">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      ))}
      {overflow > 0 && (
        <div className="avatar-row-item avatar-row-overflow" aria-label={`${overflow} more members`}>
          <span className="text-tiny-bold">+{overflow}</span>
        </div>
      )}
      {onInvite && (
        <button
          type="button"
          className="avatar-row-invite"
          onClick={onInvite}
          aria-label="Invite member"
        >
          <PlusIcon />
        </button>
      )}
    </div>
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

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

AvatarRow.displayName = 'AvatarRow';
