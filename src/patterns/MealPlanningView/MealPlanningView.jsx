import React from 'react';
import { RotateCcw, ShoppingCart } from 'react-feather';
import { CalendarModule } from '../../components/CalendarModule';
import { Button } from '../../components/Button';
import { RecipeListItem } from '../../components/RecipeListItem';
import { Divider } from '../../components/Divider';
import { ContextMenu } from '../../components/ContextMenu';
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
  isGenerating = false,
  onPlanMeals,
  onAddMeals,
  onReplan,
  onClearPlan,
  onAddRecipeToList,
  onRecipeClick,
  replacingMealType = null,
  onReplaceMeal,
  ...props
}) => {
  return (
    <div className="meal-planning-view" {...props}>
      {/* Header: Title + three-dot menu + Calendar Module */}
      <div className="meal-planning-fixed-header">
        <div className="meal-planning-section-header">
          <h1 className="text-h1-bold" style={{ color: 'var(--color-text-strong)' }}>
            {title}
          </h1>
          {hasPlan && (
            <ContextMenu
              items={[
                { label: isGenerating ? 'Planning…' : 'Replan week', disabled: isGenerating, onAction: onReplan },
                { label: 'Clear week', destructive: true, onAction: onClearPlan },
              ]}
            />
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
                onRecipeClick={() => onRecipeClick?.(meals[mealType]?.id)}
                isReplacing={replacingMealType === mealType}
                onReplace={() => onReplaceMeal?.(mealType)}
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
            <Button variant="primary" onClick={onPlanMeals} disabled={isGenerating}>
              {isGenerating ? 'Planning…' : 'Plan my week'}
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

const MealSection = ({ label, meal, onAddToList, onRecipeClick, isReplacing, onReplace }) => (
  <>
    <div className="meal-section-header">
      <h3 className="text-body-base-bold" style={{ color: 'var(--color-text-strong)' }}>
        {label}
      </h3>
      <div className="meal-actions">
        <Button
          variant="secondary"
          iconOnly
          icon={isReplacing ? <SpinnerIcon /> : <RotateCcw size={20} />}
          aria-label={`Refresh ${label.toLowerCase()}`}
          onClick={onReplace}
          disabled={isReplacing}
        />
        <Button
          variant="secondary"
          iconOnly
          icon={<ShoppingCart size={20} />}
          aria-label={`Add ${label.toLowerCase()} to list`}
          onClick={onAddToList}
        />
      </div>
    </div>
    <Divider />
    {meal && (
      <RecipeListItem
        title={meal.title}
        thumbnail={meal.thumbnail}
        showUpperDivider={false}
        showBelowDivider={false}
        onClick={onRecipeClick}
      />
    )}
  </>
);


const SpinnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
    <path d="M12 2a10 10 0 0 1 10 10"/>
  </svg>
);

MealPlanningView.displayName = 'MealPlanningView';
