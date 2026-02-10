

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "storybook-design-token",
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: {
          dev: true,  // Story URL retrieval and UI building instructions
          docs: true, // Component manifest and documentation (requires experimentalComponentsManifest)
        },
        experimentalFormat: "markdown", // Output format: 'markdown' or 'xml'
      },
    },
  ],
  features: {
    experimentalComponentsManifest: true,
  },
  "framework": "@storybook/react-vite"
};
export default config;