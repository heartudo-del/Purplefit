export interface FoodEntry {
  id: string
  name: string
  description?: string
  meal_type: "breakfast" | "lunch" | "dinner"
  calories?: number
  created_at: string
  updated_at: string
}

export interface MealPlan {
  id: string
  title: string
  client_name?: string
  nutritionist_id: string
  created_at: string
  updated_at: string
}

export interface MealPlanWeek {
  id: string
  meal_plan_id: string
  week_number: number
  title: string
  created_at: string
}

export interface MealPlanMeal {
  id: string
  week_id: string
  day_of_week: number // 1=Monday, 7=Sunday
  meal_type: "breakfast" | "lunch" | "dinner"
  food_entry_id?: string
  custom_meal_text?: string
  created_at: string
  food_entry?: FoodEntry
}

export interface DayMeals {
  breakfast?: MealPlanMeal
  lunch?: MealPlanMeal
  dinner?: MealPlanMeal
}

export interface WeekData {
  week: MealPlanWeek
  meals: { [day: number]: DayMeals }
}
