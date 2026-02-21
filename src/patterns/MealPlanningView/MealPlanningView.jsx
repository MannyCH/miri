import React, { useState, useRef, useEffect } from 'react';
import { CalendarModule } from '../../components/CalendarModule';
import { Button } from '../../components/Button';
import { RecipeListItem } from '../../components/RecipeListItem';
import { Divider } from '../../components/Divider';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './MealPlanningView.css';

export const MealPlanningView = ({
  title = 'Meal Planning',
  calendarTitle,
  days = [],
  selectedFullDate,
  onDayClick,
  meals = {},
  hasPlan = false,
  hasMealsForDay = false,
  hasAddedToList = false,
  onPlanMeals,
  onAddMeals,
  onReplan,
  onClearPlan,
  onAddRecipeToList,
  ...props
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [menuOpen]);

  const handleMenuAction = (action) => {
    setMenuOpen(false);
    action?.();
  };

  return (
    <div className="meal-planning-view" {...props}>
      {/* Header: Title + three-dot menu + Calendar Module */}
      <div className="meal-planning-fixed-header">
        <div className="meal-planning-section-header">
          <h1 className="text-h1-bold" style={{ color: 'var(--color-text-strong)' }}>
            {title}
          </h1>
          {hasPlan && (
            <div className="meal-planning-menu-wrapper" ref={menuRef}>
              <button
                className="icon-button"
                aria-label="More options"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen(prev => !prev)}
              >
                <MoreIcon />
              </button>
              {menuOpen && (
                <div className="context-menu" role="menu">
                  <button
                    className="context-menu-item text-body-base-regular"
                    role="menuitem"
                    onClick={() => handleMenuAction(onReplan)}
                  >
                    Replan week
                  </button>
                  <button
                    className="context-menu-item context-menu-item-danger text-body-base-regular"
                    role="menuitem"
                    onClick={() => handleMenuAction(onClearPlan)}
                  >
                    Clear week
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="meal-planning-calendar-section">
          <CalendarModule
            title={calendarTitle}
            days={days}
            selectedDay={selectedFullDate}
            onDayClick={onDayClick}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="meal-planning-content">
        {hasPlan && hasMealsForDay && (
          <>
            {['breakfast', 'lunch', 'dinner'].map(mealType => (
              <MealSection
                key={mealType}
                label={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                meal={meals[mealType]}
                onAddToList={() => onAddRecipeToList?.(meals[mealType]?.id)}
              />
            ))}
          </>
        )}

        {hasPlan && !hasMealsForDay && (
          <div className="meal-planning-empty">
            <p className="text-body-base-regular" style={{ color: 'var(--color-text-weak)' }}>
              No meals planned for this day.
            </p>
          </div>
        )}

        {!hasPlan && (
          <div className="meal-planning-empty">
            <p className="text-body-base-regular" style={{ color: 'var(--color-text-weak)' }}>
              No meals planned yet.
            </p>
            <Button variant="primary" onClick={onPlanMeals}>
              Plan my week
            </Button>
          </div>
        )}
      </div>

      {/* Bottom action bar — only when a plan exists */}
      {hasPlan && (
        <div className="meal-planning-action">
          <Button
            variant={hasAddedToList ? 'secondary' : 'primary'}
            onClick={hasAddedToList ? undefined : onAddMeals}
            disabled={hasAddedToList}
          >
            {hasAddedToList ? 'Added to list \u2713' : 'Add week to list'}
          </Button>
        </div>
      )}

      <NavigationBarConnected activeItem="planning" />
    </div>
  );
};

const MealSection = ({ label, meal, onAddToList }) => (
  <>
    <div className="meal-section-header">
      <h3 className="text-body-base-bold" style={{ color: 'var(--color-text-strong)' }}>
        {label}
      </h3>
      <div className="meal-actions">
        <button className="icon-button" aria-label={`Refresh ${label.toLowerCase()}`}>
          <RefreshIcon />
        </button>
        <button className="icon-button" aria-label={`Add ${label.toLowerCase()} to list`} onClick={onAddToList}>
          <ShoppingCartIcon />
        </button>
      </div>
    </div>
    <Divider />
    {meal && (
      <RecipeListItem
        title={meal.title}
        thumbnail={meal.thumbnail}
        showUpperDivider={false}
        showBelowDivider={false}
      />
    )}
  </>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

MealPlanningView.displayName = 'MealPlanningView';
