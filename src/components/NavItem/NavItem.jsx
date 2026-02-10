import React from 'react';
import { Button } from '@base-ui/react/button';
import './NavItem.css';

/**
 * NavItem component - Exactly as designed in Figma
 * Navigation item with icon and text, 2 states: Default and Pressed
 * Built with Base UI Button for accessibility
 */
export const NavItem = ({ 
  icon,
  showIcon = true,
  children = 'Recipes',
  state = 'default',
  ...props 
}) => {
  return (
    <Button 
      className={`nav-item nav-item-${state}`}
      {...props}
    >
      {showIcon && icon && (
        <span className="nav-item-icon">
          {icon}
        </span>
      )}
      <span className="nav-item-text">{children}</span>
    </Button>
  );
};

NavItem.displayName = 'NavItem';
