import React from 'react';
import { IngredientList } from './IngredientList';

export default {
  title: 'Components/IngredientList',
  component: IngredientList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Container component for interactive ingredient list items. Tap to toggle strikethrough, swipe left to delete.',
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
