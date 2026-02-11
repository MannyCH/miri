import React from 'react';
import { CalendarWeek } from '../../components/CalendarWeek';
import { Button } from '../../components/Button';
import { RecipeListItem } from '../../components/RecipeListItem';
import { Divider } from '../../components/Divider';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './MealPlanningView.css';

/**
 * MealPlanningView Pattern - Meal planning screen with calendar and meals
 * Composition of: CalendarWeek, Button, RecipeListItem, NavigationBar
 * EXACT Figma implementation with correct text styles and color tokens
 */
export const MealPlanningView = ({
  selectedDay = 23,
  onDayClick,
  meals = {},
  onPlanMeals,
  onAddMeals,
  ...props
}) => {
  return (
    <div className="meal-planning-view" {...props}>
      {/* Main Content Container - matches Figma Container with itemSpacing: 0 */}
      <div className="meal-planning-content">
        {/* Section Header */}
        <div className="meal-planning-section-header">
          <h1 className="text-h1-bold" style={{ color: 'var(--color-text-strong)' }}>
            Meal Planning
          </h1>
        </div>

        {/* Date Section */}
        <div className="meal-planning-date-section">
          <div className="meal-planning-date-row">
            <span className="text-annotation-bold" style={{ color: 'var(--color-text-weak)' }}>
              22.11 - 28.11
            </span>
            <Button variant="secondary" onClick={onPlanMeals}>
              Plan meals this week
            </Button>
          </div>
          
          <CalendarWeek
            days={[22, 23, 24, 25, 26, 27, 28]}
            selectedDay={selectedDay}
            onDayClick={onDayClick}
          />
        </div>

        {/* Day Section */}
        <div className="meal-planning-day-section">
          <h2 className="text-h4-regular" style={{ color: 'var(--color-text-weak)' }}>
            Monday, 23. November
          </h2>
          <Button variant="secondary" onClick={onAddMeals}>
            Add meals to list
          </Button>
        </div>

        {/* Breakfast - Meal Section (all sections are direct children, no wrapper) */}
        <div className="meal-section-header">
          <h3 className="text-body-base-bold" style={{ color: 'var(--color-text-strong)' }}>
            Breakfast
          </h3>
          <div className="meal-actions">
            <button className="icon-button" aria-label="Refresh">
              <RefreshIcon />
            </button>
            <button className="icon-button" aria-label="Add to cart">
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
        <Divider />
        {meals.breakfast && (
          <RecipeListItem
            title={meals.breakfast.title}
            thumbnail={meals.breakfast.thumbnail}
            showUpperDivider={false}
            showBelowDivider={false}
          />
        )}

        {/* Lunch - Meal Section */}
        <div className="meal-section-header">
          <h3 className="text-body-base-bold" style={{ color: 'var(--color-text-strong)' }}>
            Lunch
          </h3>
          <div className="meal-actions">
            <button className="icon-button" aria-label="Refresh">
              <RefreshIcon />
            </button>
            <button className="icon-button" aria-label="Add to cart">
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
        <Divider />
        {meals.lunch && (
          <RecipeListItem
            title={meals.lunch.title}
            thumbnail={meals.lunch.thumbnail}
            showUpperDivider={false}
            showBelowDivider={false}
          />
        )}

        {/* Dinner - Meal Section */}
        <div className="meal-section-header">
          <h3 className="text-body-base-bold" style={{ color: 'var(--color-text-strong)' }}>
            Dinner
          </h3>
          <div className="meal-actions">
            <button className="icon-button" aria-label="Refresh">
              <RefreshIcon />
            </button>
            <button className="icon-button" aria-label="Add to cart">
              <ShoppingCartIcon />
            </button>
          </div>
        </div>
        <Divider />
        {meals.dinner && (
          <RecipeListItem
            title={meals.dinner.title}
            thumbnail={meals.dinner.thumbnail}
            showUpperDivider={false}
            showBelowDivider={false}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="planning" />
    </div>
  );
};

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
