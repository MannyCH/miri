import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MealPlanningView } from './MealPlanningView';

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
        component: 'Meal Planning pattern - Calendar week view with planned meals. Exact Figma implementation with correct text styles and color tokens.',
      },
    },
  },
  tags: ['autodocs'],
};

/**
 * Default MealPlanningView - Matches Figma "Shopping List / Meal Planning" pattern exactly
 */
export const Default = {
  args: {
    selectedDay: 23,
    meals: {
      breakfast: {
        title: 'Salmon with tomato and asparagus',
        thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      },
      lunch: {
        title: 'Chicken Fajita Salad',
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      },
      dinner: {
        title: 'Spicy Shrimp Tacos with Avocado Salsa',
        thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
    },
  },
};

/**
 * Interactive demo with stateful calendar and actions
 */
export const Interactive = {
  render: () => {
    const [selectedDay, setSelectedDay] = React.useState(23);
    const [meals, setMeals] = React.useState({
      breakfast: {
        title: 'Salmon with tomato and asparagus',
        thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
      },
      lunch: {
        title: 'Chicken Fajita Salad',
        thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      },
      dinner: {
        title: 'Spicy Shrimp Tacos with Avocado Salsa',
        thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
    });

    return (
      <MealPlanningView
        selectedDay={selectedDay}
        onDayClick={(day) => setSelectedDay(day)}
        meals={meals}
        onPlanMeals={() => alert('Plan meals this week clicked')}
        onAddMeals={() => alert('Add meals to list clicked')}
      />
    );
  },
};

/**
 * Empty state - No meals planned yet
 */
export const EmptyState = {
  args: {
    selectedDay: 23,
    meals: {},
  },
};
