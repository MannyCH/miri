import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecipeImportView } from './RecipeImportView';

export default {
  title: 'Patterns/RecipeImportView',
  component: RecipeImportView,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Editable recipe form shown after importing a TXT file. All fields are pre-populated from the parser and can be adjusted before saving.',
      },
    },
  },
  tags: ['autodocs'],
};

const parsedRecipe = {
  title: 'Auberginensalat Mit Ohne Alles',
  ingredients: [
    '1/2 Aubergine',
    '100g Naturjoghurt',
    '1 Knoblauchzehe',
    '1 TL Pul Biber',
  ],
  directions: [
    'Den Backofen auf 230 Grad vorheizen.',
    'Die Aubergine waschen, mehrmals mit einem spitzen Messer einstechen und im Ofen 30–45 Minuten backen, bis die Haut schwarz und schrumpelig ist.',
    'Aubergine halbieren, Fruchtfleisch herausschaben. Mit Joghurt, Knoblauch und Salz mischen. Nach Belieben Chiliflocken darüberstreuen.',
  ],
  servings: 2,
  categories: ['healthy', 'vegetarian'],
};

/**
 * Pre-filled from a parsed TXT file — typical import flow
 */
export const ParsedImport = {
  args: {
    initialRecipe: parsedRecipe,
    onSave: (data) => console.log('Save:', data),
    onCancel: () => console.log('Cancel'),
  },
};

/**
 * Empty form — for manually entering a new recipe
 */
export const EmptyForm = {
  args: {
    initialRecipe: {},
    onSave: (data) => console.log('Save:', data),
    onCancel: () => console.log('Cancel'),
  },
};

/**
 * Save in progress — button disabled with loading text
 */
export const Saving = {
  args: {
    initialRecipe: parsedRecipe,
    onSave: () => {},
    onCancel: () => {},
    isSaving: true,
  },
};
