import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecipesView } from '../patterns/RecipesView';
import { Button } from '../components/Button/Button';
import { TextField } from '../components/TextField/TextField';
import './RecipesPage.css';

export default {
  title: 'Pages/RecipesPage',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-screen recipe browsing page wired to Router and AppContext. Stories here snapshot page-level states that require the URL import overlay (bottom sheet).

## Overlay states
- **URL Import Open** — user has tapped "Import from URL"; the bottom sheet slides up with a URL text field and Cancel / Import buttons.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/recipes']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const sampleRecipes = [
  {
    id: '1',
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Grilled chicken with quinoa and broccoli',
    thumbnail: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'Vegetable stir-fry with tofu and rice',
    thumbnail: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop',
  },
];

export const UrlImportOpen = {
  name: 'URL Import (overlay open)',
  parameters: {
    docs: {
      description: {
        story: 'URL import overlay open — bottom sheet slides up from the bottom of the screen above the navigation bar. Triggered when the user selects "Import from URL" from the import method sheet.',
      },
    },
  },
  render: () => {
    const [urlValue, setUrlValue] = React.useState('');
    return (
      <>
        <RecipesView
          recipes={sampleRecipes}
          searchQuery=""
          onImportRequest={() => {}}
        />
        <div
          className="recipes-url-overlay"
          role="dialog"
          aria-label="Import recipe from URL"
          aria-modal="true"
        >
          <div className="recipes-url-sheet">
            <div className="recipes-url-sheet-handle" aria-hidden="true" />
            <h2 className="text-h3-bold recipes-url-title">Paste Recipe URL</h2>
            <TextField
              type="url"
              inputMode="url"
              value={urlValue}
              onChange={setUrlValue}
              placeholder="https://..."
              aria-label="Recipe URL"
            />
            <div className="recipes-url-actions">
              <Button
                variant="ghost"
                style={{ flex: 1 }}
                onClick={() => setUrlValue('')}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                style={{ flex: 2 }}
                onClick={() => {}}
                disabled={!urlValue.trim()}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  },
};
