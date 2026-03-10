import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'react-feather';
import { Button } from '../Button/Button';
import { Divider } from '../Divider/Divider';
import './AccountCard.css';

export function AccountCard({
  name,
  email,
  onLogOut,
  onChangeUserDetails,
  onChangePassword,
  onDeleteAccount,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="account-card">
      <div className="account-card-user-row">
        <div className="account-card-user-info">
          <span className="account-card-name text-body-bold">{name}</span>
          <span className="account-card-email text-body-small-regular">{email}</span>
        </div>
        <div className="account-card-actions">
          <Button variant="secondary" onClick={onLogOut}>
            Log out
          </Button>
        </div>
      </div>

      <button
        type="button"
        className="account-card-expand-row"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDown size={20} className="account-card-chevron" aria-hidden="true" />
        ) : (
          <ChevronRight size={20} className="account-card-chevron" aria-hidden="true" />
        )}
        <span className="text-body-small-bold">Account</span>
      </button>

      {isExpanded ? (
        <div className="account-card-expanded">
          <Divider />
          <button type="button" className="account-card-action-row" onClick={onChangeUserDetails}>
            <span className="text-body-small-regular">Change user details</span>
            <ChevronRight size={20} className="account-card-chevron" aria-hidden="true" />
          </button>
          <Divider />
          <button type="button" className="account-card-action-row" onClick={onChangePassword}>
            <span className="text-body-small-regular">Change password</span>
            <ChevronRight size={20} className="account-card-chevron" aria-hidden="true" />
          </button>
          <Divider />
          <button type="button" className="account-card-action-row account-card-action-row--delete" onClick={onDeleteAccount}>
            <span className="text-body-small-regular">Delete Account</span>
            <ChevronRight size={20} className="account-card-chevron" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

AccountCard.displayName = 'AccountCard';
