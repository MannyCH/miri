import React from 'react';
import { BatchImportSection } from './BatchImportSection';

export default {
  title: 'Components/BatchImportSection',
  component: BatchImportSection,
  parameters: {
    docs: {
      description: {
        component:
          'Allows batch importing recipes from a folder. Pairs .txt recipe files with image files of the same base name. Shows a progress bar during import and a result summary when done.',
      },
    },
  },
};

export const Default = {
  args: {
    onRecipeImported: (recipe) => console.log('Imported:', recipe.title),
  },
};
