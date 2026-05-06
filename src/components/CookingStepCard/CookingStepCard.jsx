import React from 'react';
import './CookingStepCard.css';

/**
 * CookingStepCard — one action card in cooking mode.
 * Shows an emoji icon, an action verb, a list of involved ingredients (qty + name + optional note),
 * and an optional duration.
 */
export const CookingStepCard = ({
  emoji,
  verb,
  items = [],
  duration = null,
  ...props
}) => {
  return (
    <div className="cooking-step-card" {...props}>
      <div className="cooking-step-card__header">
        <span className="text-h3-bold cooking-step-card__emoji" aria-hidden="true">
          {emoji}
        </span>
        <span className="text-h3-bold cooking-step-card__verb">{verb}</span>
      </div>

      {items.length > 0 && (
        <ul className="cooking-step-card__items" aria-label={`Ingredients for ${verb}`}>
          {items.map((item, i) => (
            <li key={i} className="cooking-step-card__item">
              {(item.qty || item.name) && (
                <span className="text-body-small-bold cooking-step-card__item-primary">
                  {[item.qty, item.name].filter(Boolean).join(' ')}
                </span>
              )}
              {item.note && (
                <span className="text-body-small-regular cooking-step-card__item-note">
                  {item.note}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {duration && (
        <p className="text-body-small-regular cooking-step-card__duration">
          {duration.num} {duration.unit}
        </p>
      )}
    </div>
  );
};

CookingStepCard.displayName = 'CookingStepCard';
