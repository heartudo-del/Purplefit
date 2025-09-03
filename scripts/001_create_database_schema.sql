-- Create food_entries table to store all available food items
CREATE TABLE IF NOT EXISTS food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plans table to store meal plan instances
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_name TEXT,
  nutritionist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plan_weeks table to store weeks within meal plans
CREATE TABLE IF NOT EXISTS meal_plan_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT DEFAULT 'Week',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_plan_meals table to store individual meals
CREATE TABLE IF NOT EXISTS meal_plan_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id UUID REFERENCES meal_plan_weeks(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  food_entry_id UUID REFERENCES food_entries(id) ON DELETE SET NULL,
  custom_meal_text TEXT, -- For custom entries not in food_entries
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_meals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for food_entries (shared across all users)
CREATE POLICY "Anyone can view food entries" ON food_entries FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert food entries" ON food_entries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update food entries" ON food_entries FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can delete food entries" ON food_entries FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for meal_plans
CREATE POLICY "Users can view their own meal plans" ON meal_plans FOR SELECT USING (auth.uid() = nutritionist_id);
CREATE POLICY "Users can insert their own meal plans" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = nutritionist_id);
CREATE POLICY "Users can update their own meal plans" ON meal_plans FOR UPDATE USING (auth.uid() = nutritionist_id);
CREATE POLICY "Users can delete their own meal plans" ON meal_plans FOR DELETE USING (auth.uid() = nutritionist_id);

-- RLS Policies for meal_plan_weeks
CREATE POLICY "Users can view weeks of their meal plans" ON meal_plan_weeks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM meal_plans 
    WHERE meal_plans.id = meal_plan_weeks.meal_plan_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);
CREATE POLICY "Users can insert weeks to their meal plans" ON meal_plan_weeks FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM meal_plans 
    WHERE meal_plans.id = meal_plan_weeks.meal_plan_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);
CREATE POLICY "Users can update weeks of their meal plans" ON meal_plan_weeks FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM meal_plans 
    WHERE meal_plans.id = meal_plan_weeks.meal_plan_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);
CREATE POLICY "Users can delete weeks of their meal plans" ON meal_plan_weeks FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM meal_plans 
    WHERE meal_plans.id = meal_plan_weeks.meal_plan_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);

-- RLS Policies for meal_plan_meals
CREATE POLICY "Users can view meals of their meal plans" ON meal_plan_meals FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM meal_plan_weeks 
    JOIN meal_plans ON meal_plans.id = meal_plan_weeks.meal_plan_id
    WHERE meal_plan_weeks.id = meal_plan_meals.week_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);
CREATE POLICY "Users can insert meals to their meal plans" ON meal_plan_meals FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM meal_plan_weeks 
    JOIN meal_plans ON meal_plans.id = meal_plan_weeks.meal_plan_id
    WHERE meal_plan_weeks.id = meal_plan_meals.week_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);
CREATE POLICY "Users can update meals of their meal plans" ON meal_plan_meals FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM meal_plan_weeks 
    JOIN meal_plans ON meal_plans.id = meal_plan_weeks.meal_plan_id
    WHERE meal_plan_weeks.id = meal_plan_meals.week_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);
CREATE POLICY "Users can delete meals of their meal plans" ON meal_plan_meals FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM meal_plan_weeks 
    JOIN meal_plans ON meal_plans.id = meal_plan_weeks.meal_plan_id
    WHERE meal_plan_weeks.id = meal_plan_meals.week_id 
    AND meal_plans.nutritionist_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_meal_plans_nutritionist ON meal_plans(nutritionist_id);
CREATE INDEX idx_meal_plan_weeks_meal_plan ON meal_plan_weeks(meal_plan_id);
CREATE INDEX idx_meal_plan_meals_week ON meal_plan_meals(week_id);
CREATE INDEX idx_meal_plan_meals_day_type ON meal_plan_meals(day_of_week, meal_type);
CREATE INDEX idx_food_entries_meal_type ON food_entries(meal_type);
