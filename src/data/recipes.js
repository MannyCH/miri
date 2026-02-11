/**
 * Mock Recipe Database
 * Complete recipes with ingredients and cooking directions
 */

export const recipes = [
  {
    id: 'salmon-asparagus',
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    category: 'dinner',
    ingredients: [
      '2 salmon fillets (about 6 oz each)',
      '1 bunch asparagus',
      '2 cups cherry tomatoes',
      '3 cloves garlic, minced',
      '2 tbsp olive oil',
      'Salt and pepper to taste',
      '1 lemon, zested and juiced',
      'Fresh dill or thyme (optional)',
    ],
    directions: [
      'Preheat the oven to 200 °C / 400 °F. Line a large baking sheet with parchment (or lightly oil it) so the salmon doesn\'t stick. While the oven heats, take the salmon out of the fridge so it can lose some chill — this helps it cook more evenly.',
      'Pat the salmon fillets dry with paper towels and place them skin-side down on the sheet. Snap or cut the woody ends off the asparagus, then spread the spears around the fish in a single layer so they roast instead of steaming.',
      'Drizzle everything generously with olive oil. Season with salt and freshly ground pepper, then add garlic (powder or minced), lemon zest, and a good squeeze of lemon juice. If you like herbs, tuck a few sprigs of dill or thyme around the fillets.',
      'Roast for 12–15 minutes, depending on thickness, until the salmon just flakes with a fork and the asparagus is tender with lightly browned tips. For extra color, broil 1–2 minutes at the end. Rest the salmon briefly, then serve with more lemon and a drizzle of olive oil or a small knob of butter.',
    ],
  },
  {
    id: 'chicken-fajita-salad',
    title: 'Chicken Fajita Salad',
    thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    category: 'lunch',
    ingredients: [
      '2 chicken breasts',
      '1 red bell pepper, sliced',
      '1 yellow bell pepper, sliced',
      '1 red onion, sliced',
      '2 tbsp fajita seasoning',
      '4 cups mixed greens',
      '1 avocado, sliced',
      '1/4 cup sour cream',
      '1 lime, juiced',
      'Olive oil',
    ],
    directions: [
      'Season chicken breasts with fajita seasoning. Heat olive oil in a large skillet over medium-high heat.',
      'Cook chicken for 6-7 minutes per side until golden and cooked through. Remove and let rest for 5 minutes.',
      'In the same skillet, add bell peppers and onions. Sauté for 5-6 minutes until softened and slightly charred.',
      'Slice the chicken into strips. Arrange mixed greens on plates, top with chicken, peppers, onions, and avocado. Drizzle with sour cream and lime juice.',
    ],
  },
  {
    id: 'spicy-shrimp-tacos',
    title: 'Spicy Shrimp Tacos with Avocado Salsa',
    thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    category: 'dinner',
    ingredients: [
      '1 lb large shrimp, peeled',
      '2 tsp chili powder',
      '1 tsp cumin',
      '8 small tortillas',
      '2 avocados, diced',
      '1 tomato, diced',
      '1/4 red onion, minced',
      '1 jalapeño, minced',
      '1 lime, juiced',
      'Cilantro, chopped',
      'Sour cream',
    ],
    directions: [
      'Toss shrimp with chili powder, cumin, salt, and pepper. Heat oil in a skillet over high heat.',
      'Cook shrimp for 2-3 minutes per side until pink and cooked through.',
      'Make salsa: Mix avocados, tomato, onion, jalapeño, lime juice, and cilantro in a bowl.',
      'Warm tortillas. Fill with shrimp, top with avocado salsa and sour cream.',
    ],
  },
  {
    id: 'greek-yogurt-parfait',
    title: 'Greek Yogurt Parfait',
    thumbnail: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    category: 'breakfast',
    ingredients: [
      '2 cups Greek yogurt',
      '1 cup granola',
      '1 cup mixed berries',
      '2 tbsp honey',
      '1/4 cup sliced almonds',
      'Fresh mint leaves',
    ],
    directions: [
      'Layer half the yogurt in glasses or bowls.',
      'Add half the granola and half the berries.',
      'Repeat with remaining yogurt, granola, and berries.',
      'Drizzle with honey and top with almonds and mint.',
    ],
  },
  {
    id: 'veggie-omelette',
    title: 'Garden Veggie Omelette',
    thumbnail: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    category: 'breakfast',
    ingredients: [
      '3 eggs',
      '1/4 cup milk',
      '1/2 cup spinach, chopped',
      '1/4 cup mushrooms, sliced',
      '1/4 cup bell peppers, diced',
      '1/4 cup cheese, shredded',
      'Salt and pepper',
      'Butter for cooking',
    ],
    directions: [
      'Whisk eggs with milk, salt, and pepper in a bowl.',
      'Melt butter in a non-stick pan over medium heat.',
      'Add vegetables and sauté for 2-3 minutes until softened.',
      'Pour in egg mixture and cook until edges set. Sprinkle cheese on one half.',
      'Fold omelette in half and cook for another minute. Slide onto plate.',
    ],
  },
  {
    id: 'quinoa-bowl',
    title: 'Mediterranean Quinoa Bowl',
    thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    category: 'lunch',
    ingredients: [
      '1 cup quinoa, cooked',
      '1 cucumber, diced',
      '1 cup cherry tomatoes, halved',
      '1/2 cup feta cheese, crumbled',
      '1/4 cup kalamata olives',
      '2 tbsp olive oil',
      '1 lemon, juiced',
      'Fresh parsley',
      'Salt and pepper',
    ],
    directions: [
      'Cook quinoa according to package directions and let cool.',
      'Mix olive oil, lemon juice, salt, and pepper for dressing.',
      'Combine quinoa, cucumber, tomatoes, feta, and olives in a bowl.',
      'Drizzle with dressing and toss gently. Garnish with parsley.',
    ],
  },
  {
    id: 'thai-curry',
    title: 'Thai Green Curry',
    thumbnail: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
    category: 'dinner',
    ingredients: [
      '2 tbsp green curry paste',
      '1 can coconut milk',
      '2 chicken breasts, sliced',
      '1 cup bamboo shoots',
      '1 red bell pepper, sliced',
      '1 cup basil leaves',
      '2 tbsp fish sauce',
      '1 tbsp brown sugar',
      'Jasmine rice for serving',
    ],
    directions: [
      'Heat curry paste in a large pot for 1 minute until fragrant.',
      'Add coconut milk and bring to a simmer.',
      'Add chicken and cook for 10 minutes until cooked through.',
      'Add bamboo shoots and bell pepper. Simmer for 5 minutes.',
      'Stir in fish sauce, sugar, and basil. Serve over jasmine rice.',
    ],
  },
  {
    id: 'caprese-panini',
    title: 'Caprese Panini',
    thumbnail: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400',
    image: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800',
    category: 'lunch',
    ingredients: [
      '4 ciabatta rolls',
      '2 large tomatoes, sliced',
      '8 oz fresh mozzarella, sliced',
      'Fresh basil leaves',
      '2 tbsp balsamic glaze',
      'Olive oil',
      'Salt and pepper',
    ],
    directions: [
      'Slice rolls in half and brush outsides with olive oil.',
      'Layer mozzarella, tomato, and basil inside rolls. Season with salt and pepper.',
      'Heat a panini press or grill pan over medium heat.',
      'Grill sandwiches for 4-5 minutes until bread is golden and cheese melts.',
      'Drizzle with balsamic glaze before serving.',
    ],
  },
];

/**
 * Get random recipes for auto-generating meal plans
 */
export function getRandomRecipes(count, category = null) {
  let filtered = recipes;
  
  if (category) {
    filtered = recipes.filter(r => r.category === category);
  }
  
  // Shuffle and take first 'count' items
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get recipe by ID
 */
export function getRecipeById(id) {
  return recipes.find(r => r.id === id);
}

/**
 * Generate a 7-day meal plan
 */
export function generateMealPlan() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dates = Array.from({ length: 7 }, (_, i) => 22 + i); // 22-28
  
  return days.map((day, index) => ({
    day,
    date: dates[index],
    meals: {
      breakfast: getRandomRecipes(1, 'breakfast')[0],
      lunch: getRandomRecipes(1, 'lunch')[0],
      dinner: getRandomRecipes(1, 'dinner')[0],
    },
  }));
}
