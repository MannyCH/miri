import React from 'react';
import { Badge } from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Small numeric indicator that overlays an icon or list item to signal unread or pending count.

## When to use
- To show a notification or unread count on a navigation icon (e.g. shopping list items pending)
- To call attention to a number that needs action — keep the value short (1–3 chars)

## When NOT to use
- Don't use for status labels or category tags — use a pill/chip component instead
- Don't use for counts that are purely informational and need no action (e.g. total recipes) — inline text is clearer
- Don't use when the count is zero — hide the badge entirely rather than showing "0"

## Pairs well with
- Navigation bar icons where an item count needs surfacing
- List row icons to indicate pending or new items`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Badge content — typically a number (e.g. "1", "99") or a truncated overflow string (e.g. "999+"). Keep to 1–4 characters to avoid layout overflow.',
    },
  },
};

export const Default = {
  args: {
    children: '1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Single digit — the most common case, shown over a nav icon when one new item is pending.',
      },
    },
  },
};

export const MultiDigit = {
  args: {
    children: '99',
  },
  parameters: {
    docs: {
      description: {
        story: 'Two-digit count — verify the badge still fits within its container without clipping.',
      },
    },
  },
};

export const LargeNumber = {
  args: {
    children: '999+',
  },
  parameters: {
    docs: {
      description: {
        story: 'Overflow truncation pattern — use "999+" (or similar cap) rather than rendering large raw numbers that would break the badge shape.',
      },
    },
  },
};
