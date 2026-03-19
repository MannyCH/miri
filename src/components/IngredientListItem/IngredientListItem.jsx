import React from 'react';
import { motion } from 'motion/react';
import { Divider } from '../Divider';
import './IngredientListItem.css';

/**
 * IngredientListItem component - Exactly as designed in Figma
 * Interactive ingredient item - tap to toggle strikethrough, swipe left to delete.
 * Optional: pass onPantryToggle to enable swipe-right → pantry staple.
 */
export const IngredientListItem = ({
  children = '2l Milch',
  checked = false,
  onCheckedChange,
  onDelete,
  onPantryToggle,     // optional — enables swipe-right pantry zone
  isPantryStaple = false,
  showUpperDivider = true,
  showBelowDivider = true,
  ...props
}) => {
  // positive = swiping left (delete), negative = swiping right (pantry)
  const [swipeX, setSwipeX] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const swipeDirectionRef = React.useRef(null); // 'horizontal' | 'vertical' | null

  const MAX_SWIPE = 120;
  const SWIPE_THRESHOLD = 84;
  const SWIPE_TRANSITION = '360ms cubic-bezier(0.22, 0.61, 0.36, 1)';
  const REMOVE_ANIMATION_MS = 320;

  const triggerDelete = React.useCallback(() => {
    if (isRemoving) return;
    setSwipeX(MAX_SWIPE);
    setIsSwiping(false);
    setIsRemoving(true);
    window.setTimeout(() => onDelete?.(), REMOVE_ANIMATION_MS);
  }, [isRemoving, onDelete]);

  const triggerPantry = React.useCallback(() => {
    if (isRemoving) return;
    setSwipeX(-MAX_SWIPE);
    setIsSwiping(false);
    window.setTimeout(() => {
      onPantryToggle?.();
      setSwipeX(0);
    }, REMOVE_ANIMATION_MS);
  }, [isRemoving, onPantryToggle]);

  const handleTouchStart = (e) => {
    if (isRemoving) return;
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    swipeDirectionRef.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const dx = startXRef.current - e.touches[0].clientX;
    const dy = startYRef.current - e.touches[0].clientY;

    if (swipeDirectionRef.current === null) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      swipeDirectionRef.current = Math.abs(dy) > Math.abs(dx) ? 'vertical' : 'horizontal';
    }

    if (swipeDirectionRef.current === 'vertical') return;

    e.preventDefault();
    if (onPantryToggle) {
      setSwipeX(Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, dx)));
    } else {
      if (dx > 0) setSwipeX(Math.min(dx, MAX_SWIPE));
    }
  };

  const handleTouchEnd = () => {
    if (isRemoving) return;
    swipeDirectionRef.current = null;
    if (swipeX > SWIPE_THRESHOLD) { triggerDelete(); return; }
    if (onPantryToggle && swipeX < -SWIPE_THRESHOLD) { triggerPantry(); return; }
    setSwipeX(0);
    setIsSwiping(false);
  };

  const handleItemClick = () => {
    if (isSwiping || swipeX !== 0 || isRemoving) return;
    onCheckedChange?.(!checked);
  };

  const leftProgress = Math.min(1, Math.max(0, swipeX) / MAX_SWIPE);
  const rightProgress = Math.min(1, Math.max(0, -swipeX) / MAX_SWIPE);

  return (
    <motion.div
      className={`ingredient-list-item ${isRemoving ? 'is-removing' : ''}`}
      initial={false}
      layout="position"
      style={isRemoving ? { pointerEvents: 'none', overflow: 'hidden' } : { overflow: 'hidden' }}
      animate={
        isRemoving
          ? { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, x: -16, scale: 0.98 }
          : { opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, x: 0, scale: 1 }
      }
      transition={{
        duration: REMOVE_ANIMATION_MS / 1000,
        ease: [0.22, 0.61, 0.36, 1],
        layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
      }}
    >
      {showUpperDivider && <Divider />}

      <div
        className={`ingredient-list-item-wrapper ${swipeX !== 0 ? 'is-swiping' : ''}`}
        style={{ '--swipe-progress': leftProgress, '--right-swipe-progress': rightProgress }}
      >
        {/* Pantry zone — LEFT side, revealed by swiping RIGHT */}
        {onPantryToggle && (
          <button
            type="button"
            className="ingredient-list-item-pantry-zone"
            aria-label={isPantryStaple ? 'Remove from pantry staples' : 'Mark as pantry staple'}
            onClick={triggerPantry}
            tabIndex={rightProgress > 0 ? 0 : -1}
          >
            {isPantryStaple ? <PantryRemoveIcon /> : <PantryIcon />}
          </button>
        )}

        {/* Delete zone — RIGHT side, revealed by swiping LEFT */}
        <button
          type="button"
          className="ingredient-list-item-delete-zone"
          aria-label={`Delete ${children}`}
          onClick={triggerDelete}
          tabIndex={leftProgress > 0 ? 0 : -1}
        >
          <TrashIcon />
        </button>

        {/* Interactive container */}
        <div
          className={`ingredient-list-item-container ${checked ? 'is-checked' : ''}`}
          style={{
            transform: `translateX(${-swipeX}px)`,
            transition: isSwiping ? 'none' : `transform ${SWIPE_TRANSITION}`,
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
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onCheckedChange?.(!checked); }
            if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); onDelete?.(); }
          }}
          {...props}
        >
          <span className="ingredient-list-item-text text-body-small-regular">{children}</span>
        </div>
      </div>

      {showBelowDivider && <Divider />}
    </motion.div>
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

const PantryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PantryRemoveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <line x1="9" y1="12" x2="15" y2="18"/>
    <line x1="15" y1="12" x2="9" y2="18"/>
  </svg>
);

IngredientListItem.displayName = 'IngredientListItem';
