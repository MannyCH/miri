import React from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import './Button.css';

/**
 * Button component based on Miri design system
 * Built with Base UI for accessibility and composability
 */
export const Button = ({
  variant = 'primary',
  icon,
  showIcon = true,
  iconOnly = false,
  children,
  ...props
}) => {
  const variantClass = `button-${variant.toLowerCase().replace(' - ', '-')}`;

  return (
    <BaseButton
      className={`button ${variantClass}${iconOnly ? ' button--icon-only' : ''}`}
      {...props}
    >
      {(showIcon || iconOnly) && icon && (
        <span className="button-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {!iconOnly && <span className="button-text text-body-small-bold">{children}</span>}
    </BaseButton>
  );
};

Button.displayName = 'Button';
