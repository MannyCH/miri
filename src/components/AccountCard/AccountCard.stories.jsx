import React from 'react';
import { AccountCard } from './AccountCard';

export default {
  title: 'Components/AccountCard',
  component: AccountCard,
  parameters: {
    docs: {
      description: {
        component: 'User identity card shown at the top of the account page. Shows name, email, and a log out button. Expands to show account actions: change details, change password, delete account.',
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

export const Default = {};

export const Expanded = {
  render: (args) => {
    const [, setOpen] = React.useState(true);
    return <AccountCard {...args} />;
  },
};
