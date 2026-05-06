# Recipe → Cooking Mode: Transformation Spec

## Purpose
Convert raw recipe text into a step-by-step cooking mode format where every
step is self-contained, scannable in under 2 seconds, and requires zero
cross-referencing.

---

## The core problem with traditional recipes

Traditional recipes store ingredients separately from instructions. The cook
must hold both in memory simultaneously. This spec eliminates that by embedding
every quantity at the exact moment it is needed.

Additionally, traditional recipes bundle multiple actions into a single
sentence. This spec splits every action into its own step.

---

## Transformation rules

### Rule 1 — Past participles are hidden steps
Any ingredient described with a past participle (washed, quartered, chopped,
diced, sliced, peeled, crushed, grated, sifted, softened, melted) requires its
own prep step BEFORE the step that uses it.

❌ Traditional:
  "Add 75g yellow lentils, washed"

✅ Cooking mode:
  Step 1 — Wash: 75g yellow lentils (rinse until water runs clear)
  Step 4 — Add to pan: 75g lentils (the washed ones)

### Rule 2 — One verb per step
Each step has exactly one primary action. If a sentence contains multiple
actions, split it.

❌ Traditional:
  "Bring to the boil and cook for 10 minutes. Reduce the heat and cook for a
  further 25 minutes, skimming the surface."

✅ Cooking mode:
  Step 4 — Boil    → 10 min
  Step 5 — Simmer  → 25 min  (skim surface)

### Rule 3 — Quantities belong to actions, not to a list
Never create a separate ingredient list. Every quantity appears inline, in the
step where the cook picks it up.

### Rule 4 — Duration is plain text, not a timer
Show cooking time as a simple number at the bottom of the step.
No buttons, no UI chrome. Just: "10 min"

### Rule 5 — Notes are secondary, never primary
Anything after a comma in an ingredient line is either:
  a) A hidden prep step (past participle) → make it its own step
  b) A helpful visual cue → keep it as a small italic note on the same line

---

## Step data shape

Each step produces exactly this structure:

```
{
  verb: string,          // single imperative verb: Wash, Prep, Add, Boil, Mash, Whisk, Serve
  icon: emoji,           // one emoji representing the action
  items: [
    {
      qty:  string,      // "75g" / "1L" / "¼ tsp" / "—" (if no quantity)
      name: string,      // ingredient or action name
      note: string,      // optional italic cue, empty string if none
    }
  ],
  duration: {            // null if no waiting involved
    num:  string,        // "10"
    unit: string,        // "min" or "min — whisk constantly"
  } | null
}
```

---

## Worked example — Yellow lentil soup

### Raw recipe input

Ingredients:
- 75g split yellow lentils, washed
- 50g potato, quartered
- ½ medium onion (120g), quartered
- 1 tsp salt
- 1L water (first addition)
- 1L boiling water (second addition)
- ¼ tsp ground cumin
- ¼ tsp ground turmeric
- ⅛ tsp white pepper
- ½ lemon, quartered

Instructions:
1. In a large saucepan over medium heat, add 1L water, the yellow lentils,
   potato and onion with 1 tsp salt, bring to the boil, and cook for 10
   minutes. Reduce the heat and cook for a further 25 minutes, until the soup
   thickens. Skim the surface using a slotted spoon.
2. Remove from the heat and mash the contents of the pan. Add 1L boiling water,
   the cumin, turmeric and white pepper and whisk for 1 minute. Return to the
   heat and cook for a further 5 minutes.
3. Serve with lemon quarters.

---

### Transformation walkthrough

**Scan ingredients for past participles:**
- "lentils, washed"    → prep step: Wash
- "potato, quartered"  → prep step: Prep
- "onion, quartered"   → merge into same Prep step (same action)
- "lemon, quartered"   → prep step: Prep (or note at Serve step — judgment call
                         based on timing; here it's last-minute so keep at Serve)

**Scan instructions for multiple actions per sentence:**
- "add … bring to the boil … cook 10 min" → split: Add / Boil
- "reduce heat … cook 25 min … skim"      → Simmer (skim is a note, not a step)
- "remove … mash"                          → Mash (remove is implicit)
- "add … whisk 1 min"                      → Add & Whisk
- "return … cook 5 min"                    → Cook

---

### Output steps

Step 1 — Wash
  icon: 💧
  items:
    - 75g  | yellow lentils | rinse until water runs clear
  duration: null

Step 2 — Prep
  icon: 🔪
  items:
    - 50g  | potato          | cut into quarters
    - ½    | onion (120g)    | cut into quarters
  duration: null

Step 3 — Add to pan
  icon: 🥣
  items:
    - 1L    | water           |
    - 75g   | lentils         | the washed ones
    - 50g   | potato          | the quartered pieces
    - ½     | onion           | the quartered pieces
    - 1 tsp | salt            |
  duration: null

Step 4 — Boil
  icon: 🔥
  items:
    - — | bring to the boil |
  duration: { num: "10", unit: "min" }

Step 5 — Simmer
  icon: 🌡
  items:
    - — | reduce heat  |
    - — | skim surface | slotted spoon
  duration: { num: "25", unit: "min" }

Step 6 — Mash
  icon: 💪
  items:
    - — | remove from heat            |
    - — | mash everything in the pan  |
  duration: null

Step 7 — Add & whisk
  icon: 🥣
  items:
    - 1L     | boiling water |
    - ¼ tsp  | ground cumin  |
    - ¼ tsp  | turmeric      |
    - ⅛ tsp  | white pepper  |
  duration: { num: "1", unit: "min — whisk constantly" }

Step 8 — Cook
  icon: 🔥
  items:
    - — | return to heat |
  duration: { num: "5", unit: "min" }

Step 9 — Serve
  icon: 🍋
  items:
    - ½ | lemon | squeeze over each bowl
  duration: null

---

## Edge cases & judgment calls

| Situation | Rule |
|---|---|
| Two ingredients need the same prep (both quartered) | Merge into one Prep step |
| Past participle happens at serving time (e.g. "lemon, quartered") | Keep as a note in the Serve step, not a separate Prep step |
| "Season to taste" | Use — for qty, write "season to taste" as name |
| Passive voice ("the soup will thicken") | Convert to a visual cue note on the duration line |
| Ingredient appears twice in different amounts | List both separately with clear labels ("first addition", "second addition") |
| "Optional" ingredients | Add "(optional)" as note |
| Parallel tasks possible (e.g. boil water while prepping) | Add a "Meanwhile" sub-note on the waiting step |

---

## Prompt to use this spec

When asking an AI to parse a new recipe, use this prompt:

```
You are converting a recipe into cooking mode steps.
Read the spec in recipe-to-cooking-mode.md and apply every rule strictly.

Rules summary:
1. Past participles = their own prep step before first use
2. One verb per step — split multi-action sentences
3. Quantities inline in the step, never in a separate list
4. Duration = plain text at bottom (no timer UI)
5. Notes = short italic cues, never primary content

Output format: one JSON array of step objects matching the shape in the spec.
Do not invent steps. Do not skip quantities. Do not keep original sentence structure.

Recipe to convert:
[PASTE RECIPE HERE]
```
