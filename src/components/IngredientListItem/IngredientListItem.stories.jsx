import React from 'react';
import { IngredientListItem } from './IngredientListItem';

export default {
  title: 'Components/IngredientListItem',
  component: IngredientListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `A single interactive ingredient row. Tap (or Space/Enter) to toggle a strikethrough "checked" state; swipe left (or press Delete/Backspace) to remove. When \`onPantryToggle\` is provided, swiping right marks the item as a pantry staple.

## When to use
- Inside a shopping list or recipe ingredient list where the user needs to check off or remove individual items
- Use \`IngredientList\` when you have a plain array of strings — it manages dividers, keys, and callbacks for you
- Use this component directly only when you need custom key management or row-level overrides

## When NOT to use
- Do not use for non-ingredient rows — reach for a generic list-item pattern that better conveys the content type
- Do not use if interaction (check/delete) is not needed — a plain text list is simpler

## Pairs well with
- \`Divider\` — rendered internally via \`showUpperDivider\` / \`showBelowDivider\` props; do not add extra dividers outside
- \`IngredientList\` — the preferred wrapper when rendering a full list from an array`,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the item is checked off. When true, the text is struck through to indicate the ingredient has been collected or used.',
    },
    showUpperDivider: {
      control: 'boolean',
      description: 'Render a Divider above this row. Set to true only for the first item in a group to avoid double dividers between consecutive items.',
    },
    showBelowDivider: {
      control: 'boolean',
      description: 'Render a Divider below this row. Set to true on the last item in a group to close the list visually.',
    },
    children: {
      control: 'text',
      description: 'The ingredient text displayed in the row (e.g. "500g Spaghetti"). Passed as children, not a prop.',
    },
    isPantryStaple: {
      control: 'boolean',
      description: 'When true, the swipe-right pantry zone shows a "remove from pantry" icon instead of "add to pantry". Has no visual effect unless onPantryToggle is also provided.',
    },
  },
};

export const Unchecked = {
  args: {
    children: '2l Milch',
    checked: false,
    showUpperDivider: true,
    showBelowDivider: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state — the item has not yet been collected. Text appears at full opacity without strikethrough.',
      },
    },
  },
};

export const Checked = {
  args: {
    children: '2l Milch',
    checked: true,
    showUpperDivider: true,
    showBelowDivider: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Checked/collected state — the text is struck through and dimmed to signal the ingredient is done.',
      },
    },
  },
};

export const WithoutDividers = {
  args: {
    children: '2l Milch',
    checked: false,
    showUpperDivider: false,
    showBelowDivider: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use when the surrounding context already provides its own dividers or when the item is embedded in a layout that handles spacing differently.',
      },
    },
  },
};

export const List = () => {
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleCheck = (id, checked) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }));
  };

  return (
    <div style={{ width: '358px', background: 'var(--color-background-raised)' }}>
      <IngredientListItem 
        checked={checkedItems['1']}
        onCheckedChange={(checked) => handleCheck('1', checked)}
        showUpperDivider={true}
        showBelowDivider={false}
      >
        500g Spaghetti
      </IngredientListItem>
      <IngredientListItem 
        checked={checkedItems['2']}
        onCheckedChange={(checked) => handleCheck('2', checked)}
        showUpperDivider={false}
        showBelowDivider={false}
      >
        2l Milch
      </IngredientListItem>
      <IngredientListItem 
        checked={checkedItems['3']}
        onCheckedChange={(checked) => handleCheck('3', checked)}
        showUpperDivider={false}
        showBelowDivider={true}
      >
        3 Eier
      </IngredientListItem>
    </div>
  );
};

List.parameters = {
  docs: {
    description: {
      story: 'Three items composed into a list with correct divider placement: upper divider on the first item only, lower divider on the last item only, none between.',
    },
  },
};

export const TapToToggle = () => {
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleCheck = (id, checked) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }));
  };

  return (
    <div style={{ width: '358px', background: 'var(--color-background-raised)' }}>
      <div style={{ 
        padding: 'var(--spacing-16)', 
        marginBottom: 'var(--spacing-16)',
        background: 'var(--color-background-sunken)',
        borderRadius: 'var(--corner-radius-8)',
        color: 'var(--color-text-weak)'
      }}>
        <span className="text-body-small-regular">👆 Tap anywhere on the item to toggle strikethrough</span>
      </div>
      
      <IngredientListItem 
        checked={checkedItems['1']}
        onCheckedChange={(checked) => handleCheck('1', checked)}
        showUpperDivider={true}
        showBelowDivider={false}
      >
        500g Spaghetti
      </IngredientListItem>
      <IngredientListItem 
        checked={checkedItems['2']}
        onCheckedChange={(checked) => handleCheck('2', checked)}
        showUpperDivider={false}
        showBelowDivider={false}
      >
        2l Milch
      </IngredientListItem>
      <IngredientListItem 
        checked={checkedItems['3']}
        onCheckedChange={(checked) => handleCheck('3', checked)}
        showUpperDivider={false}
        showBelowDivider={true}
      >
        3 Eier
      </IngredientListItem>
    </div>
  );
};

TapToToggle.parameters = {
  docs: {
    description: {
      story: 'Demonstrates the tap/click interaction: touch or click anywhere on a row to toggle the checked state and strikethrough. No delete handler is wired here so swiping left has no effect.',
    },
  },
};

export const SwipeToDelete = () => {
  const [items, setItems] = React.useState([
    { id: 1, text: '500g Spaghetti', checked: false },
    { id: 2, text: '2l Milch', checked: true },
    { id: 3, text: '3 Eier', checked: false },
    { id: 4, text: '200g Parmesan', checked: false },
  ]);

  const handleCheck = (id, checked) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ width: '358px' }}>
      <div style={{ 
        padding: 'var(--spacing-16)', 
        marginBottom: 'var(--spacing-16)',
        background: 'var(--color-background-sunken)',
        borderRadius: 'var(--corner-radius-8)',
        color: 'var(--color-text-weak)'
      }}>
        <span className="text-body-small-regular">
        <strong>Try it:</strong><br />
        👆 <strong>Tap</strong> to toggle strikethrough<br />
        👈 <strong>Swipe left</strong> to reveal delete button<br />
        ⌨️ <strong>Delete/Backspace</strong> key to remove<br />
        <br />
        <em>(Use touch or trackpad for best swipe experience)</em>
        </span>
      </div>
      
      <div style={{ background: 'var(--color-background-raised)' }}>
        {items.map((item, index) => (
          <IngredientListItem 
            key={item.id}
            checked={item.checked}
            onCheckedChange={(checked) => handleCheck(item.id, checked)}
            onDelete={() => handleDelete(item.id)}
            showUpperDivider={index === 0}
            showBelowDivider={index === items.length - 1}
          >
            {item.text}
          </IngredientListItem>
        ))}
        
        {items.length === 0 && (
          <div style={{
            padding: 'var(--spacing-24)',
            textAlign: 'center',
            color: 'var(--color-text-weak)'
          }}>
            <span className="text-body-small-regular">All items deleted! 🎉</span>
          </div>
        )}
      </div>
    </div>
  );
};

SwipeToDelete.parameters = {
  docs: {
    description: {
      story: 'Demonstrates the full delete flow: swipe left past the threshold to reveal the trash zone, then release to animate removal. Also works with the Delete/Backspace keyboard shortcut. Uses real local state so items actually disappear.',
    },
  },
};

export const KeyboardNavigation = () => {
  const [items, setItems] = React.useState([
    { id: 1, text: '500g Spaghetti', checked: false },
    { id: 2, text: '2l Milch', checked: false },
    { id: 3, text: '3 Eier', checked: false },
  ]);

  const handleCheck = (id, checked) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div style={{ width: '358px', background: 'var(--color-background-raised)' }}>
      <div style={{ 
        padding: 'var(--spacing-16)', 
        marginBottom: 'var(--spacing-16)',
        background: 'var(--color-background-sunken)',
        borderRadius: 'var(--corner-radius-8)',
        color: 'var(--color-text-weak)'
      }}>
        <span className="text-body-small-regular">⌨️ <strong>Tab</strong> to navigate, <strong>Space/Enter</strong> to toggle, <strong>Delete</strong> to remove</span>
      </div>
      
      {items.map((item, index) => (
        <IngredientListItem 
          key={item.id}
          checked={item.checked}
          onCheckedChange={(checked) => handleCheck(item.id, checked)}
          onDelete={() => handleDelete(item.id)}
          showUpperDivider={index === 0}
          showBelowDivider={index === items.length - 1}
        >
          {item.text}
        </IngredientListItem>
      ))}
    </div>
  );
};

KeyboardNavigation.parameters = {
  docs: {
    description: {
      story: 'Tab through the items using a keyboard, press Space or Enter to toggle checked state, and press Delete or Backspace to remove an item — verifying full keyboard accessibility without touch interaction.',
    },
  },
};
