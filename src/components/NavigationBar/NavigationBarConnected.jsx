import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationBar } from './NavigationBar';

/**
 * Connected NavigationBar with routing
 * Maps navigation items to app routes
 */
export function NavigationBarConnected({ activeItem: activeItemProp, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Auto-detect active item from current route if not provided
  const getActiveItem = () => {
    if (activeItemProp) return activeItemProp;
    
    if (location.pathname.startsWith('/recipes')) return 'recipes';
    if (location.pathname.startsWith('/planning')) return 'planning';
    if (location.pathname.startsWith('/shopping-list')) return 'shopping-list';
    return 'planning';
  };
  
  const handleItemClick = (item) => {
    switch (item) {
      case 'recipes':
        navigate('/recipes');
        break;
      case 'planning':
        navigate('/planning');
        break;
      case 'shopping-list':
        navigate('/shopping-list');
        break;
      case 'account':
        // TODO: Add account page
        alert('Account page coming soon!');
        break;
      default:
        break;
    }
  };
  
  return (
    <NavigationBar
      activeItem={getActiveItem()}
      onItemClick={handleItemClick}
      {...props}
    />
  );
}
