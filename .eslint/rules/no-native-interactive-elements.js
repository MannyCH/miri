import componentMap from '../design-system-map.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd(), 'src/components');

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Use design system components instead of native HTML interactive elements in pages and patterns.',
    },
    messages: {
      useComponent:
        'Use <{{component}}> from src/components instead of native <{{element}}>.',
      missingComponent:
        'Design system map references <{{component}}> but src/components/{{component}} does not exist. Update design-system-map.js.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const name = node.name?.name;
        // Native HTML elements are always lowercase; React components start with uppercase
        if (!name || typeof name !== 'string' || name[0] !== name[0].toLowerCase()) return;

        const component = componentMap[name];
        if (!component) return;

        const componentPath = resolve(root, component);
        if (!existsSync(componentPath)) {
          context.report({ node, messageId: 'missingComponent', data: { component } });
          return;
        }

        context.report({ node, messageId: 'useComponent', data: { element: name, component } });
      },
    };
  },
};
