import { Toast } from './Toast';
import './Toast.css';

/**
 * Toast notifications provide brief feedback about an operation through a message at the bottom of the screen.
 * 
 * **Design Source:** Figma Component Set - Toast
 * 
 * **Design Tokens Used:**
 * - Colors: Fill/Warning weak, Fill/Success weak, Fill/Error weak, Stroke variants
 * - Spacing: 8px, 12px, 16px
 * - Corner Radius: 12px
 * - Typography: text-body-small-bold
 */
export default {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Mobile notification component for feedback messages. Matches Figma design with 4 variants: Success, Error, Warning, and Info.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['Success', 'Error', 'Warning', 'Info'],
      description: 'Toast variant matching Figma component set',
    },
    message: {
      control: 'text',
      description: 'Custom message (uses default per variant if not provided)',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show/hide close button',
    },
    onClose: {
      action: 'close clicked',
      description: 'Callback when close button is clicked',
    },
  },
};

// Default story showing all variants
export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '358px' }}>
      <Toast variant="Success" message="Added to shopping list" />
      <Toast variant="Error" message="Could not delete item" />
      <Toast variant="Warning" message="Low stock warning" />
      <Toast variant="Info" message="Meal plan updated" />
    </div>
  ),
};

// Individual variant stories
export const Success = {
  args: {
    variant: 'Success',
    message: 'Added to shopping list',
    showCloseButton: true,
  },
};

export const Error = {
  args: {
    variant: 'Error',
    message: 'Could not delete item',
    showCloseButton: true,
  },
};

export const Warning = {
  args: {
    variant: 'Warning',
    message: 'Low stock warning',
    showCloseButton: true,
  },
};

export const Info = {
  args: {
    variant: 'Info',
    message: 'Meal plan updated',
    showCloseButton: true,
  },
};

// Without close button
export const WithoutCloseButton = {
  args: {
    variant: 'Success',
    message: 'Auto-dismissing notification',
    showCloseButton: false,
  },
};

// Custom messages
export const CustomMessages = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '358px' }}>
      <Toast variant="Success" message="Recipe saved successfully!" />
      <Toast variant="Error" message="Unable to connect to server" />
      <Toast variant="Warning" message="Only 2 eggs remaining" />
      <Toast variant="Info" message="Breakfast scheduled for tomorrow" />
    </div>
  ),
};
