import React from 'react';
import { BatchImportSection } from './BatchImportSection';

export default {
  title: 'Components/BatchImportSection',
  component: BatchImportSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Section widget for bulk-importing recipes from a local folder. Pairs \`.txt\` recipe files with same-named image files, shows a progress bar during the import, and summarises successes/failures when done.

## When to use
- On the account or settings page when the user wants to seed their recipe library from a folder of exported files
- Only for power-user / admin-style bulk data entry — not for single-recipe creation

## When NOT to use
- Don't use for importing a single recipe — the standard recipe creation form is more appropriate
- Don't embed inside a list row or card; it is a self-contained section meant to fill a content area

## Pairs well with
- Placed inside an account/settings page beneath the \`AccountCard\`
- Can be preceded by a short explainer paragraph about the expected folder structure (\`.txt\` + matching image filenames)`,
      },
    },
  },
};

export const Default = {
  args: {
    onRecipeImported: (recipe) => console.log('Imported:', recipe.title),
  },
  parameters: {
    docs: {
      description: {
        story: 'Idle state — shows the description and "Choose folder" button. Selecting a folder transitions to the running progress state, then to the done summary. Because folder access requires a real browser interaction, only the idle state is previewable in Storybook.',
      },
    },
  },
};
