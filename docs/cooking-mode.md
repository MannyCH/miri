# Cooking Mode — Feature Spec

## User Goal

Cook through a recipe step by step without losing track, while hands are busy and mental load is high. Each step is clear, sequential, and self-contained — no need to jump between an ingredients list and a directions paragraph.

---

## Entry Point

- On the **RecipeDetailView**, a **"Cook" button** is visible alongside (or replacing) the "Add to list" button.
- Tapping "Cook" transitions the view into **Cooking Mode**.
- The user has already set their desired servings via the stepper before entering — quantities in cooking mode reflect the scaled values.

---

## Core Concept: Action Cards

Cooking mode reframes a recipe's steps as **action cards**. Each card is a self-contained instruction combining:
- The **quantity** of the ingredient(s) involved
- The **action** to perform

Example card:
> **75g potatoes**
> Cut into quarters

This is different from the normal recipe view where ingredients and directions are separate lists. In cooking mode they are merged into a single sequential flow.

---

## States

### `idle` (Normal Recipe View)
- RecipeDetailView is shown as usual
- "Cook" button is present
- Servings stepper is accessible

### `cooking` (Cooking Mode Active)
- Full-screen card stack view replaces the recipe detail
- Only the **current step card** is fully visible and readable
- Subsequent cards are visible but progressively faded:
  - Step N+1: 60% opacity
  - Step N+2: 30% opacity
  - Step N+3: 10% opacity
  - Step N+4+: not shown
- No ingredient list, no directions list — only the card stack
- A **step counter** is shown (e.g. "Step 2 of 7")
- An **exit button** (×) returns to the recipe detail view

### `transitioning` (Between Steps)
- User taps "Done" or swipes on the current card
- Current card animates out (slides up or fades out)
- Next card slides up to full opacity with a smooth animation
- Cards below shift up and their opacity adjusts accordingly
- Duration: ~300ms

### `finished`
- User completes the last step
- A **completion screen** is shown: "You're done! Enjoy your meal."
- Options: "Back to recipe" or "Add to shopping list" (if not already added)

---

## Transitions

| From | Event | To |
|------|-------|----|
| `idle` | Tap "Cook" | `cooking` (step 1) |
| `cooking` | Tap "Done" / swipe | `transitioning` |
| `transitioning` | Animation complete | `cooking` (next step) |
| `cooking` (last step) | Tap "Done" | `finished` |
| `cooking` | Tap × (exit) | `idle` |
| `finished` | Tap "Back to recipe" | `idle` |

---

## Action Card Content

Each action card maps to one cooking step. The card contains:

| Element | Description |
|---------|-------------|
| **Step number** | Small label, e.g. "Step 3" |
| **Ingredients involved** | Quantities + ingredient names relevant to this step (e.g. "75g potatoes, 2 cloves garlic") |
| **Action** | The instruction text, written as a clear imperative (e.g. "Peel and cut into quarters") |
| **Timer (optional)** | If the step involves a duration (e.g. "cook for 10 minutes"), a start-able timer is shown |

---

## Data Model

Cooking mode steps are **derived from the recipe's existing directions**, not a separate data field. The AI-parsed directions already contain sequential instructions; cooking mode renders each direction as one action card.

Quantities referenced in a direction step are extracted by matching ingredients mentioned in the text to the recipe's ingredient list. This can be done:
- At parse time (AI-assisted during import) — ideal, most accurate
- At render time (pattern matching) — simpler, good enough for V1

**V1 approach:** Each direction step becomes one card. Ingredient quantities are not yet auto-extracted into the card header — the card shows the full direction text as written. A future version parses quantities out of the text.

---

## Opacity Stack Layout

```
┌─────────────────────────────┐  ← Current step (100% opacity, full size)
│  Step 3 of 7                │
│  75g potatoes               │
│  Cut into quarters          │
│                  [ Done → ] │
└─────────────────────────────┘
┌─────────────────────────────┐  ← Step 4 (60% opacity, slightly scaled down)
│  Add olive oil to pan...    │
└─────────────────────────────┘
┌─────────────────────────────┐  ← Step 5 (30% opacity)
│  ...                        │
└─────────────────────────────┘
```

Cards are stacked vertically with a visible peek. The active card is fully interactive; lower cards are non-interactive (pointer-events: none).

---

## Edge Cases

| Scenario | Behaviour |
|----------|-----------|
| Recipe has no directions | "Cook" button is hidden |
| Only 1 step | No opacity stack — single card, tapping "Done" goes straight to finished |
| User exits mid-recipe | Progress is not saved — re-entering starts from step 1 |
| Screen goes to sleep | No special handling in V1 — screen lock behaviour is OS default |
| Very long direction text | Card scrolls internally; card height is capped |
| Recipe not yet scaled | Quantities in cards reflect whatever servings were set before entering |

---

## Out of Scope (V1)

- Auto-extracting ingredient quantities into the card header (V1 shows full direction text)
- Built-in timers per step
- Voice control / hands-free navigation
- Progress persistence across sessions
- Reordering or editing steps within cooking mode
