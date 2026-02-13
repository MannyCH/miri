# Storybook Play Functions Guide

Play functions are automated interaction tests that run after a story renders. They enable you to demonstrate and test component interactions without manual intervention.

## What are Play Functions?

Play functions are small code snippets that:
- ✅ Run automatically after a story renders
- ✅ Simulate user interactions (clicks, typing, etc.)
- ✅ Test component behavior and workflows
- ✅ Show step-by-step interactions in the Interactions panel
- ✅ Help catch bugs and regressions

## Benefits

1. **Automated Testing**: Test user flows without manual clicking
2. **Documentation**: Show how components should be used
3. **Regression Prevention**: Catch breaking changes early
4. **Visual Demos**: Demonstrate complex interactions
5. **Chromatic Integration**: Visual tests run on every play function

## Basic Example

```javascript
import { userEvent, within, expect } from 'storybook/test';

export const WithPlayFunction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find element and interact
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    
    // Verify result
    await expect(button).toHaveTextContent('Clicked');
  },
};
```

## Available API

### Imported from `storybook/test`:

```javascript
import { 
  userEvent,  // Simulate user interactions
  within,     // Query elements within canvas
  expect,     // Assertions
  screen,     // Query entire document
  waitFor,    // Wait for conditions
} from 'storybook/test';
```

### User Event Actions:

```javascript
await userEvent.click(element);           // Click element
await userEvent.type(input, 'text');      // Type text
await userEvent.hover(element);           // Hover over element
await userEvent.clear(input);             // Clear input
await userEvent.selectOptions(select, 'value'); // Select option
await userEvent.upload(input, file);      // Upload file
```

### Queries (from Testing Library):

```javascript
canvas.getByRole('button')              // Find by ARIA role
canvas.getByText('Submit')              // Find by text content
canvas.getByLabelText('Email')          // Find by label
canvas.getByTestId('custom-element')    // Find by data-testid
canvas.getByPlaceholderText('Search')   // Find by placeholder
```

### Assertions:

```javascript
await expect(element).toBeInTheDocument();
await expect(element).toHaveTextContent('text');
await expect(element).toBeVisible();
await expect(element).toBeDisabled();
await expect(input).toHaveValue('value');
```

## Real Example: RecipeDetailView

```javascript
export const WithPlayFunction = {
  render: () => {
    // Your component with state management
    const [checked, setChecked] = React.useState({});
    return <RecipeDetailView 
      recipe={recipe}
      checkedIngredients={checked}
      onIngredientCheck={(index, value) => setChecked({...checked, [index]: value})}
    />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Step 1: Check first ingredient
    const ingredient = canvas.getByText('2 salmon fillets');
    await userEvent.click(ingredient);
    
    // Step 2: Scroll to see button
    const container = canvas.getByRole('article');
    container.scrollTop = 200;
    
    // Step 3: Click "Add to Shopping List"
    const button = canvas.getByRole('button', { name: /add to shopping list/i });
    await userEvent.click(button);
    
    // Step 4: Verify button exists
    await expect(button).toBeInTheDocument();
  },
};
```

## Working with Canvas vs Screen

### Canvas (Recommended)
Use `canvas` to query within the story's root element:

```javascript
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button'); // Scoped to story
}
```

### Screen (For Portals/Modals)
Use `screen` for elements outside the story root:

```javascript
import { screen } from 'storybook/test';

play: async ({ canvas }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
  
  // Dialog renders outside story root
  const dialog = screen.getByRole('dialog');
  await expect(dialog).toBeVisible();
}
```

## Composing Play Functions

Reuse play functions across stories:

```javascript
export const FirstStep = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByTestId('email'), 'user@example.com');
  },
};

export const SecondStep = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByTestId('password'), 'password123');
  },
};

export const CompleteFlow = {
  play: async (context) => {
    // Run previous steps first
    await FirstStep.play(context);
    await SecondStep.play(context);
    
    // Then add final step
    const { canvas } = context;
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  },
};
```

## Adding Delays

Add delays to make interactions visible:

```javascript
play: async ({ canvas }) => {
  await userEvent.click(canvas.getByRole('button'));
  
  // Wait 500ms to see the result
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await userEvent.click(canvas.getByRole('button'));
}
```

Or use `waitFor` for conditional waiting:

```javascript
import { waitFor } from 'storybook/test';

play: async ({ canvas }) => {
  await userEvent.click(canvas.getByRole('button'));
  
  // Wait until element appears
  await waitFor(() => {
    expect(canvas.getByText('Success')).toBeInTheDocument();
  });
}
```

## Debugging Play Functions

### 1. Use the Interactions Panel

Open the Interactions panel in Storybook to see:
- ✅ Each step of the play function
- ✅ Which queries were used
- ✅ What assertions passed/failed
- ✅ Timing of each action

### 2. Add Console Logs

```javascript
play: async ({ canvas }) => {
  const button = canvas.getByRole('button');
  console.log('Found button:', button);
  
  await userEvent.click(button);
  console.log('Button clicked');
}
```

### 3. Use Browser DevTools

- Set breakpoints in the play function
- Inspect elements during execution
- Check console for errors

## Best Practices

### ✅ DO:

- **Write clear step comments**: Explain what each action does
- **Use semantic queries**: Prefer `getByRole` and `getByLabelText`
- **Test realistic workflows**: Mimic actual user behavior
- **Add small delays**: Make interactions visible (300-500ms)
- **Verify results**: Use `expect` assertions
- **Keep it focused**: One workflow per story

### ❌ DON'T:

- **Don't test implementation details**: Test user-facing behavior
- **Don't use brittle selectors**: Avoid class names, IDs
- **Don't make it too long**: Split complex flows into multiple stories
- **Don't forget error states**: Test unhappy paths too
- **Don't ignore accessibility**: Use ARIA roles and labels

## Integration with Chromatic

Play functions run during Chromatic builds:

1. ✅ Chromatic captures screenshots after play function completes
2. ✅ Visual regression testing includes interaction states
3. ✅ Accessibility tests run on the final state
4. ✅ Interaction test results appear in Chromatic dashboard

This means your automated interactions are visually tested on every commit!

## Example Stories with Play Functions

Check these stories for examples:
- `RecipeDetailView > WithPlayFunction` - Checking ingredients and adding to list
- (Add more as you create them)

## Resources

- **Storybook Docs**: https://storybook.js.org/docs/writing-stories/play-function
- **Testing Library**: https://testing-library.com/docs/queries/about
- **User Event**: https://testing-library.com/docs/user-event/intro
- **Chromatic**: https://www.chromatic.com/docs/interactions

## Quick Reference

```javascript
// Story with play function
export const StoryName = {
  render: () => <Component />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find elements
    const button = canvas.getByRole('button');
    const input = canvas.getByLabelText('Email');
    
    // Interact
    await userEvent.type(input, 'test@example.com');
    await userEvent.click(button);
    
    // Verify
    await expect(button).toHaveTextContent('Submitted');
  },
};
```

Start simple, test one interaction at a time, and build up to complex workflows!
