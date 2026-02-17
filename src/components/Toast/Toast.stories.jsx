import React from 'react';
import { Toast } from './Toast';

export default {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toast notification component for mobile user feedback. Shows brief messages for actions like adding ingredients, deleting items, or warnings.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
      description: 'Visual style based on message type',
    },
    message: {
      control: 'text',
      description: 'Notification message text',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show/hide icon',
    },
  },
};

export const Success = {
  args: {
    variant: 'success',
    message: 'Added to shopping list',
    showIcon: true,
  },
};

export const Error = {
  args: {
    variant: 'error',
    message: 'Could not delete item',
    showIcon: true,
  },
};

export const Warning = {
  args: {
    variant: 'warning',
    message: 'Low stock warning',
    showIcon: true,
  },
};

export const Info = {
  args: {
    variant: 'info',
    message: 'Meal plan updated',
    showIcon: true,
  },
};

export const NoIcon = {
  args: {
    variant: 'success',
    message: 'Action completed',
    showIcon: false,
  },
};

export const LongMessage = {
  args: {
    variant: 'success',
    message: 'Successfully added all ingredients from this recipe to your shopping list',
    showIcon: true,
  },
};

// Use case examples
export const UseCaseAddedIngredients = {
  args: {
    variant: 'success',
    message: 'Added 5 ingredients',
    showIcon: true,
  },
};

export const UseCaseDeleted = {
  args: {
    variant: 'error',
    message: 'Item removed',
    showIcon: true,
  },
};

export const UseCaseCleared = {
  args: {
    variant: 'warning',
    message: 'Shopping list cleared',
    showIcon: true,
  },
};
