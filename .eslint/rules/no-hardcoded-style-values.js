const COLOR_PROPS = new Set([
  'color', 'backgroundColor', 'background',
  'borderColor', 'borderTopColor', 'borderBottomColor',
  'borderLeftColor', 'borderRightColor', 'outlineColor',
  'fill', 'stroke',
]);

const SPACING_PROPS = new Set([
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'gap', 'rowGap', 'columnGap',
  'borderRadius', 'fontSize',
]);

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const RGB_RE = /^rgba?\s*\(/;
const HSL_RE = /^hsla?\s*\(/;
const PX_RE = /^-?\d*\.?\d+px$/;

function isHardcodedColor(value) {
  return HEX_RE.test(value) || RGB_RE.test(value) || HSL_RE.test(value);
}

function isHardcodedPx(value) {
  return PX_RE.test(value) && value !== '0px';
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded color and spacing values in style props. Use design tokens via CSS variables instead.',
    },
    messages: {
      hardcodedColor:
        'Hardcoded color "{{value}}" in style prop "{{prop}}". Use a CSS variable from design-tokens.css.',
      hardcodedSpacing:
        'Hardcoded px value "{{value}}" in style prop "{{prop}}". Use a CSS variable from design-tokens.css.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.name !== 'style') return;

        const expr = node.value?.expression;
        if (!expr || expr.type !== 'ObjectExpression') return;

        for (const prop of expr.properties) {
          if (prop.type !== 'Property') continue;

          const key = prop.key?.name ?? prop.key?.value;
          const val = prop.value;

          if (!key || val?.type !== 'Literal' || typeof val.value !== 'string') continue;

          if (COLOR_PROPS.has(key) && isHardcodedColor(val.value)) {
            context.report({
              node: prop,
              messageId: 'hardcodedColor',
              data: { prop: key, value: val.value },
            });
          } else if (SPACING_PROPS.has(key) && isHardcodedPx(val.value)) {
            context.report({
              node: prop,
              messageId: 'hardcodedSpacing',
              data: { prop: key, value: val.value },
            });
          }
        }
      },
    };
  },
};
