import noNativeInteractiveElements from './.eslint/rules/no-native-interactive-elements.js';
import noHardcodedStyleValues from './.eslint/rules/no-hardcoded-style-values.js';

const designSystemPlugin = {
  rules: {
    'no-native-interactive-elements': noNativeInteractiveElements,
    'no-hardcoded-style-values': noHardcodedStyleValues,
  },
};

export default [
  // Inline style hardcoded values — all src files
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'design-system': designSystemPlugin },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'design-system/no-hardcoded-style-values': 'error',
    },
  },

  // Native interactive elements — pages and patterns only
  {
    files: ['src/pages/**/*.{js,jsx}', 'src/patterns/**/*.{js,jsx}'],
    plugins: { 'design-system': designSystemPlugin },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'design-system/no-native-interactive-elements': 'error',
    },
  },
];
