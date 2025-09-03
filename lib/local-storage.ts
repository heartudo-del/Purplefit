// --- DATA STRUCTURES ---
export interface FoodEntry { id: string; name: string; description: string; meal_type: "breakfast" | "lunch" | "dinner"; calories?: number; created_at: string; category: string; }
export interface MealPlan { id: string; title: string; client_name: string; created_at: string; weeks: MealPlanWeek[]; category: 'Normal' | 'Liver Reset'; }
export interface MealPlanWeek { id: string; week_number: number; meals: MealPlanMeal[]; }
export interface MealPlanMeal { id: string; day_of_week: number; meal_type: "breakfast" | "lunch" | "dinner"; food_entry_ids: string[]; custom_meal_texts: string[]; notes?: string; }

const FOOD_ENTRIES_KEY = "purple_fit_food_entries";
const MEAL_PLANS_KEY = "purple_fit_meal_plans";

// --- Food Entries Management (All functions restored) ---
export const getFoodEntries = (): FoodEntry[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(FOOD_ENTRIES_KEY);
  return stored ? JSON.parse(stored) : [];
};
export const saveFoodEntry = (entry: Omit<FoodEntry, "id" | "created_at">): FoodEntry => {
  const newEntry: FoodEntry = { ...entry, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  const entries = getFoodEntries();
  entries.push(newEntry);
  localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
  return newEntry;
};
export const updateFoodEntry = (id: string, updates: Partial<FoodEntry>): FoodEntry | null => {
  const entries = getFoodEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return null;
  entries[index] = { ...entries[index], ...updates };
  localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(entries));
  return entries[index];
};
export const deleteFoodEntry = (id: string): boolean => {
  const entries = getFoodEntries();
  const filtered = entries.filter((e) => e.id !== id);
  localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(filtered));
  return filtered.length < entries.length;
};

// --- Meal Plans Management (With robust fixes) ---
export const getMealPlans = (): MealPlan[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MEAL_PLANS_KEY);
  if (!stored) return [];
  try {
    const plans: any[] = JSON.parse(stored);
    if (!Array.isArray(plans)) return [];
    return plans.filter(p => p && typeof p === 'object' && p.id).map(plan => {
      if (!plan.category) plan.category = 'Normal';
      if (!plan.weeks) plan.weeks = [];
      const requiresMigration = plan.weeks.some((w: any) => w && w.meals && w.meals.some((m: any) => m && (m as any).food_entry_id !== undefined));
      if (!requiresMigration) return plan;
      return {
        ...plan,
        weeks: plan.weeks.map((week: any) => ({
          ...week,
          meals: week.meals.map((meal: any) => {
            if (meal.food_entry_ids) return meal;
            const newMeal: MealPlanMeal = { ...meal, food_entry_ids: meal.food_entry_id ? [meal.food_entry_id] : [], custom_meal_texts: meal.custom_meal || meal.custom_meal_text ? [meal.custom_meal || meal.custom_meal_text] : [] };
            delete (newMeal as any).food_entry_id; delete (newMeal as any).custom_meal; delete (newMeal as any).custom_meal_text;
            return newMeal;
          })
        }))
      };
    });
  } catch (error) {
    console.error("Failed to parse meal plans from localStorage:", error);
    return [];
  }
};
export const getMealPlan = (id: string): MealPlan | null => {
  const plans = getMealPlans();
  return plans.find((p) => p.id === id) || null;
};
export const saveMealPlan = (plan: Omit<MealPlan, "id" | "created_at">): MealPlan => {
  const newPlan: MealPlan = { ...plan, id: crypto.randomUUID(), created_at: new Date().toISOString(), weeks: plan.weeks || [] };
  const plans = getMealPlans();
  plans.push(newPlan);
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
  return newPlan;
};
export const updateMealPlan = (updatedPlan: MealPlan): MealPlan | null => {
  if (typeof window === "undefined") return null;
  const plans = getMealPlans();
  const index = plans.findIndex((p) => p.id === updatedPlan.id);
  if (index === -1) return null;
  plans[index] = updatedPlan;
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
  return plans[index];
};
export const deleteMealPlan = (id: string): boolean => {
  const plans = getMealPlans();
  const filtered = plans.filter((p) => p.id !== id);
  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(filtered));
  return filtered.length < plans.length;
};

// --- THIS IS THE CRITICAL FIX: The complete default food list is restored ---
export const getDefaultFoodEntries = (): FoodEntry[] => {
  const normalFoods: Omit<FoodEntry, "id" | "created_at" | "category">[] = [
    { name: "Celery + Cucumber + Ginger Juice", description: "Fresh juice on empty stomach", meal_type: "breakfast", calories: 50 },
    { name: "Warm Water with Lemon", description: "2 cups warm water with lemon slice", meal_type: "breakfast", calories: 10 },
    { name: "Hard Boiled Eggs (2)", description: "Two hard boiled eggs", meal_type: "breakfast", calories: 140 },
    { name: "Steel Cut Jumbo Oatmeal", description: "Bowl with 2 tsp honey and banana topping", meal_type: "breakfast", calories: 300 },
    { name: "3 Eggs Omelette with Mixed Veggies", description: "Omelette with vegetables of choice", meal_type: "breakfast", calories: 250 },
    { name: "Whole Wheat Bread (1 slice)", description: "One slice whole wheat bread", meal_type: "breakfast", calories: 80 },
    { name: "Half Avocado", description: "Half medium avocado", meal_type: "breakfast", calories: 120 },
    { name: "Overnight Oats", description: "With chia seeds and strawberries", meal_type: "breakfast", calories: 280 },
    { name: "Celery + Cucumber + Ginger Juice with Boiled Eggs and Oatmeal", description: "Celery + cucumber + ginger juice, boiled eggs, steel-cut jumbo oatmeal with honey and banana", meal_type: "breakfast", calories: 500 },
    { name: "Celery + Cucumber + Ginger Juice with Veggie Omelette", description: "Celery + cucumber + ginger juice, omelette with veggies, avocado, whole wheat bread", meal_type: "breakfast", calories: 500 },
    { name: "Celery + Cucumber + Ginger Juice with Overnight Oats", description: "Celery + cucumber + ginger juice, boiled eggs, overnight oats with honey, chia seeds, strawberries", meal_type: "breakfast", calories: 500 },
    { name: "Celery + Cucumber + Ginger Juice with Wheat Bread Omelette", description: "Celery + cucumber + ginger juice, wheat bread with veggie omelet", meal_type: "breakfast", calories: 400 },
    { name: "Mint Leaves + Cucumber + Apple Juice with Wheat Bread", description: "3 mint leaves + cucumber + apple juice, wheat bread with mixed veggies omelet", meal_type: "breakfast", calories: 500 },
    { name: "Whole Wheat Pasta with Mixed Veggies", description: "2 serving spoons whole wheat pasta with mixed veggies and 2 hard-boiled eggs", meal_type: "breakfast", calories: 500 },
    { name: "Moi-moi with Fish and Stir-fried Eggs", description: "One wrap moi-moi with fish, 2 eggs stir fried with spinach or kale", meal_type: "breakfast", calories: 500 },
    { name: "Steel Cut Oats with Strawberry and Almond Milk", description: "Medium bowl steel cut oats with strawberry/blueberry topping, almond milk, chia seeds", meal_type: "breakfast", calories: 500 },
    { name: "Greek Yogurt with Granola", description: "Plain Greek yogurt with granola, apple and raisin topping", meal_type: "breakfast", calories: 500 },
    { name: "Overnight Oats with Peanut Butter", description: "Overnight oats with almond milk, chia seeds, banana and peanut butter", meal_type: "breakfast", calories: 500 },
    { name: "Chicken Breast Sandwich", description: "Sandwich with whole wheat bread, shredded chicken breast, lettuce and half avocado", meal_type: "breakfast", calories: 500 },
    { name: "Protein Shake", description: "Banana, almond milk, overnight oats, blueberries, whey protein powder", meal_type: "breakfast", calories: 600 },
    { name: "Unripe Plantain Porridge", description: "Small plate with little red oil", meal_type: "lunch", calories: 200 },
    { name: "Grilled Fish", description: "Fresh grilled fish portion", meal_type: "lunch", calories: 150 },
    { name: "Grilled Chicken", description: "200g grilled chicken breast", meal_type: "lunch", calories: 200 },
    { name: "Green Vegetables", description: "Any green vegetables of choice", meal_type: "lunch", calories: 50 },
    { name: "Minced Lean Beef (100g)", description: "Stir fried with vegetables", meal_type: "lunch", calories: 180 },
    { name: "Rice (1 serving spoon)", description: "One serving spoon of rice", meal_type: "lunch", calories: 100 },
    { name: "Mixed Vegetables Sauce", description: "With chicken and rice", meal_type: "lunch", calories: 150 },
    { name: "Beans (small bowl)", description: "Small bowl with little oil", meal_type: "lunch", calories: 180 },
    { name: "Jollof Rice (1 serving spoon)", description: "One serving spoon jollof rice", meal_type: "lunch", calories: 120 },
    { name: "Unripe Plantain Porridge with Fish/Chicken", description: "Unripe plantain porridge with grilled fish or chicken and green vegetables", meal_type: "lunch", calories: 500 },
    { name: "Minced Beef Stir-fry with Rice", description: "Minced lean beef with carrots, bell peppers, green beans, stir-fried in olive oil, served with rice", meal_type: "lunch", calories: 500 },
    { name: "Mixed Vegetable Sauce with Chicken and Rice", description: "Mixed vegetable sauce with chicken and rice", meal_type: "lunch", calories: 500 },
    { name: "Beans with Titus Fish and Greens", description: "Beans with Titus fish and green leafy vegetables", meal_type: "lunch", calories: 500 },
    { name: "Moi-moi with Fish and Grilled Plantain", description: "One wrap moi-moi with fish, one finger grilled plantain", meal_type: "lunch", calories: 500 },
    { name: "Vegetable Soup with Fish and Swallow", description: "Medium bowl vegetable soup (Afang, okra, Edikaikon or Eforiro) with fish, meat, crayfish and swallow", meal_type: "lunch", calories: 500 },
    { name: "Sweet Potato with Vegetable Sauce", description: "Vegetable sauce with green leafy vegetables, tomatoes, peppers, fish, crayfish with 2 medium sweet potatoes", meal_type: "lunch", calories: 500 },
    { name: "Rice and Mixed Vegetables with Fish", description: "1 serving spoonful rice and mixed vegetables with grilled fish", meal_type: "lunch", calories: 500 },
    { name: "Pasta and Vegetables with Chicken", description: "1 serving spoonful pasta and vegetables with chicken breast", meal_type: "lunch", calories: 500 },
    { name: "Rice and Beans Jollof with Vegetables", description: "2 serving spoonfuls rice and beans jollof with green leafy vegetables and chicken breast", meal_type: "lunch", calories: 500 },
    { name: "Cabbage and Mixed Peppers Stir-fry with Jollof Rice", description: "Cabbage, carrot and mixed peppers stir fried with olive oil, jollof rice and chicken", meal_type: "lunch", calories: 500 },
    { name: "Grilled Plantain with Vegetable and Fish Sauce", description: "1 finger grilled/boiled plantain with vegetable and fish sauce", meal_type: "lunch", calories: 600 },
    { name: "Fish Pepper Soup", description: "Fish pepper soup", meal_type: "dinner", calories: 200 },
    { name: "Goat Meat Pepper Soup", description: "Goat meat pepper soup", meal_type: "dinner", calories: 250 },
    { name: "Chicken Pepper Soup", description: "Chicken pepper soup", meal_type: "dinner", calories: 220 },
    { name: "Okra Soup", description: "With green leafy vegetables and fish", meal_type: "dinner", calories: 180 },
    { name: "Boiled Yam (2 slices)", description: "Two slices boiled yam", meal_type: "dinner", calories: 160 },
    { name: "Tomatoes and Spinach Sauce", description: "With 3 eggs", meal_type: "dinner", calories: 200 },
    { name: "Sweet Potato Porridge", description: "Medium sized with fish and spinach", meal_type: "dinner", calories: 220 },
    { name: "Oolong Tea", description: "One cup served warm before bedtime", meal_type: "dinner", calories: 5 },
    { name: "Fish or Goat Meat Pepper Soup", description: "Fish or goat meat pepper soup", meal_type: "dinner", calories: 500 },
    { name: "Okra Soup with Fish and Vegetables", description: "Okra soup with leafy vegetables, fish, chicken, crayfish", meal_type: "dinner", calories: 500 },
    { name: "Boiled Yam with Eggs and Spinach", description: "Boiled yam with eggs, tomato sauce, and spinach", meal_type: "dinner", calories: 500 },
    { name: "Jollof Rice with Stir-fried Veggies", description: "Jollof rice with stir-fried veggies and fish or chicken", meal_type: "dinner", calories: 500 },
    { name: "Sweet Potato Porridge with Fish", description: "Two medium sweet potato porridge with fish, red oil and spinach/green leafy veggie", meal_type: "dinner", calories: 500 },
    { name: "Tortilla Wrap with Chicken", description: "Tortilla wrap with half avocado, cooked chicken breast, lettuce, tomato", meal_type: "dinner", calories: 500 },
    { name: "Okra Soup with Shrimps and Chicken", description: "Okra soup with shrimps, chicken, Ugu/Uziza leaves in high volume", meal_type: "dinner", calories: 500 },
    { name: "Chicken Pepper Soup with Yam", description: "Chicken pepper soup with yam slice (100g)", meal_type: "dinner", calories: 500 },
    { name: "Porridge Beans with Fish and Plantain", description: "Porridge beans with fish and 1/2 finger grilled/boiled plantain", meal_type: "dinner", calories: 500 },
    { name: "Fish Pepper Soup with Unripe Plantain", description: "Fish pepper soup cooked with half finger unripe plantain", meal_type: "dinner", calories: 400 },
    { name: "Mixed Vegetables and Chicken Stir Fry in Pitta", description: "Mixed vegetables and chicken stir fry wrapped in one pitta bread", meal_type: "dinner", calories: 400 },
    { name: "Fish Pepper Soup with Yam", description: "Fish pepper soup with 100g yam", meal_type: "dinner", calories: 500 },
    { name: "Tortilla Shawarma", description: "Tortilla shawarma (stir fried egg, mixed vegetables, minced meat) wrap", meal_type: "dinner", calories: 500 },
    { name: "Vegetable Soup with Swallow", description: "Plate of vegetable soup with fish and fist sized swallow", meal_type: "dinner", calories: 500 },
    { name: "Fish and Vegetable Sauce with Plantain", description: "Fish and vegetable sauce with 1/2 finger grilled/boiled plantain", meal_type: "dinner", calories: 500 },
  ];

  const liverResetFoods: Omit<FoodEntry, "id" | "created_at" | "category">[] = [
    { name: "Green cleanse smoothie", description: "celery + cucumber + ginger + lemon", meal_type: "breakfast", calories: 110 },
    { name: "Turmeric flush smoothie", description: "carrot + turmeric + lemon + black pepper", meal_type: "breakfast", calories: 90 },
    { name: "Beetroot cleanse juice", description: "beetroot + carrot + ginger + lemon", meal_type: "breakfast", calories: 95 },
    { name: "Oats with chia seeds + fruit", description: "Oats with chia seeds, skimmed milk, and fruit", meal_type: "breakfast", calories: 425 },
    { name: "Greek yogurt with almonds & seeds", description: "Greek yogurt with almonds, chia seeds, flax seeds, blueberries", meal_type: "breakfast", calories: 475 },
    { name: "Wheat bread with boiled eggs/omelet", description: "Wheat bread with boiled eggs or omelet", meal_type: "breakfast", calories: 425 },
    { name: "Moi-moi wrap (fish or beef)", description: "One wrap of moi-moi with fish or beef filling", meal_type: "breakfast", calories: 275 },
    { name: "Egg muffins (egg whites + veggies)", description: "Muffins made with egg whites and assorted vegetables", meal_type: "breakfast", calories: 225 },
    { name: "Sandwich (chicken, avocado, cheese)", description: "Sandwich with chicken, avocado, lettuce, and cheese", meal_type: "breakfast", calories: 475 },
    { name: "Protein/Berry/Chocolate Smoothies", description: "protein, berry flax, chocolate avocado, or nut cacao", meal_type: "breakfast", calories: 450 },
    { name: "Oat pancakes (banana + oats)", description: "Pancakes made with banana, oats, egg, and skim milk", meal_type: "breakfast", calories: 375 },
    { name: "Sweet potato porridge", description: "Sweet potato porridge with fish and spinach", meal_type: "breakfast", calories: 475 },
    { name: "Tomato-egg-spinach sauce with plantain", description: "A savory sauce with eggs and spinach, served with plantain", meal_type: "breakfast", calories: 425 },
    { name: "Oat swallow with vegetable soup & fish", description: "", meal_type: "lunch", calories: 500 },
    { name: "Vegetable soups with protein", description: "Okra, efo riro, spinach, ugu, uziza with fish, chicken, prawns, or snails", meal_type: "lunch", calories: 475 },
    { name: "Beans porridge with mackerel/chicken", description: "", meal_type: "lunch", calories: 500 },
    { name: "Brown rice (plain/jollof) with protein", description: "Brown rice served plain or jollof style with chicken or fish", meal_type: "lunch", calories: 500 },
    { name: "Unripe plantain porridge", description: "Porridge made with unripe plantain and fish/mackerel", meal_type: "lunch", calories: 500 },
    { name: "Yam porridge with ugu & fish", description: "", meal_type: "lunch", calories: 500 },
    { name: "Ofada rice with stew & protein", description: "Ofada rice with a side of stew and chicken/fish", meal_type: "lunch", calories: 500 },
    { name: "Whole grain pasta with veggies & chicken", description: "Whole grain pasta or soup with vegetables and chicken", meal_type: "lunch", calories: 475 },
    { name: "Chicken & bell pepper stir fry", description: "Served with fonio or rice", meal_type: "lunch", calories: 500 },
    { name: "Chinese sauce with shrimp & chicken", description: "Shrimp, chicken, broccoli, and peppers with rice", meal_type: "lunch", calories: 500 },
    { name: "Curry sauce with protein", description: "Curry sauce with chicken, turkey, or fish", meal_type: "lunch", calories: 500 },
    { name: "Tortilla wrap (lunch)", description: "Wrap with chicken, avocado, lettuce, and veggies", meal_type: "lunch", calories: 475 },
    { name: "Fish pepper soup", description: "with yam, plantain, spinach, or scent leaves", meal_type: "dinner", calories: 425 },
    { name: "Goat meat pepper soup with yam", description: "", meal_type: "dinner", calories: 500 },
    { name: "Okra soup (dinner)", description: "with fish, chicken, prawns, or snail", meal_type: "dinner", calories: 475 },
    { name: "Spinach & tomato sauce with protein", description: "Spinach and tomato sauce with chicken or fish, served with rice", meal_type: "dinner", calories: 500 },
    { name: "Vegetable soups (dinner)", description: "Efo riro or veggie stew with snails, shrimps, or chicken", meal_type: "dinner", calories: 475 },
    { name: "Sweet potato with protein sauce", description: "Sweet potato with fish, chicken, or spinach sauce", meal_type: "dinner", calories: 500 },
    { name: "Mixed vegetable stir fry with protein", description: "Stir fry with chicken, fish, turkey, or shrimp", meal_type: "dinner", calories: 500 },
    { name: "Shawarma/tortilla wrap (dinner)", description: "Wrap with chicken and veggies", meal_type: "dinner", calories: 475 },
    { name: "Fish, tomato & spinach sauce with plantain", description: "", meal_type: "dinner", calories: 450 },
    { name: "Grilled turkey with salad & avocado", description: "", meal_type: "dinner", calories: 500 },
  ];

  const snackFoods: Omit<FoodEntry, "id" | "created_at" | "category" | "meal_type">[] = [
    { name: "Snack: Watermelon (cup)", description: "", calories: 55 },
    { name: "Snack: Pawpaw (cup)", description: "", calories: 70 },
    { name: "Snack: Pineapple (cup)", description: "", calories: 80 },
    { name: "Snack: Apple (medium)", description: "", calories: 95 },
    { name: "Snack: Orange (medium)", description: "", calories: 60 },
    { name: "Snack: Blueberries (100g)", description: "", calories: 57 },
    { name: "Snack: Cucumber (1 cup sliced)", description: "", calories: 15 },
    { name: "Snack: Almonds (10-30g)", description: "", calories: 125 },
    { name: "Snack: Pumpkin seeds (1 tbsp)", description: "", calories: 50 },
    { name: "Snack: Flax seeds (1 tbsp)", description: "", calories: 55 },
    { name: "Snack: Chia seeds (1 tbsp)", description: "", calories: 58 },
  ];

  const allEntries: Omit<FoodEntry, "id" | "created_at">[] = [];
  normalFoods.forEach(food => allEntries.push({ ...food, category: 'Normal' }));
  liverResetFoods.forEach(food => allEntries.push({ ...food, category: 'Liver Reset' }));
  const mealTypes: ("breakfast" | "lunch" | "dinner")[] = ["breakfast", "lunch", "dinner"];
  snackFoods.forEach(snack => {
    mealTypes.forEach(type => {
      allEntries.push({ ...snack, meal_type: type, category: 'Snack' });
    });
  });

  return allEntries.map((entry) => ({ ...entry, id: crypto.randomUUID(), created_at: new Date().toISOString() }));
};

export const initializeDefaultData = () => {
  if (typeof window === "undefined") return;
  const existingEntries = localStorage.getItem(FOOD_ENTRIES_KEY);
  if (!existingEntries || JSON.parse(existingEntries).length < 100) { // Check if the list is shorter than the full new list
    localStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(getDefaultFoodEntries()));
  }
  const existingPlans = localStorage.getItem(MEAL_PLANS_KEY);
  if (!existingPlans || JSON.parse(existingPlans).length === 0) {
    const defaultMealPlan = createDefaultMealPlan();
    localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify([defaultMealPlan]));
  }
};

const createDefaultMealPlan = (): MealPlan => {
  const foodEntries = getDefaultFoodEntries().filter(e => e.category === 'Normal' || e.category === 'Snack');
  const defaultWeek: MealPlanWeek = { id: crypto.randomUUID(), week_number: 1, meals: [] };
  // Logic to populate the default week can go here if desired
  return { id: crypto.randomUUID(), title: "Purple Fit Sample Meal Plan", client_name: "Sample Client", created_at: new Date().toISOString(), weeks: [defaultWeek], category: 'Normal' };
};
