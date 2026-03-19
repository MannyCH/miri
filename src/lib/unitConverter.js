/**
 * Unit conversion utility for recipe ingredients.
 * Converts between metric and imperial systems.
 * Operates on free-form ingredient strings like "2 cups flour" or "100g butter".
 */

// Imperial → Metric conversions (to ml for volume, to g for weight)
const IMPERIAL_TO_METRIC = [
  { pattern: /(\d+(?:\.\d+)?)\s*cups?/gi, unit: 'cup', toMetric: (v) => `${Math.round(v * 240)} ml` },
  { pattern: /(\d+(?:\.\d+)?)\s*tbsp/gi, unit: 'tbsp', toMetric: (v) => `${Math.round(v * 15)} ml` },
  { pattern: /(\d+(?:\.\d+)?)\s*tsp/gi, unit: 'tsp', toMetric: (v) => `${Math.round(v * 5)} ml` },
  { pattern: /(\d+(?:\.\d+)?)\s*fl\.?\s*oz/gi, unit: 'fl oz', toMetric: (v) => `${Math.round(v * 30)} ml` },
  { pattern: /(\d+(?:\.\d+)?)\s*oz/gi, unit: 'oz', toMetric: (v) => `${Math.round(v * 28)} g` },
  { pattern: /(\d+(?:\.\d+)?)\s*lbs?/gi, unit: 'lb', toMetric: (v) => `${Math.round(v * 454)} g` },
  { pattern: /(\d+(?:\.\d+)?)\s*pounds?/gi, unit: 'pound', toMetric: (v) => `${Math.round(v * 454)} g` },
];

// Metric → Imperial conversions
const METRIC_TO_IMPERIAL = [
  { pattern: /(\d+(?:\.\d+)?)\s*ml/gi, unit: 'ml', toImperial: (v) => v >= 240 ? `${(v / 240).toFixed(1).replace(/\.0$/, '')} cups` : v >= 15 ? `${Math.round(v / 15)} tbsp` : `${Math.round(v / 5)} tsp` },
  { pattern: /(\d+(?:\.\d+)?)\s*l(?:iter)?s?/gi, unit: 'l', toImperial: (v) => `${(v * 4.23).toFixed(1).replace(/\.0$/, '')} cups` },
  { pattern: /(\d+(?:\.\d+)?)\s*g(?:rams?)?(?!\s*arlic)/gi, unit: 'g', toImperial: (v) => v >= 454 ? `${(v / 454).toFixed(1).replace(/\.0$/, '')} lbs` : `${(v / 28).toFixed(1).replace(/\.0$/, '')} oz` },
  { pattern: /(\d+(?:\.\d+)?)\s*kg/gi, unit: 'kg', toImperial: (v) => `${(v * 2.2).toFixed(1).replace(/\.0$/, '')} lbs` },
];

/**
 * Convert a single ingredient string to the target unit system.
 * Returns the original string unchanged if no known units are found.
 */
export function convertIngredient(ingredient, targetSystem) {
  if (!ingredient || targetSystem === 'any') return ingredient;

  let result = ingredient;

  if (targetSystem === 'metric') {
    for (const { pattern, toMetric } of IMPERIAL_TO_METRIC) {
      result = result.replace(pattern, (match, num) => {
        const converted = toMetric(parseFloat(num));
        return match.replace(/\d+(?:\.\d+)?\s*\S+/, converted);
      });
      pattern.lastIndex = 0;
    }
  } else if (targetSystem === 'imperial') {
    for (const { pattern, toImperial } of METRIC_TO_IMPERIAL) {
      result = result.replace(pattern, (match, num) => {
        const converted = toImperial(parseFloat(num));
        return match.replace(/\d+(?:\.\d+)?\s*\S+/, converted);
      });
      pattern.lastIndex = 0;
    }
  }

  return result;
}

/**
 * Convert an array of ingredient strings to the target unit system.
 */
export function convertIngredients(ingredients, targetSystem) {
  if (!targetSystem || targetSystem === 'any') return ingredients;
  return ingredients.map(i => convertIngredient(i, targetSystem));
}

// ---------------------------------------------------------------------------
// Serving scaler
// ---------------------------------------------------------------------------

/** Parse "1 1/2", "1/2", "2", or "2.5" → number */
function parseMixed(str) {
  const s = str.trim();
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]);
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) return parseInt(frac[1]) / parseInt(frac[2]);
  return parseFloat(s);
}

const VULGAR_FRACTIONS = [
  [1 / 8, '⅛'], [1 / 4, '¼'], [1 / 3, '⅓'], [3 / 8, '⅜'],
  [1 / 2, '½'], [5 / 8, '⅝'], [2 / 3, '⅔'], [3 / 4, '¾'], [7 / 8, '⅞'],
];

/** Format a scaled number back to a readable quantity string */
function formatQuantity(n) {
  if (n <= 0) return '0';
  const whole = Math.floor(n);
  const frac = n - whole;

  if (frac < 0.04) return String(whole);

  for (const [val, sym] of VULGAR_FRACTIONS) {
    if (Math.abs(frac - val) < 0.08) {
      return whole > 0 ? `${whole}${sym}` : sym;
    }
  }

  return n % 1 === 0 ? String(n) : n.toFixed(1).replace(/\.0$/, '');
}

/**
 * Scale the leading quantity in a single ingredient string.
 * e.g. scaleIngredient("200 g flour", 2) → "400 g flour"
 *      scaleIngredient("1 1/2 cups milk", 2) → "3 cups milk"
 */
export function scaleIngredient(ingredient, factor) {
  if (!ingredient || Math.abs(factor - 1) < 0.001) return ingredient;
  return ingredient.replace(
    /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/,
    (match) => formatQuantity(parseMixed(match) * factor)
  );
}

/**
 * Scale an array of ingredient strings by a serving factor.
 */
export function scaleIngredients(ingredients, factor) {
  if (!ingredients || Math.abs(factor - 1) < 0.001) return ingredients;
  return ingredients.map(i => scaleIngredient(i, factor));
}
