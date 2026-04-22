import React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import './Chip.css';

export const Chip = ({
  children,
  active = false,
  showClose = false,
  onClick,
  disabled = false,
  ...props
}) => (
  <BaseButton
    className={`chip text-body-small-regular${active ? ' chip--active' : ''}`}
    aria-pressed={active}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
    {showClose && <span className="chip-close" aria-hidden="true">×</span>}
  </BaseButton>
);

Chip.displayName = 'Chip';
