import React from 'react';
import { NavItem } from '../NavItem';
import './NavigationBar.css';

/**
 * NavigationBar component - Exactly as designed in Figma
 * Bottom navigation with 4 items
 */
export const NavigationBar = ({ 
  activeItem = 'shopping-list',
  onItemClick,
  ...props 
}) => {
  return (
    <nav className="navigation-bar" {...props}>
      <NavItem 
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        }
        state={activeItem === 'recipes' ? 'pressed' : 'default'}
        onClick={() => onItemClick?.('recipes')}
      >
        Recipes
      </NavItem>
      
      <NavItem 
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        }
        state={activeItem === 'planning' ? 'pressed' : 'default'}
        onClick={() => onItemClick?.('planning')}
      >
        Planning
      </NavItem>
      
      <NavItem 
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        }
        state={activeItem === 'shopping-list' ? 'pressed' : 'default'}
        onClick={() => onItemClick?.('shopping-list')}
      >
        Shopping list
      </NavItem>
      
      <NavItem 
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        }
        state={activeItem === 'account' ? 'pressed' : 'default'}
        onClick={() => onItemClick?.('account')}
      >
        Account
      </NavItem>
    </nav>
  );
};

NavigationBar.displayName = 'NavigationBar';
