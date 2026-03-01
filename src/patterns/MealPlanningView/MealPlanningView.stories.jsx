import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MealPlanningView } from './MealPlanningView';
import { generateCalendarDays, formatDayTitle } from '../../data/recipes';

export default {
  title: 'Patterns/MealPlanningView',
  component: MealPlanningView,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/planning']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Meal Planning pattern with swipeable Calendar Module and stateful layout.

Empty state shows centered "Plan my week" button. After planning, a three-dot context menu provides "Replan week" and "Clear week" actions, while the bottom bar shows "Add week to list".

## Context menu token mapping (pattern-scoped)
| Element | Token(s) |
|---|---|
| Menu surface | \`Background/Raised\`, \`Corner radius/8\` |
| Menu item text | \`Text/Strong\` |
| Danger item text | \`Text/Error\` |
| Hover state | \`Fill/Hover\` |
| Focus ring | \`Stroke/Focus\` (2px) |
| Spacing | \`Spacing/4\`, \`Spacing/12\`, \`Spacing/16\` |

Implementation note:
- Elevation currently follows implementation shadow values in CSS for parity with the running app.
- Design source in Figma: page \`Context Menu\`, component set \`Context menu\`.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

const calendarDays = generateCalendarDays(28);
const todayFullDate = calendarDays[0]?.fullDate;

const sampleMeals = {
  breakfast: {
    id: 'salmon',
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
  },
  lunch: {
    id: 'salad',
    title: 'Chicken Fajita Salad',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  },
  dinner: {
    id: 'tacos',
    title: 'Spicy Shrimp Tacos with Avocado Salsa',
    thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
  },
};

/**
 * Empty state — no plan yet, centered "Plan my week" button
 */
export const NoPlan = {
  args: {
    calendarTitle: formatDayTitle(todayFullDate),
    days: calendarDays,
    selectedFullDate: todayFullDate,
    hasPlan: false,
    hasMealsForDay: false,
    hasAddedToList: false,
    onPlanMeals: () => alert('Plan my week'),
  },
};

/**
 * Plan exists — meals shown, bottom "Add week to list" button, three-dot menu visible
 */
export const WithPlan = {
  args: {
    calendarTitle: formatDayTitle(todayFullDate),
    days: calendarDays,
    selectedFullDate: todayFullDate,
    meals: sampleMeals,
    hasPlan: true,
    hasMealsForDay: true,
    hasAddedToList: false,
    onReplan: () => alert('Replan week'),
    onClearPlan: () => alert('Clear week'),
    onAddMeals: () => alert('Add week to list'),
  },
};

/**
 * After adding to list — disabled "Added to list" button
 */
export const AddedToList = {
  args: {
    calendarTitle: formatDayTitle(todayFullDate),
    days: calendarDays,
    selectedFullDate: todayFullDate,
    meals: sampleMeals,
    hasPlan: true,
    hasMealsForDay: true,
    hasAddedToList: true,
    onReplan: () => alert('Replan week'),
    onClearPlan: () => alert('Clear week'),
  },
};

/**
 * Interactive demo — full lifecycle: plan -> view meals -> add to list
 */
export const Interactive = {
  render: () => {
    const [selected, setSelected] = React.useState(todayFullDate);
    const [hasPlan, setHasPlan] = React.useState(false);
    const [hasAdded, setHasAdded] = React.useState(false);

    const handleDayClick = (date, fullDate) => setSelected(fullDate);

    return (
      <MealPlanningView
        calendarTitle={formatDayTitle(selected)}
        days={calendarDays}
        selectedFullDate={selected}
        onDayClick={handleDayClick}
        meals={hasPlan ? sampleMeals : {}}
        hasPlan={hasPlan}
        hasMealsForDay={hasPlan}
        hasAddedToList={hasAdded}
        onPlanMeals={() => { setHasPlan(true); setHasAdded(false); }}
        onReplan={() => { setHasPlan(true); setHasAdded(false); }}
        onClearPlan={() => { setHasPlan(false); setHasAdded(false); }}
        onAddMeals={() => setHasAdded(true)}
      />
    );
  },
};

/**
 * Visual spec story for context menu states and tokens.
 * Pattern-scoped (not a standalone reusable component).
 */
export const ContextMenuSpec = {
  parameters: {
    docs: {
      description: {
        story: 'Reference state matrix for the Meal Planning context menu: default, hover and focus treatment, plus danger action color semantics.',
      },
    },
  },
  render: () => {
    const boardStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 180px)',
      gap: 'var(--spacing-16)',
      padding: 'var(--spacing-16)',
      background: 'var(--color-background-base)',
      border: '1px solid var(--color-stroke-weak)',
      borderRadius: 'var(--corner-radius-8)',
      width: 'fit-content',
      margin: 'var(--spacing-16)',
    };

    const labelStyle = {
      margin: 0,
      color: 'var(--color-text-weak)',
    };

    const menuWrapperStyle = { minHeight: '100px' };

    return (
      <div style={boardStyle}>
        <div>
          <p className="text-body-base-bold" style={labelStyle}>Default</p>
          <div style={menuWrapperStyle}>
            <div className="context-menu" style={{ position: 'static' }}>
              <div className="context-menu-item text-body-base-regular">Replan week</div>
              <div className="context-menu-item context-menu-item-danger text-body-base-regular">Clear week</div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-body-base-bold" style={labelStyle}>Hover</p>
          <div style={menuWrapperStyle}>
            <div className="context-menu" style={{ position: 'static' }}>
              <div
                className="context-menu-item text-body-base-regular"
                style={{ background: 'var(--color-fill-hover)' }}
              >
                Replan week
              </div>
              <div className="context-menu-item context-menu-item-danger text-body-base-regular">Clear week</div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-body-base-bold" style={labelStyle}>Focus</p>
          <div style={menuWrapperStyle}>
            <div className="context-menu" style={{ position: 'static' }}>
              <div
                className="context-menu-item text-body-base-regular"
                style={{
                  outline: '2px solid var(--color-stroke-focus)',
                  outlineOffset: '-2px',
                }}
              >
                Replan week
              </div>
              <div className="context-menu-item context-menu-item-danger text-body-base-regular">Clear week</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};
