-- ============================================================
-- FuelFit — Realistic 2-week seed data
-- User: 66deed14-5afa-41cb-ac3c-133261026929
-- Date range: March 29 – April 11, 2026
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Shorthand
DO $$
DECLARE
  uid uuid := '66deed14-5afa-41cb-ac3c-133261026929';

  -- Habit IDs (deterministic so habit_logs can reference them)
  h_water   uuid := 'a1000000-0000-0000-0000-000000000001';
  h_sleep   uuid := 'a1000000-0000-0000-0000-000000000002';
  h_protein uuid := 'a1000000-0000-0000-0000-000000000003';
  h_steps   uuid := 'a1000000-0000-0000-0000-000000000004';
  h_junk    uuid := 'a1000000-0000-0000-0000-000000000005';
  h_gym     uuid := 'a1000000-0000-0000-0000-000000000006';

BEGIN

-- ── Profile ────────────────────────────────────────────────
UPDATE public.profiles SET
  display_name = 'Alex',
  goals = ARRAY['muscle','consistent','healthier'],
  workout_days = '4-5',
  diet_style = 'high-protein',
  cooking_time = '30min',
  notifications_enabled = true,
  updated_at = now()
WHERE id = uid;

-- ── Habits ─────────────────────────────────────────────────
-- Delete existing habits for this user first to avoid duplicates
DELETE FROM public.habit_logs WHERE user_id = uid;
DELETE FROM public.habits WHERE user_id = uid;

INSERT INTO public.habits (id, user_id, label, icon, target, unit, sort_order, created_at) VALUES
  (h_water,   uid, '8 glasses of water', 'droplets',    8,    'glasses',  0, '2026-03-28T09:00:00Z'),
  (h_sleep,   uid, '7+ hours sleep',     'moon',        7,    'hours',    1, '2026-03-28T09:00:00Z'),
  (h_protein, uid, 'Protein target',     'beef',        120,  'grams',    2, '2026-03-28T09:00:00Z'),
  (h_steps,   uid, 'Steps goal',         'trending-up', 8000, 'steps',    3, '2026-03-28T09:00:00Z'),
  (h_junk,    uid, 'No junk food',       'cookie',      1,    'day',      4, '2026-03-28T09:00:00Z'),
  (h_gym,     uid, 'Gym session',        'dumbbell',    1,    'session',  5, '2026-03-28T09:00:00Z');

-- ── Habit Logs (14 days: Mar 29 – Apr 11) ──────────────────
-- Pattern: realistic — not perfect, some misses, improves in week 2

-- Mar 29 (Sun) — light day, 3/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-03-29', true,  7),
  (uid, h_sleep,   '2026-03-29', true,  8),
  (uid, h_protein, '2026-03-29', false, 90),
  (uid, h_steps,   '2026-03-29', false, 4200),
  (uid, h_junk,    '2026-03-29', true,  1),
  (uid, h_gym,     '2026-03-29', false, 0);

-- Mar 30 (Mon) — gym day, 5/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-03-30', true,  8),
  (uid, h_sleep,   '2026-03-30', true,  7),
  (uid, h_protein, '2026-03-30', true,  125),
  (uid, h_steps,   '2026-03-30', true,  9100),
  (uid, h_junk,    '2026-03-30', true,  1),
  (uid, h_gym,     '2026-03-30', false, 0);

-- Mar 31 (Tue) — solid day, 5/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-03-31', true,  8),
  (uid, h_sleep,   '2026-03-31', false, 5.5),
  (uid, h_protein, '2026-03-31', true,  130),
  (uid, h_steps,   '2026-03-31', true,  8500),
  (uid, h_junk,    '2026-03-31', true,  1),
  (uid, h_gym,     '2026-03-31', true,  1);

-- Apr 1 (Wed) — rest day, 3/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-01', true,  8),
  (uid, h_sleep,   '2026-04-01', true,  7.5),
  (uid, h_protein, '2026-04-01', false, 95),
  (uid, h_steps,   '2026-04-01', false, 5800),
  (uid, h_junk,    '2026-04-01', false, 0),
  (uid, h_gym,     '2026-04-01', true,  1);

-- Apr 2 (Thu) — gym day, 5/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-02', true,  8),
  (uid, h_sleep,   '2026-04-02', true,  7),
  (uid, h_protein, '2026-04-02', true,  140),
  (uid, h_steps,   '2026-04-02', true,  10200),
  (uid, h_junk,    '2026-04-02', true,  1),
  (uid, h_gym,     '2026-04-02', false, 0);

-- Apr 3 (Fri) — gym day, 4/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-03', false, 5),
  (uid, h_sleep,   '2026-04-03', true,  7.5),
  (uid, h_protein, '2026-04-03', true,  118),
  (uid, h_steps,   '2026-04-03', false, 6100),
  (uid, h_junk,    '2026-04-03', true,  1),
  (uid, h_gym,     '2026-04-03', true,  1);

-- Apr 4 (Sat) — rest/lazy, 2/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-04', false, 4),
  (uid, h_sleep,   '2026-04-04', true,  9),
  (uid, h_protein, '2026-04-04', false, 80),
  (uid, h_steps,   '2026-04-04', false, 3000),
  (uid, h_junk,    '2026-04-04', false, 0),
  (uid, h_gym,     '2026-04-04', true,  1);

-- ── WEEK 2 (improving consistency) ─────────────────────────

-- Apr 5 (Sun) — getting back, 4/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-05', true,  8),
  (uid, h_sleep,   '2026-04-05', true,  8),
  (uid, h_protein, '2026-04-05', false, 100),
  (uid, h_steps,   '2026-04-05', true,  8500),
  (uid, h_junk,    '2026-04-05', true,  1),
  (uid, h_gym,     '2026-04-05', false, 0);

-- Apr 6 (Mon) — strong start, 5/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-06', true,  8),
  (uid, h_sleep,   '2026-04-06', true,  7),
  (uid, h_protein, '2026-04-06', true,  135),
  (uid, h_steps,   '2026-04-06', true,  9800),
  (uid, h_junk,    '2026-04-06', true,  1),
  (uid, h_gym,     '2026-04-06', false, 0);

-- Apr 7 (Tue) — gym day, 6/6 perfect day!
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-07', true,  8),
  (uid, h_sleep,   '2026-04-07', true,  7.5),
  (uid, h_protein, '2026-04-07', true,  128),
  (uid, h_steps,   '2026-04-07', true,  11000),
  (uid, h_junk,    '2026-04-07', true,  1),
  (uid, h_gym,     '2026-04-07', true,  1);

-- Apr 8 (Wed) — gym day, 5/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-08', true,  8),
  (uid, h_sleep,   '2026-04-08', false, 5),
  (uid, h_protein, '2026-04-08', true,  122),
  (uid, h_steps,   '2026-04-08', true,  8900),
  (uid, h_junk,    '2026-04-08', true,  1),
  (uid, h_gym,     '2026-04-08', true,  1);

-- Apr 9 (Thu) — rest day, 4/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-09', true,  8),
  (uid, h_sleep,   '2026-04-09', true,  8),
  (uid, h_protein, '2026-04-09', true,  115),
  (uid, h_steps,   '2026-04-09', false, 6200),
  (uid, h_junk,    '2026-04-09', false, 0),
  (uid, h_gym,     '2026-04-09', true,  1);

-- Apr 10 (Fri) — gym day, 5/6
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-10', true,  8),
  (uid, h_sleep,   '2026-04-10', true,  7),
  (uid, h_protein, '2026-04-10', true,  132),
  (uid, h_steps,   '2026-04-10', true,  9400),
  (uid, h_junk,    '2026-04-10', true,  1),
  (uid, h_gym,     '2026-04-10', false, 0);

-- Apr 11 (Sat — today) — in progress, 3/6 so far
INSERT INTO public.habit_logs (user_id, habit_id, date, completed, value) VALUES
  (uid, h_water,   '2026-04-11', true,  6),
  (uid, h_sleep,   '2026-04-11', true,  8),
  (uid, h_protein, '2026-04-11', false, 45),
  (uid, h_steps,   '2026-04-11', false, 2100),
  (uid, h_junk,    '2026-04-11', true,  1),
  (uid, h_gym,     '2026-04-11', false, 0);


-- ── Workouts (PPL split, 4-5 days/week) ────────────────────
DELETE FROM public.workouts WHERE user_id = uid;

INSERT INTO public.workouts (user_id, title, muscle_group, duration, exercises, date, completed, created_at) VALUES
-- Week 1
(uid, 'Push Day', 'Chest, Shoulders, Triceps', '45 min',
  '[{"name":"Bench Press","sets":"4 sets","reps":"8-10 reps"},{"name":"Overhead Press","sets":"3 sets","reps":"10-12 reps"},{"name":"Incline Dumbbell Press","sets":"3 sets","reps":"10-12 reps"},{"name":"Lateral Raises","sets":"3 sets","reps":"12-15 reps"},{"name":"Tricep Dips","sets":"3 sets","reps":"10-12 reps"}]',
  '2026-03-29', true, '2026-03-29T08:00:00Z'),

(uid, 'Pull Day', 'Back, Biceps', '45 min',
  '[{"name":"Deadlift","sets":"4 sets","reps":"6-8 reps"},{"name":"Pull-ups","sets":"3 sets","reps":"8-10 reps"},{"name":"Barbell Rows","sets":"3 sets","reps":"10-12 reps"},{"name":"Face Pulls","sets":"3 sets","reps":"12-15 reps"},{"name":"Bicep Curls","sets":"3 sets","reps":"10-12 reps"}]',
  '2026-03-30', true, '2026-03-30T08:00:00Z'),

(uid, 'Legs', 'Quads, Hamstrings, Glutes', '50 min',
  '[{"name":"Squats","sets":"4 sets","reps":"8-10 reps"},{"name":"Romanian Deadlift","sets":"3 sets","reps":"10-12 reps"},{"name":"Leg Press","sets":"3 sets","reps":"12-15 reps"},{"name":"Leg Curls","sets":"3 sets","reps":"12-15 reps"},{"name":"Calf Raises","sets":"4 sets","reps":"15-20 reps"}]',
  '2026-03-31', true, '2026-03-31T08:00:00Z'),

-- Apr 1 rest

(uid, 'Push Day', 'Chest, Shoulders, Triceps', '45 min',
  '[{"name":"Bench Press","sets":"4 sets","reps":"8-10 reps"},{"name":"Overhead Press","sets":"3 sets","reps":"10-12 reps"},{"name":"Cable Flyes","sets":"3 sets","reps":"12-15 reps"},{"name":"Lateral Raises","sets":"3 sets","reps":"12-15 reps"},{"name":"Tricep Pushdowns","sets":"3 sets","reps":"12-15 reps"}]',
  '2026-04-02', true, '2026-04-02T08:00:00Z'),

(uid, 'Pull Day', 'Back, Biceps', '40 min',
  '[{"name":"Barbell Rows","sets":"4 sets","reps":"8-10 reps"},{"name":"Lat Pulldowns","sets":"3 sets","reps":"10-12 reps"},{"name":"Seated Cable Rows","sets":"3 sets","reps":"10-12 reps"},{"name":"Hammer Curls","sets":"3 sets","reps":"10-12 reps"}]',
  '2026-04-03', true, '2026-04-03T08:00:00Z'),

-- Apr 4 rest

-- Week 2
(uid, 'Full Body', 'All muscle groups', '40 min',
  '[{"name":"Squats","sets":"3 sets","reps":"10 reps"},{"name":"Bench Press","sets":"3 sets","reps":"10 reps"},{"name":"Barbell Rows","sets":"3 sets","reps":"10 reps"},{"name":"Overhead Press","sets":"3 sets","reps":"10 reps"}]',
  '2026-04-05', false, '2026-04-05T10:00:00Z'),

(uid, 'Push Day', 'Chest, Shoulders, Triceps', '50 min',
  '[{"name":"Incline Bench Press","sets":"4 sets","reps":"8-10 reps"},{"name":"Dumbbell Shoulder Press","sets":"3 sets","reps":"10-12 reps"},{"name":"Chest Dips","sets":"3 sets","reps":"10-12 reps"},{"name":"Lateral Raises","sets":"4 sets","reps":"12-15 reps"},{"name":"Overhead Tricep Extension","sets":"3 sets","reps":"12-15 reps"}]',
  '2026-04-06', true, '2026-04-06T07:30:00Z'),

(uid, 'Pull Day', 'Back, Biceps', '45 min',
  '[{"name":"Deadlift","sets":"4 sets","reps":"5-6 reps"},{"name":"Weighted Pull-ups","sets":"3 sets","reps":"6-8 reps"},{"name":"T-Bar Rows","sets":"3 sets","reps":"10-12 reps"},{"name":"Face Pulls","sets":"3 sets","reps":"15 reps"},{"name":"Barbell Curls","sets":"3 sets","reps":"10-12 reps"}]',
  '2026-04-07', true, '2026-04-07T08:00:00Z'),

(uid, 'Legs', 'Quads, Hamstrings, Glutes', '50 min',
  '[{"name":"Front Squats","sets":"4 sets","reps":"8-10 reps"},{"name":"Romanian Deadlift","sets":"3 sets","reps":"10-12 reps"},{"name":"Bulgarian Split Squats","sets":"3 sets","reps":"10 each leg"},{"name":"Leg Extensions","sets":"3 sets","reps":"12-15 reps"},{"name":"Standing Calf Raises","sets":"4 sets","reps":"15-20 reps"}]',
  '2026-04-08', true, '2026-04-08T07:45:00Z'),

-- Apr 9 rest

(uid, 'Push Day', 'Chest, Shoulders, Triceps', '45 min',
  '[{"name":"Flat Dumbbell Press","sets":"4 sets","reps":"8-10 reps"},{"name":"Arnold Press","sets":"3 sets","reps":"10-12 reps"},{"name":"Incline Flyes","sets":"3 sets","reps":"12-15 reps"},{"name":"Cable Lateral Raises","sets":"3 sets","reps":"15 reps"},{"name":"Skull Crushers","sets":"3 sets","reps":"10-12 reps"}]',
  '2026-04-10', true, '2026-04-10T08:15:00Z'),

-- Today — planned, not done yet
(uid, 'Pull Day', 'Back, Biceps', '45 min',
  '[{"name":"Pendlay Rows","sets":"4 sets","reps":"6-8 reps"},{"name":"Pull-ups","sets":"3 sets","reps":"8-10 reps"},{"name":"Single Arm Dumbbell Rows","sets":"3 sets","reps":"10-12 each"},{"name":"Reverse Flyes","sets":"3 sets","reps":"15 reps"},{"name":"Incline Curls","sets":"3 sets","reps":"10-12 reps"}]',
  '2026-04-11', false, '2026-04-11T08:00:00Z');


-- ── Meals (daily, realistic variety) ────────────────────────
DELETE FROM public.meals WHERE user_id = uid;

INSERT INTO public.meals (user_id, meal_type, name, description, calories, protein, date, created_at) VALUES
-- Mar 29
(uid, 'Breakfast', 'Scrambled Eggs & Toast',     'Three eggs, whole wheat toast, avocado',        450, 28, '2026-03-29', '2026-03-29T08:30:00Z'),
(uid, 'Lunch',     'Turkey Sandwich',             'Turkey, spinach, tomato on sourdough',          520, 35, '2026-03-29', '2026-03-29T12:30:00Z'),
(uid, 'Dinner',    'Pasta Bolognese',              'Whole wheat pasta, lean beef sauce, parmesan', 650, 38, '2026-03-29', '2026-03-29T19:00:00Z'),

-- Mar 30
(uid, 'Breakfast', 'Protein Oatmeal',             'Oats, whey protein, banana, almond butter',    480, 32, '2026-03-30', '2026-03-30T07:30:00Z'),
(uid, 'Lunch',     'Chicken & Rice Bowl',          'Grilled chicken, brown rice, broccoli, avocado', 580, 45, '2026-03-30', '2026-03-30T12:00:00Z'),
(uid, 'Dinner',    'Salmon & Veggies',             'Baked salmon, sweet potato, green beans',      520, 38, '2026-03-30', '2026-03-30T19:30:00Z'),
(uid, 'Snack',     'Protein Shake',                'Whey protein, banana, peanut butter, oat milk', 350, 28, '2026-03-30', '2026-03-30T16:00:00Z'),

-- Mar 31
(uid, 'Breakfast', 'Greek Yogurt Bowl',            'Greek yogurt, granola, berries, honey',        420, 24, '2026-03-31', '2026-03-31T08:00:00Z'),
(uid, 'Lunch',     'Tuna Salad Wrap',              'Tuna, mixed greens, tomato, whole wheat wrap', 480, 36, '2026-03-31', '2026-03-31T12:30:00Z'),
(uid, 'Dinner',    'Stir Fry Chicken',             'Chicken breast, mixed vegetables, soy sauce, rice', 560, 42, '2026-03-31', '2026-03-31T18:45:00Z'),
(uid, 'Snack',     'Trail Mix',                    'Almonds, cashews, dark chocolate chips',       280, 8,  '2026-03-31', '2026-03-31T15:30:00Z'),

-- Apr 1
(uid, 'Breakfast', 'Smoothie Bowl',                'Banana, berries, protein powder, granola',     400, 26, '2026-04-01', '2026-04-01T09:00:00Z'),
(uid, 'Lunch',     'Burrito Bowl',                 'Rice, black beans, chicken, salsa, guacamole', 620, 40, '2026-04-01', '2026-04-01T13:00:00Z'),
(uid, 'Dinner',    'Pizza (cheat meal)',            'Two slices pepperoni, side salad',             580, 22, '2026-04-01', '2026-04-01T19:30:00Z'),

-- Apr 2
(uid, 'Breakfast', 'Egg White Omelette',           'Egg whites, spinach, mushroom, feta',          320, 28, '2026-04-02', '2026-04-02T07:30:00Z'),
(uid, 'Lunch',     'Grilled Chicken Salad',        'Chicken, mixed greens, quinoa, vinaigrette',   490, 42, '2026-04-02', '2026-04-02T12:00:00Z'),
(uid, 'Dinner',    'Beef Stir Fry',                'Lean beef, bell peppers, rice noodles',        550, 38, '2026-04-02', '2026-04-02T19:00:00Z'),
(uid, 'Snack',     'Cottage Cheese & Fruit',       'Low-fat cottage cheese, pineapple',           200, 22, '2026-04-02', '2026-04-02T16:00:00Z'),

-- Apr 3
(uid, 'Breakfast', 'Protein Pancakes',             'Oat flour, protein powder, blueberries',       440, 30, '2026-04-03', '2026-04-03T08:00:00Z'),
(uid, 'Lunch',     'Chicken Caesar Wrap',           'Grilled chicken, romaine, parmesan, wrap',    510, 38, '2026-04-03', '2026-04-03T12:15:00Z'),
(uid, 'Dinner',    'Shrimp & Quinoa Bowl',          'Garlic shrimp, quinoa, roasted veggies',      480, 36, '2026-04-03', '2026-04-03T19:00:00Z'),

-- Apr 4 (lazy Saturday — fewer meals)
(uid, 'Breakfast', 'Avocado Toast',                 'Sourdough, avocado, poached egg, chili flakes', 380, 18, '2026-04-04', '2026-04-04T10:30:00Z'),
(uid, 'Dinner',    'Burger & Sweet Potato Fries',   'Turkey burger, brioche bun, baked sweet potato fries', 680, 35, '2026-04-04', '2026-04-04T18:00:00Z'),

-- Apr 5
(uid, 'Breakfast', 'Overnight Oats',               'Oats, chia seeds, milk, berries, honey',      380, 14, '2026-04-05', '2026-04-05T08:30:00Z'),
(uid, 'Lunch',     'Salmon Poke Bowl',              'Salmon, sushi rice, edamame, avocado',        560, 34, '2026-04-05', '2026-04-05T12:30:00Z'),
(uid, 'Dinner',    'Chicken Fajitas',               'Chicken, peppers, onions, tortillas, salsa',  580, 38, '2026-04-05', '2026-04-05T19:00:00Z'),
(uid, 'Snack',     'Protein Bar',                   'Chocolate chip protein bar',                  220, 20, '2026-04-05', '2026-04-05T15:00:00Z'),

-- Apr 6
(uid, 'Breakfast', 'Scrambled Eggs & Toast',        'Three eggs, whole wheat toast, avocado',      450, 28, '2026-04-06', '2026-04-06T07:00:00Z'),
(uid, 'Lunch',     'Mediterranean Bowl',            'Falafel, hummus, tabbouleh, pita',            540, 22, '2026-04-06', '2026-04-06T12:00:00Z'),
(uid, 'Dinner',    'Grilled Steak & Veggies',       'Sirloin, asparagus, baked potato',            620, 48, '2026-04-06', '2026-04-06T19:30:00Z'),
(uid, 'Snack',     'Protein Shake',                 'Whey protein, banana, oat milk',              300, 28, '2026-04-06', '2026-04-06T16:30:00Z'),

-- Apr 7
(uid, 'Breakfast', 'Greek Yogurt Bowl',             'Greek yogurt, granola, mixed berries',        400, 24, '2026-04-07', '2026-04-07T07:30:00Z'),
(uid, 'Lunch',     'Chicken & Rice Bowl',           'Teriyaki chicken, jasmine rice, broccoli',    580, 42, '2026-04-07', '2026-04-07T12:00:00Z'),
(uid, 'Dinner',    'Turkey Meatballs & Pasta',      'Turkey meatballs, whole wheat penne, marinara', 560, 40, '2026-04-07', '2026-04-07T19:00:00Z'),
(uid, 'Snack',     'Apple & Peanut Butter',         'Sliced apple, natural peanut butter',         250, 8,  '2026-04-07', '2026-04-07T15:30:00Z'),

-- Apr 8
(uid, 'Breakfast', 'Protein Oatmeal',              'Oats, whey protein, strawberries',             460, 30, '2026-04-08', '2026-04-08T07:00:00Z'),
(uid, 'Lunch',     'Grilled Chicken Sandwich',      'Chicken breast, lettuce, tomato, whole wheat bun', 520, 40, '2026-04-08', '2026-04-08T12:15:00Z'),
(uid, 'Dinner',    'Cod & Brown Rice',              'Baked cod, brown rice, steamed broccoli',     480, 38, '2026-04-08', '2026-04-08T19:00:00Z'),

-- Apr 9
(uid, 'Breakfast', 'Smoothie',                     'Spinach, banana, protein powder, almond milk', 350, 26, '2026-04-09', '2026-04-09T08:30:00Z'),
(uid, 'Lunch',     'Taco Bowl',                     'Ground turkey, rice, beans, salsa, cheese',   590, 38, '2026-04-09', '2026-04-09T12:30:00Z'),
(uid, 'Dinner',    'Salmon & Asparagus',            'Pan-seared salmon, roasted asparagus, quinoa', 540, 40, '2026-04-09', '2026-04-09T19:00:00Z'),
(uid, 'Snack',     'Hard Boiled Eggs',              'Two hard boiled eggs, salt & pepper',          140, 12, '2026-04-09', '2026-04-09T15:00:00Z'),

-- Apr 10
(uid, 'Breakfast', 'Egg & Cheese Bagel',            'Everything bagel, scrambled eggs, cheddar',   480, 24, '2026-04-10', '2026-04-10T07:30:00Z'),
(uid, 'Lunch',     'Chicken & Avocado Salad',       'Grilled chicken, avocado, mixed greens, lime dressing', 500, 38, '2026-04-10', '2026-04-10T12:00:00Z'),
(uid, 'Dinner',    'Lamb Chops & Sweet Potato',     'Grilled lamb, mashed sweet potato, green beans', 600, 42, '2026-04-10', '2026-04-10T19:00:00Z'),
(uid, 'Snack',     'Protein Shake',                 'Chocolate whey, banana, peanut butter, milk', 380, 30, '2026-04-10', '2026-04-10T16:00:00Z'),

-- Apr 11 (today — just breakfast so far)
(uid, 'Breakfast', 'Protein Pancakes',              'Oat flour, protein powder, banana, maple syrup', 440, 30, '2026-04-11', '2026-04-11T09:00:00Z'),
(uid, 'Snack',     'Greek Yogurt',                  'Plain Greek yogurt, honey, walnuts',          260, 18, '2026-04-11', '2026-04-11T11:00:00Z');


-- ── Weekly Check-Ins ────────────────────────────────────────
DELETE FROM public.weekly_check_ins WHERE user_id = uid;

INSERT INTO public.weekly_check_ins (user_id, week_start, rating, consistency, challenges, focus_areas, went_well, was_difficult, created_at) VALUES
(uid, '2026-03-30', 3, 3,
  'Busy with assignments midweek, skipped one gym day. Ate pizza on Wednesday which threw off protein. Slept poorly Tuesday night before an exam.',
  ARRAY['More consistent workouts', 'Improve sleep habits'],
  'Stuck to meal prep for most lunches. Hit the gym 4 out of 5 planned days which felt good. Water intake was consistent.',
  'Staying on track with protein on rest days. Late-night studying killed my sleep schedule Tuesday and I felt it all Wednesday.',
  '2026-04-04T20:00:00Z'),

(uid, '2026-04-06', 4, 4,
  'Wednesday night was rough on sleep again — stayed up finishing a group project. Had one junk food slip on Thursday.',
  ARRAY['Better meal planning', 'Improve sleep habits', 'Increase protein intake'],
  'Hit a new PR on deadlifts (Tuesday). Completed every planned workout this week. Meal prep on Sunday made the whole week easier.',
  'Still struggling with consistent sleep. Need to set a hard cutoff for studying. Thursday I was tired and grabbed fast food for dinner instead of cooking.',
  '2026-04-11T10:00:00Z');


END $$;
