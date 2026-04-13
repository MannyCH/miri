import React from 'react';
import { IngredientList } from './IngredientList';

export default {
  title: 'Components/IngredientList',
  component: IngredientList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Container component that renders a vertical list of \`IngredientListItem\` rows from a plain array of ingredient strings.

## When to use
- Whenever you need to display a full list of ingredients from a recipe or shopping list and want consistent tap-to-check and swipe-to-delete behaviour across all rows
- Prefer this over mapping \`IngredientListItem\` yourself — it handles key management, divider placement, and index-based callbacks automatically

## When NOT to use
- Do not use if you need custom row layouts (e.g. quantity/unit split into separate columns) — map \`IngredientListItem\` directly instead
- Do not use for non-ingredient lists — reach for a more generic list pattern

## Pairs well with
- \`IngredientListItem\` — rendered internally, no need to import separately
- A section heading or recipe title above the list
- \`Divider\` — automatically managed; do not add extra dividers around this component`,
      },
    },
  },
};

export const Default = {
  args: {
    ingredients: [
      '2l Milch',
      '2l Milch',
      '1l Mandelmilch',
      '500ml Sojamilch',
    ],
    checkedItems: {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Static render with four ingredients and no items checked. Use Controls to toggle checked state or swap ingredient text.',
      },
    },
  },
};

export const Interactive = () => {
  const [items, setItems] = React.useState([
    '2l Milch',
    '500g Spaghetti',
    '1l Mandelmilch',
    '500ml Sojamilch',
  ]);
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleCheckedChange = (index, checked) => {
    setCheckedItems(prev => ({ ...prev, [index]: checked }));
  };

  const handleDelete = (index) => {
    // Remove item from list
    setItems(prev => prev.filter((_, i) => i !== index));
    
    // Adjust checked items indices
    setCheckedItems(prev => {
      const newChecked = {};
      Object.entries(prev).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx < index) {
          newChecked[idx] = value;
        } else if (idx > index) {
          newChecked[idx - 1] = value;
        }
      });
      return newChecked;
    });
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
        👈 <strong>Swipe left</strong> to delete<br />
        <br />
        <em>(Use touch or trackpad for swipe)</em>
        </span>
      </div>
      
      {items.length > 0 ? (
        <IngredientList
          ingredients={items}
          checkedItems={checkedItems}
          onCheckedChange={handleCheckedChange}
          onDelete={handleDelete}
        />
      ) : (
        <div style={{
          background: 'var(--color-background-raised)',
          padding: 'var(--spacing-24)',
          textAlign: 'center',
          color: 'var(--color-text-weak)'
        }}>
          <span className="text-body-small-regular">All items deleted! 🎉</span>
        </div>
      )}
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Fully interactive demo: tap items to check them off, swipe left (or use touch/trackpad) to delete. Demonstrates real-world usage with local state — all list mutations handled through the IngredientList callbacks.',
    },
  },
};
