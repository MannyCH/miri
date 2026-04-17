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
        component: `
Full-screen editable form for reviewing and adjusting a parsed recipe before saving it to the user's collection. Shown after importing a recipe from a TXT/URL/photo source.

## When to use
Use when the user triggers an import action (e.g. taps the import button in RecipesView). Pre-populate \`initialRecipe\` with the parser's output; the user can edit every field before confirming.

## When NOT to use
Do not use for reading or cooking a recipe — use RecipeDetailView for that. Do not use for in-app recipe browsing.

## Composed of
- **Badge** — numbered step indicators in the Directions section (same as RecipeDetailView)
- **Stepper** — serving size control; when \`initialRecipe.servings\` is set, changing it rescales all ingredient quantities live
- **Image zone** — drag-and-drop / tap-to-upload photo area (pattern-scoped, not a shared component)
- **Auto-expanding textarea** — title and each direction step grow vertically as the user types (pattern-scoped)
- **Category chips** — tag-style input for recipe categories (comma or Enter to add, Backspace to remove)

## Key props
- \`initialRecipe\` — pre-populated fields: \`title\`, \`ingredients\` (string array), \`directions\` (string array), \`servings\`, \`categories\`
- \`onSave(data)\` — called with \`{ title, ingredients, directions, servings, categories, imageFile }\` on Save tap
- \`onCancel()\` — called on Cancel tap; the parent is responsible for navigation
- \`isSaving\` — disables the Save button and shows "Saving…" while the async save is in progress
- \`preferredServings\` — optional override for the initial serving count (e.g. from user preferences)
        `,
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
  parameters: {
    docs: {
      description: {
        story: 'All fields pre-populated from a parsed file — title, 4 ingredients, 3 directions, 2 servings, and categories. Represents the most common import path where the user just reviews and saves.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Blank form — no pre-populated data. Used when the user wants to create a recipe from scratch rather than import one. Save is disabled until a title is entered.',
      },
    },
  },
  args: {
    initialRecipe: {},
    onSave: (data) => console.log('Save:', data),
    onCancel: () => console.log('Cancel'),
  },
};

/**
 * Long title — demonstrates multi-line auto-expanding title textarea
 */
export const LongTitle = {
  parameters: {
    docs: {
      description: {
        story: 'Title overflows a single line — the title textarea auto-expands to two lines and the rest of the form adjusts. Verifies that long imported titles do not clip or overflow.',
      },
    },
  },
  args: {
    initialRecipe: {
      ...parsedRecipe,
      title: 'Gerösteter Auberginensalat mit Naturjoghurt, Knoblauch und Pul Biber',
    },
    onSave: (data) => console.log('Save:', data),
    onCancel: () => console.log('Cancel'),
  },
};

/**
 * Save in progress — button disabled with loading text
 */
export const Saving = {
  parameters: {
    docs: {
      description: {
        story: 'Async save in progress — Save button is disabled and shows "Saving…". Represents the brief window between the user confirming and the API call completing.',
      },
    },
  },
  args: {
    initialRecipe: parsedRecipe,
    onSave: () => {},
    onCancel: () => {},
    isSaving: true,
  },
};
