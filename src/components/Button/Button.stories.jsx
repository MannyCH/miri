import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Button component with 4 variants and 5 interaction states, matching the Figma Design Library exactly.
Built with Base UI for full accessibility (keyboard navigation, focus management, ARIA).

## Variants
| Variant | Use case |
|---|---|
| \`primary\` | Main call-to-action |
| \`secondary\` | Secondary action alongside a primary |
| \`tertiary\` | Low-priority or inline action |
| \`tertiary-delete\` | Destructive action (delete, remove) |

## States
| State | Trigger | Token applied |
|---|---|---|
| Default | — | Base fill/stroke |
| Hover | \`:hover\` | See token table below |
| Pressed | \`[data-active]\` / \`:active\` | See token table below |
| Focus | \`:focus-visible\` / \`[data-focus-visible]\` | Variant-specific focus token mapping |
| Disabled | \`[disabled]\` / \`:disabled\` | Weak token mapping (see table) |

## Token mapping (from Figma)
| Variant | Property | Default | Hover | Pressed | Focus | Disabled |
|---|---|---|---|---|---|---|
| Primary | background | \`Fill/Brand strong\` | \`Brand/Light/800\` (80%) | \`Fill/Brand strong\` + inner shadow | \`Fill/Brand strong\` | \`Stroke/Weak\` |
| Primary | text/icon | \`Text/Inverted\` | — | — | — | \`Stroke/Weak\` |
| Primary | border/outline | — | — | — | \`Stroke/Focus\` 2px | \`Stroke/Weak\` |
| Secondary | background | transparent (no fill) | \`Fill/Hover\` (5%) | transparent (no fill) | transparent (no fill) | transparent (no fill) |
| Secondary | border | \`Stroke/Brand strong\` | \`Stroke/Brand strong\` | \`Stroke/Brand strong\` | \`Stroke/Focus\` | \`Stroke/Weak\` |
| Secondary | text/icon | \`Text/Brand\` | — | — | — | \`Stroke/Weak\` |
| Secondary | outline | — | — | — | — | — |
| Tertiary | background | transparent | \`Fill/Hover\` | \`Fill/Press\` | \`Fill/Hover\` | \`Stroke/Weak\` |
| Tertiary | text/icon | \`Text/Brand\` | — | — | — | \`Stroke/Weak\` |
| Tertiary | border/outline | — | — | — | \`Stroke/Focus\` 2px | \`Stroke/Weak\` |
| Tertiary Delete | background | transparent | \`Fill/Hover\` | \`Fill/Press\` | \`Fill/Hover\` | \`Stroke/Error weak\` |
| Tertiary Delete | text/icon | \`Text/Error\` | — | — | — | \`Stroke/Error weak\` |
| Tertiary Delete | border/outline | — | — | — | \`Stroke/Error strong\` 2px | \`Stroke/Error weak\` |
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'tertiary-delete'],
      description: 'Visual variant matching Figma Property 1',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Show/hide icon slot',
      table: { defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state — keeps 100% opacity and uses weak semantic tokens.',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      control: 'text',
      description: 'Button label text',
    },
  },
};

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// ─── Single variant stories ───────────────────────────────────────────────────

export const Primary = {
  args: { variant: 'primary', children: 'Label', showIcon: true, icon: <HeartIcon /> },
};

export const Secondary = {
  args: { variant: 'secondary', children: 'Label', showIcon: true, icon: <HeartIcon /> },
};

export const Tertiary = {
  args: { variant: 'tertiary', children: 'Label', showIcon: false },
};

export const TertiaryDelete = {
  args: { variant: 'tertiary-delete', children: 'Label', showIcon: false },
};

export const Disabled = {
  args: { variant: 'primary', children: 'Label', showIcon: true, icon: <HeartIcon />, disabled: true },
  parameters: {
    docs: {
      description: {
        story: 'All variants support `disabled`. Disabled styling now uses weak semantic tokens with full opacity (100%).',
      },
    },
  },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants = {
  name: 'All Variants',
  parameters: {
    docs: {
      description: {
        story: 'All 4 Figma variants side by side. Hover, click and tab through each to see interaction states.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)', alignItems: 'flex-start' }}>
      <Button variant="primary" icon={<HeartIcon />} showIcon>Label</Button>
      <Button variant="secondary" icon={<HeartIcon />} showIcon>Label</Button>
      <Button variant="tertiary">Label</Button>
      <Button variant="tertiary-delete">Label</Button>
    </div>
  ),
};

// ─── State showcase grid (mirrors Figma 4×5 grid) ────────────────────────────

const StateRow = ({ variant, icon, showIcon }) => {
  const pseudoStyle = (extra) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-8)',
    padding: 'var(--spacing-12)',
    borderRadius: 'var(--corner-radius-8)',
    cursor: 'pointer',
    transition: 'none',
    ...extra,
  });

  const fills = {
    primary: {
      default: { background: 'var(--color-fill-brand-strong)', color: 'var(--color-text-inverted)', border: 'none' },
      hover:   { background: 'var(--color-fill-hover), var(--color-fill-brand-strong)', color: 'var(--color-text-inverted)', border: 'none' },
      pressed: { background: 'var(--color-fill-press), var(--color-fill-brand-strong)', color: 'var(--color-text-inverted)', border: 'none' },
      focus:   { background: 'var(--color-fill-brand-strong)', color: 'var(--color-text-inverted)', border: 'none', outline: '2px solid var(--color-stroke-focus)', outlineOffset: '2px' },
      disabled:{ background: 'var(--color-stroke-weak)', color: 'var(--color-stroke-weak)', border: '1px solid var(--color-stroke-weak)' },
    },
    secondary: {
      default: { background: 'transparent', color: 'var(--color-text-brand)', border: '1px solid var(--color-stroke-brand-strong)' },
      hover:   { background: 'var(--color-fill-hover)', color: 'var(--color-text-brand)', border: '1px solid var(--color-stroke-brand-strong)' },
      pressed: { background: 'transparent', color: 'var(--color-text-brand)', border: '1px solid var(--color-stroke-brand-strong)' },
      focus:   { background: 'transparent', color: 'var(--color-text-brand)', border: '1px solid var(--color-stroke-focus)' },
      disabled:{ background: 'transparent', color: 'var(--color-stroke-weak)', border: '1px solid var(--color-stroke-weak)' },
    },
    tertiary: {
      default: { background: 'transparent', color: 'var(--color-text-brand)', border: 'none', textDecoration: 'underline' },
      hover:   { background: 'var(--color-fill-hover)', color: 'var(--color-text-brand)', border: 'none', textDecoration: 'underline' },
      pressed: { background: 'var(--color-fill-press)', color: 'var(--color-text-brand)', border: 'none', textDecoration: 'underline' },
      focus:   { background: 'var(--color-fill-hover)', color: 'var(--color-text-brand)', border: 'none', textDecoration: 'underline', outline: '2px solid var(--color-stroke-focus)', outlineOffset: '2px' },
      disabled:{ background: 'var(--color-stroke-weak)', color: 'var(--color-stroke-weak)', border: '1px solid var(--color-stroke-weak)', textDecoration: 'none' },
    },
    'tertiary-delete': {
      default: { background: 'transparent', color: 'var(--color-text-error)', border: 'none', textDecoration: 'underline' },
      hover:   { background: 'var(--color-fill-hover)', color: 'var(--color-text-error)', border: 'none', textDecoration: 'underline' },
      pressed: { background: 'var(--color-fill-press)', color: 'var(--color-text-error)', border: 'none', textDecoration: 'underline' },
      focus:   { background: 'var(--color-fill-hover)', color: 'var(--color-text-error)', border: 'none', textDecoration: 'underline', outline: '2px solid var(--color-stroke-error-strong)', outlineOffset: '2px' },
      disabled:{ background: 'var(--color-stroke-error-weak)', color: 'var(--color-stroke-error-weak)', border: '1px solid var(--color-stroke-error-weak)', textDecoration: 'none' },
    },
  };

  const v = fills[variant];

  return ['default', 'hover', 'pressed', 'focus', 'disabled'].map((state) => (
    <div key={state} style={pseudoStyle(v[state])}>
      {showIcon && <span style={{ display: 'flex' }}><HeartIcon /></span>}
      <span className="text-body-small-bold">Label</span>
    </div>
  ));
};

export const AllStates = {
  name: 'All States (Figma reference)',
  parameters: {
    docs: {
      description: {
        story: `
Static snapshot of all 20 states (4 variants × 5 states) exactly as designed in Figma.
This mirrors the \`Property 1 × State\` grid in the Design Library.
Interact with the live buttons above to see real CSS transitions.
Includes Disabled state with weak token mapping and full opacity.
        `,
      },
    },
  },
  render: () => {
    const headerStyle = {
      color: 'var(--color-text-weak)',
      textAlign: 'center',
      padding: '0 var(--spacing-8)',
    };
    const rowLabelStyle = {
      color: 'var(--color-text-weak)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 'var(--spacing-16)',
      whiteSpace: 'nowrap',
    };

    const variants = [
      { key: 'primary',        label: 'Primary',         showIcon: true },
      { key: 'secondary',      label: 'Secondary',       showIcon: true },
      { key: 'tertiary',       label: 'Tertiary',        showIcon: false },
      { key: 'tertiary-delete',label: 'Tertiary Delete', showIcon: false },
    ];

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px repeat(5, 1fr)',
        gap: 'var(--spacing-16)',
        padding: 'var(--spacing-24)',
        background: 'var(--color-background-base)',
        borderRadius: 'var(--corner-radius-8)',
        border: '1px solid var(--color-stroke-weak)',
        alignItems: 'center',
      }}>
        {/* Header row */}
        <div />
        {['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'].map(s => (
          <div key={s} style={headerStyle} className="text-tiny-regular">{s}</div>
        ))}

        {/* Variant rows */}
        {variants.map(({ key, label, showIcon }) => (
          <React.Fragment key={key}>
            <div style={rowLabelStyle} className="text-tiny-regular">{label}</div>
            <StateRow variant={key} showIcon={showIcon} />
          </React.Fragment>
        ))}
      </div>
    );
  },
};
