import React from 'react';
import { Divider } from '../Divider';
import './IngredientListItem.css';

/**
 * IngredientListItem component - Exactly as designed in Figma
 * Interactive ingredient item - tap to toggle strikethrough, swipe left to delete
 * Uses role="button" with aria-pressed for accessible toggle state
 */
export const IngredientListItem = ({ 
  children = '2l Milch',
  checked = false,
  onCheckedChange,
  onDelete, // Callback when item is deleted (swipe left)
  showUpperDivider = true,
  showBelowDivider = true,
  ...props 
}) => {
  const [swipeOffset, setSwipeOffset] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const startXRef = React.useRef(0);
  const containerRef = React.useRef(null);

  const SWIPE_THRESHOLD = 100; // Minimum swipe distance to trigger delete

  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startXRef.current - currentX;
    
    // Only allow left swipe (positive diff)
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 120)); // Max 120px swipe
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > SWIPE_THRESHOLD) {
      // Trigger delete
      onDelete?.();
    }
    
    // Reset swipe state
    setSwipeOffset(0);
    setIsSwiping(false);
  };

  // Handle click on entire list item to toggle checkbox
  const handleItemClick = (event) => {
    // Don't toggle if swiping
    if (isSwiping || swipeOffset > 0) {
      return;
    }
    
    // Toggle the checkbox when tapping
    onCheckedChange?.(!checked);
  };

  return (
    <div className="ingredient-list-item">
      {showUpperDivider && <Divider />}
      
      {/* Swipe container wrapper */}
      <div 
        className={`ingredient-list-item-wrapper ${swipeOffset > 0 ? 'is-swiping' : ''}`}
        ref={containerRef}
      >
        {/* Delete button revealed on swipe */}
        <div className="ingredient-list-item-delete-zone">
          <TrashIcon />
        </div>

        {/* Interactive container - supports tap and swipe */}
        <div 
          className={`ingredient-list-item-container ${checked ? 'is-checked' : ''}`}
          style={{
            transform: `translateX(-${swipeOffset}px)`,
            transition: isSwiping ? 'none' : 'transform 0.3s ease'
          }}
          onClick={handleItemClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-pressed={checked}
          aria-label={`${checked ? 'Uncheck' : 'Check'} ${children}`}
          onKeyDown={(e) => {
            // Support keyboard: Space/Enter to toggle
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onCheckedChange?.(!checked);
            }
            // Delete key to remove
            if (e.key === 'Delete' || e.key === 'Backspace') {
              e.preventDefault();
              onDelete?.();
            }
          }}
          {...props}
        >
          <span className="ingredient-list-item-text text-body-small-regular">{children}</span>
        </div>
      </div>
      
      {showBelowDivider && <Divider />}
    </div>
  );
};

const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

IngredientListItem.displayName = 'IngredientListItem';
