import React from 'react';
import { IngredientListItem } from './IngredientListItem';

export default {
  title: 'Components/IngredientListItem',
  component: IngredientListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive ingredient list item. Tap to toggle strikethrough, swipe left to delete. No visible checkbox - just clean text interaction.',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the item is checked off',
    },
    showUpperDivider: {
      control: 'boolean',
      description: 'Show divider above',
    },
    showBelowDivider: {
      control: 'boolean',
      description: 'Show divider below',
    },
    children: {
      control: 'text',
      description: 'Ingredient text',
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
};

export const Checked = {
  args: {
    children: '2l Milch',
    checked: true,
    showUpperDivider: true,
    showBelowDivider: true,
  },
};

export const WithoutDividers = {
  args: {
    children: '2l Milch',
    checked: false,
    showUpperDivider: false,
    showBelowDivider: false,
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
        fontSize: '14px',
        color: 'var(--color-text-weak)'
      }}>
        👆 Tap anywhere on the item to toggle strikethrough
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
        fontSize: '14px',
        color: 'var(--color-text-weak)',
        lineHeight: '1.5'
      }}>
        <strong>Try it:</strong><br />
        👆 <strong>Tap</strong> to toggle strikethrough<br />
        👈 <strong>Swipe left</strong> to reveal delete button<br />
        ⌨️ <strong>Delete/Backspace</strong> key to remove<br />
        <br />
        <em>(Use touch or trackpad for best swipe experience)</em>
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
            color: 'var(--color-text-weak)',
            fontSize: '14px'
          }}>
            All items deleted! 🎉
          </div>
        )}
      </div>
    </div>
  );
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
        fontSize: '14px',
        color: 'var(--color-text-weak)'
      }}>
        ⌨️ <strong>Tab</strong> to navigate, <strong>Space/Enter</strong> to toggle, <strong>Delete</strong> to remove
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
