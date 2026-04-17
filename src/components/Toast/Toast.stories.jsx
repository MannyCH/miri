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
 * - Elevation: --elevation-raised
 * - Typography: text-body-small-bold
 */
export default {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Brief feedback notification that appears at the bottom of the screen. Used to confirm that an action succeeded, failed, or needs attention — without blocking the UI.

## When to use
- Confirming a background action the user just triggered (item added, recipe saved, list shared)
- Reporting a non-blocking error (deletion failed, connection lost)
- Surfacing a soft warning the user should know about but doesn't need to act on immediately
- Auto-dismissing notifications — do not use for anything that requires a decision

## When NOT to use
- When the user must acknowledge or act on the message — use a modal or inline error instead
- For persistent status indicators — use an inline banner or status badge
- For destructive confirmations ("Are you sure?") — use an ActionSheet or modal dialog

## Pairs well with
- \`AppContext\` toast queue — the app-level context manages showing/hiding toasts in sequence
- \`AnimatePresence\` from Motion — the component uses spring animation on mount/unmount

**Design Tokens Used:**
- Colors: \`--color-fill-success-weak\`, \`--color-fill-error-weak\`, \`--color-fill-warning-weak\`, \`--color-fill-info-weak\`
- Elevation: \`--elevation-raised\`
- Typography: \`text-body-small-bold\`
        `.trim(),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['Success', 'Error', 'Warning', 'Info'],
      description: `Semantic intent of the notification:
- **Success** — action completed as expected (item added, saved, shared)
- **Error** — something went wrong and the action did not complete
- **Warning** — action completed but with a caveat the user should know about
- **Info** — neutral update with no positive/negative connotation (plan updated, sync in progress)`,
    },
    message: {
      control: 'text',
      description: 'Notification text. Keep it short (under 60 characters) — one sentence. If omitted, a default message for the variant is shown.',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the × dismiss button. Set to false when the toast auto-dismisses and a manual close is not needed.',
    },
    onClose: {
      action: 'close clicked',
      description: 'Callback fired when the user taps the close button. Use to remove the toast from the queue.',
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
  parameters: {
    docs: {
      description: {
        story: 'All four variants side by side — use this to visually compare the color and icon treatment for each semantic intent.',
      },
    },
  },
};

// Individual variant stories
export const Success = {
  args: {
    variant: 'Success',
    message: 'Added to shopping list',
    showCloseButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Confirms a positive action completed — the most common toast in Miri (item added, recipe saved, list shared).',
      },
    },
  },
};

export const Error = {
  args: {
    variant: 'Error',
    message: 'Could not delete item',
    showCloseButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Non-blocking error — the action failed, but the user can continue using the app. Reserve for background failures, not for form validation.',
      },
    },
  },
};

export const Warning = {
  args: {
    variant: 'Warning',
    message: 'Low stock warning',
    showCloseButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Soft warning — action completed but something the user should be aware of. Does not block further interaction.',
      },
    },
  },
};

export const Info = {
  args: {
    variant: 'Info',
    message: 'Meal plan updated',
    showCloseButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Neutral informational update — no success or failure implied. Use for sync events, background updates, or state changes the user did not directly trigger.',
      },
    },
  },
};

// Without close button
export const WithoutCloseButton = {
  args: {
    variant: 'Success',
    message: 'Auto-dismissing notification',
    showCloseButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Auto-dismissing variant with no manual close button. Use when the toast will disappear after a timeout and no user action is needed.',
      },
    },
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
