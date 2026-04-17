import React from 'react';
import { AccountCard } from './AccountCard';

export default {
  title: 'Components/AccountCard',
  component: AccountCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `User identity card shown at the top of the account page. Shows the user's name and email, a Log out button, and an expandable section for account management actions.

## When to use
- As the primary identity block at the top of the account/profile page — one per screen
- When you need to surface account management actions (change details, change password, delete account) without cluttering the main view

## When NOT to use
- Don't use inside lists or cards alongside other content — it is a page-level hero element
- Don't use if you only need to show a user avatar or name without actions — a simpler text/avatar component is more appropriate

## Pairs well with
- Placed at the top of the account page above preference cards (e.g. \`BmrCalculatorCard\`, calorie goal sections)
- The expandable section maps to \`ConfirmDialog\` for destructive actions like delete account`,
      },
    },
  },
  args: {
    name: 'Mani',
    email: 'mani.rohri@hotmail.com',
    onLogOut: () => {},
    onChangeUserDetails: () => {},
    onChangePassword: () => {},
    onDeleteAccount: () => {},
  },
};

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsed state — shows name, email, and log out. Tap the chevron row to expand account actions.',
      },
    },
  },
};

export const Expanded = {
  render: (args) => {
    const [, setOpen] = React.useState(true);
    return <AccountCard {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the "Account" row in the Default story to reveal the three account management actions. This story renders the component in the same default-collapsed state — interact to expand.',
      },
    },
  },
};
