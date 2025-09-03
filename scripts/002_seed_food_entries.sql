-- Insert food entries from the Purple Fit meal plan document
-- Breakfast items
INSERT INTO food_entries (name, description, meal_type, calories) VALUES
('Celery + Cucumber + Ginger Juice', 'A glass of celery + cucumber + ginger juice on an empty stomach', 'breakfast', 50),
('Warm Water with Lemon', 'Two cups of warm water with lemon slice', 'breakfast', 10),
('Hard Boiled Eggs (2)', 'Two hard boiled eggs', 'breakfast', 140),
('Steel Cut Jumbo Oatmeal', 'Bowl of steel cut jumbo oatmeal with 2 teaspoons honey and banana topping', 'breakfast', 250),
('3 Eggs Omelette with Mixed Veggies', '3 eggs omelette with mixed vegetables of choice', 'breakfast', 300),
('Half Avocado', 'Half avocado', 'breakfast', 120),
('Whole Wheat Bread (1 slice)', 'One slice of whole wheat bread', 'breakfast', 80),
('Overnight Oats', 'Bowl of overnight oats with 2 teaspoons honey, 1 tbs chia seeds and strawberries', 'breakfast', 280),
('Wheat Bread (2 slices) with Eggs', '2 slices of wheat bread with 3 eggs omelet and mixed veggies', 'breakfast', 400),
('Whole Wheat Pasta (2 spoons)', '2 serving spoons of whole wheat pasta with mixed veggies and 2 hard-boiled eggs', 'breakfast', 350),
('Moi-moi with Fish', 'One wrap moi-moi with fish', 'breakfast', 200),
('Stir Fried Eggs with Spinach', '2 eggs stir fried with spinach or kale', 'breakfast', 180),
('Greek Yogurt with Granola', 'One cup plain Greek yogurt mixed with ½ cup granola, apple and raisin topping', 'breakfast', 300),
('Protein Shake', '500ml protein shake with banana, almond milk, oats, blueberries, whey protein', 'breakfast', 400),
('Sweet Potato Porridge', 'One medium sweet potato porridge with spinach and fish', 'breakfast', 280);

-- Lunch items  
INSERT INTO food_entries (name, description, meal_type, calories) VALUES
('Unripe Plantain Porridge', 'Small plate of unripe plantain porridge with little red oil, grilled fish/chicken and green vegetables', 'lunch', 450),
('Minced Lean Beef Stir Fry', '100g minced lean beef with carrots, bell peppers, green beans stir fried with olive oil and rice', 'lunch', 480),
('Mixed Vegetables Sauce with Chicken', 'Mixed vegetables sauce with 200g chicken and one serving spoon of rice', 'lunch', 500),
('Beans with Fish', 'One small bowl of beans with little oil, Titus fish and green leafy vegetables', 'lunch', 450),
('Jollof Rice with Mixed Veggies', 'One serving spoon jollof rice with mixed veggies stir fry and 200g fish/chicken', 'lunch', 500),
('Moi-moi with Fish/Beef', 'One wrap of moi-moi with fish or minced beef', 'lunch', 300),
('Grilled Plantain (1 finger)', 'One finger grilled plantain', 'lunch', 120),
('Vegetable Soup with Swallow', 'Medium bowl of vegetable soup with fish, meat, crayfish and half fist size swallow', 'lunch', 480),
('Sweet Potato with Vegetable Sauce', 'Two medium sweet potatoes boiled with vegetable sauce, fish and crayfish', 'lunch', 450),
('Rice and Mixed Vegetables', '1 serving spoonful of rice and mixed vegetables with grilled fish', 'lunch', 400),
('Pasta and Vegetables', '1 serving spoonful of pasta and vegetables with 200g chicken breast', 'lunch', 480),
('Rice and Beans Jollof', '2 serving spoonful of rice and beans jollof with green leafy vegetables and 200g chicken', 'lunch', 520),
('Cabbage Stir Fry with Rice', 'Cabbage, carrot and mixed peppers stir fried with olive oil, jollof rice and 200g chicken', 'lunch', 500);

-- Dinner items
INSERT INTO food_entries (name, description, meal_type, calories) VALUES
('Fish Pepper Soup', 'Fish pepper soup', 'dinner', 300),
('Goat Meat Pepper Soup', 'Goat meat pepper soup', 'dinner', 350),
('Chicken Pepper Soup', 'Chicken pepper soup', 'dinner', 320),
('Okra Soup with Fish', 'Plate of okra soup with green leafy vegetables, fish, chicken, crayfish and little red oil', 'dinner', 400),
('Boiled Yam with Eggs and Sauce', 'Two slices of boiled yam, 3 eggs and tomatoes sauce with spinach', 'dinner', 450),
('Sweet Potato Porridge with Fish', 'Two medium sized sweet potato porridge with fish, 2 tablespoons red oil and spinach', 'dinner', 400),
('Tortilla Wrap', 'One tortilla wrap with half avocado, 200g cooked chicken breast, lettuce and tomato', 'dinner', 450),
('Chicken Pepper Soup with Yam', 'Chicken pepper soup with one slice of yam (100g)', 'dinner', 420),
('Porridge Beans with Plantain', 'Plate of porridge beans and fish with 1/2 finger grilled/boiled plantain', 'dinner', 400),
('Mixed Vegetables Chicken Wrap', 'Mixed vegetables and chicken stir fry wrapped in one pitta bread', 'dinner', 380),
('Fish Pepper Soup with Yam', 'Fish pepper soup with 100g yam', 'dinner', 400),
('Tortilla Shawarma', 'Tortilla shawarma with stir fried egg, mixed vegetables, minced meat wrapped in tortilla', 'dinner', 450),
('Vegetable Soup with Swallow', 'Plate of vegetable soup with fish and fist sized swallow', 'dinner', 400),
('Fish and Vegetable Sauce', 'Plate of fish and vegetable sauce with 1/2 finger grilled/boiled plantain', 'dinner', 380);

-- Snack items (can be used across all meal types)
INSERT INTO food_entries (name, description, meal_type, calories) VALUES
('Small Apple', 'One small apple', 'breakfast', 80),
('Watermelon (1 cup)', 'One cup of watermelon', 'breakfast', 50),
('Chopped Cucumber', 'One cup of chopped cucumber and 2 baby carrots', 'breakfast', 25),
('Mango', 'One mango', 'breakfast', 100),
('Oranges (2)', 'Two oranges', 'breakfast', 120),
('Grapes (handful)', 'A handful of grapes', 'breakfast', 60),
('English Pear', 'One medium sized English pear', 'breakfast', 80),
('Tangerines (2)', 'Two tangerines', 'breakfast', 80),
('Carrots (2 medium)', 'Two medium sized carrots', 'breakfast', 50),
('Guavas (2)', 'Two guavas', 'breakfast', 80),
('Pineapple (1 cup)', 'One cup pineapple', 'breakfast', 80);
