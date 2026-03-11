import React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import './ChoiceTile.css';

export function ChoiceTile({ label, value, selected = false, onClick }) {
  return (
    <BaseButton
      className={`choice-tile${selected ? ' choice-tile-selected' : ''}`}
      onClick={() => onClick(value)}
      aria-pressed={selected}
    >
      <span className="choice-tile-label text-body-regular">{label}</span>
    </BaseButton>
  );
}

ChoiceTile.displayName = 'ChoiceTile';
