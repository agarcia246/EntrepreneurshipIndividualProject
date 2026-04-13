-- ============================================================
-- FuelFit — NUKE + RESEED
-- ============================================================
-- HOW TO USE:
--   1. Run this ENTIRE file in Supabase SQL Editor
--   2. It drops all public tables, re-creates them, creates a
--      test user, and populates 14 days of realistic data.
--   3. Log in with:  alex@student.ie.edu / FuelFit2026!
-- ============================================================


-- ─── STEP 1: NUKE EVERYTHING ────────────────────────────────

DROP TABLE IF EXISTS public.weekly_check_ins CASCADE;
DROP TABLE IF EXISTS public.habit_logs CASCADE;
DROP TABLE IF EXISTS public.habits CASCADE;
DROP TABLE IF EXISTS public.meals CASCADE;
DROP TABLE IF EXISTS public.workouts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DELETE FROM auth.users;


-- ─── STEP 2: RECREATE SCHEMA (from 00001_initial_schema.sql) ─

-- Profiles
CREATE TABLE public.profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  goals        text[] NOT NULL DEFAULT '{}',
  workout_days text NOT NULL DEFAULT '3-4',
  diet_style   text NOT NULL DEFAULT 'balanced',
  cooking_time text NOT NULL DEFAULT '30min',
  notifications_enabled boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Habits
CREATE TABLE public.habits (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label      text NOT NULL,
  icon       text NOT NULL DEFAULT 'check-circle',
  target     numeric NOT NULL DEFAULT 1,
  unit       text NOT NULL DEFAULT 'day',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX habits_user_id_idx ON public.habits(user_id);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own habits"   ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Habit Logs
CREATE TABLE public.habit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id   uuid NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date       date NOT NULL DEFAULT current_date,
  completed  boolean NOT NULL DEFAULT false,
  value      numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(habit_id, date)
);
CREATE INDEX habit_logs_user_date_idx ON public.habit_logs(user_id, date);
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own habit logs"   ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit logs" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit logs" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit logs" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

-- Workouts
CREATE TABLE public.workouts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text NOT NULL,
  muscle_group text NOT NULL DEFAULT '',
  duration     text NOT NULL DEFAULT '45 min',
  exercises    jsonb NOT NULL DEFAULT '[]',
  date         date NOT NULL DEFAULT current_date,
  completed    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX workouts_user_date_idx ON public.workouts(user_id, date);
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own workouts"   ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Meals
CREATE TABLE public.meals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type   text NOT NULL,
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  calories    int NOT NULL DEFAULT 0,
  protein     int NOT NULL DEFAULT 0,
  date        date NOT NULL DEFAULT current_date,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX meals_user_date_idx ON public.meals(user_id, date);
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own meals"   ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- Weekly Check-Ins
CREATE TABLE public.weekly_check_ins (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start    date NOT NULL,
  rating        int NOT NULL DEFAULT 0,
  consistency   int NOT NULL DEFAULT 3,
  challenges    text NOT NULL DEFAULT '',
  focus_areas   text[] NOT NULL DEFAULT '{}',
  went_well     text NOT NULL DEFAULT '',
  was_difficult text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);
CREATE INDEX check_ins_user_idx ON public.weekly_check_ins(user_id);
ALTER TABLE public.weekly_check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own check-ins"   ON public.weekly_check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own check-ins" ON public.weekly_check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own check-ins" ON public.weekly_check_ins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own check-ins" ON public.weekly_check_ins FOR DELETE USING (auth.uid() = user_id);


-- ─── STEP 3: CREATE TEST USER ──────────────────────────────
-- Email: alex@student.ie.edu  Password: FuelFit2026!

DO $$
DECLARE
  uid uuid := gen_random_uuid();

  h_gym     uuid := gen_random_uuid();
  h_meals   uuid := gen_random_uuid();
  h_water   uuid := gen_random_uuid();
  h_sleep   uuid := gen_random_uuid();
  h_eating  uuid := gen_random_uuid();
  h_morning uuid := gen_random_uuid();
BEGIN

-- Create auth user (SQL editor runs as postgres, so this works)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uid,
  'authenticated',
  'authenticated',
  'alex@student.ie.edu',
  crypt('FuelFit2026!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Alex Garcia"}',
  '2026-03-22 20:00:00+01',
  now(), '', '', '', ''
);

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  uid,
  jsonb_build_object('sub', uid::text, 'email', 'alex@student.ie.edu'),
  'email',
  uid::text,
  now(), now(), now()
);

-- The trigger auto-created the profile; now update it with real prefs
UPDATE public.profiles SET
  display_name = 'Alex Garcia',
  goals = ARRAY['Build muscle', 'Eat healthier', 'Build consistency'],
  workout_days = '4-5',
  diet_style = 'high-protein',
  cooking_time = '30min',
  notifications_enabled = true,
  updated_at = now()
WHERE id = uid;


-- ─── STEP 4: SEED HABITS ───────────────────────────────────

INSERT INTO public.habits (id, user_id, label, icon, target, unit, sort_order, created_at) VALUES
  (h_gym,     uid, 'Go to Gym',       'dumbbell',     1, 'day', 0, '2026-03-23 08:00:00+01'),
  (h_meals,   uid, 'Log All Meals',   'utensils',     3, 'day', 1, '2026-03-23 08:00:00+01'),
  (h_water,   uid, 'Drink 2L Water',  'droplets',     2, 'L',   2, '2026-03-23 08:00:00+01'),
  (h_sleep,   uid, 'Sleep 8 Hours',   'moon',         8, 'hrs', 3, '2026-03-23 08:00:00+01'),
  (h_eating,  uid, 'Eat Healthy',     'apple',        1, 'day', 4, '2026-03-23 08:00:00+01'),
  (h_morning, uid, 'Morning Routine', 'sunrise',      1, 'day', 5, '2026-03-23 08:00:00+01');


-- ─── STEP 5: SEED HABIT LOGS (14 days) ─────────────────────
-- Week 1 (Attempt 2): 24/42 = 57% ≈ 58%
-- Week 2 (Attempt 3): 30/42 = 71% ≈ 72%

-- W1 Mon 23 — 6/6
INSERT INTO public.habit_logs (user_id,habit_id,date,completed,created_at) VALUES
(uid,h_gym,    '2026-03-23',true,'2026-03-23 11:30:00+01'),
(uid,h_meals,  '2026-03-23',true,'2026-03-23 21:00:00+01'),
(uid,h_water,  '2026-03-23',true,'2026-03-23 21:00:00+01'),
(uid,h_sleep,  '2026-03-23',true,'2026-03-23 08:00:00+01'),
(uid,h_eating, '2026-03-23',true,'2026-03-23 21:00:00+01'),
(uid,h_morning,'2026-03-23',true,'2026-03-23 07:30:00+01'),
-- W1 Tue 24 — 6/6
(uid,h_gym,    '2026-03-24',true,'2026-03-24 10:45:00+01'),
(uid,h_meals,  '2026-03-24',true,'2026-03-24 21:30:00+01'),
(uid,h_water,  '2026-03-24',true,'2026-03-24 20:00:00+01'),
(uid,h_sleep,  '2026-03-24',true,'2026-03-24 08:15:00+01'),
(uid,h_eating, '2026-03-24',true,'2026-03-24 21:30:00+01'),
(uid,h_morning,'2026-03-24',true,'2026-03-24 07:45:00+01'),
-- W1 Wed 25 — 5/6
(uid,h_gym,    '2026-03-25',true, '2026-03-25 12:15:00+01'),
(uid,h_meals,  '2026-03-25',true, '2026-03-25 22:00:00+01'),
(uid,h_water,  '2026-03-25',true, '2026-03-25 19:00:00+01'),
(uid,h_sleep,  '2026-03-25',false,'2026-03-25 22:00:00+01'),
(uid,h_eating, '2026-03-25',true, '2026-03-25 22:00:00+01'),
(uid,h_morning,'2026-03-25',true, '2026-03-25 07:30:00+01'),
-- W1 Thu 26 — 1/6 (life issues, streak broke)
(uid,h_gym,    '2026-03-26',false,'2026-03-26 23:00:00+01'),
(uid,h_meals,  '2026-03-26',false,'2026-03-26 23:00:00+01'),
(uid,h_water,  '2026-03-26',true, '2026-03-26 23:00:00+01'),
(uid,h_sleep,  '2026-03-26',false,'2026-03-26 23:00:00+01'),
(uid,h_eating, '2026-03-26',false,'2026-03-26 23:00:00+01'),
(uid,h_morning,'2026-03-26',false,'2026-03-26 23:00:00+01'),
-- W1 Fri 27 — 2/6
(uid,h_gym,    '2026-03-27',false,'2026-03-27 22:00:00+01'),
(uid,h_meals,  '2026-03-27',true, '2026-03-27 21:30:00+01'),
(uid,h_water,  '2026-03-27',true, '2026-03-27 22:00:00+01'),
(uid,h_sleep,  '2026-03-27',false,'2026-03-27 22:00:00+01'),
(uid,h_eating, '2026-03-27',false,'2026-03-27 22:00:00+01'),
(uid,h_morning,'2026-03-27',false,'2026-03-27 22:00:00+01'),
-- W1 Sat 28 — 1/6
(uid,h_gym,    '2026-03-28',false,'2026-03-28 23:30:00+01'),
(uid,h_meals,  '2026-03-28',false,'2026-03-28 23:30:00+01'),
(uid,h_water,  '2026-03-28',true, '2026-03-28 23:30:00+01'),
(uid,h_sleep,  '2026-03-28',false,'2026-03-28 23:30:00+01'),
(uid,h_eating, '2026-03-28',false,'2026-03-28 23:30:00+01'),
(uid,h_morning,'2026-03-28',false,'2026-03-28 23:30:00+01'),
-- W1 Sun 29 — 3/6
(uid,h_gym,    '2026-03-29',false,'2026-03-29 22:00:00+01'),
(uid,h_meals,  '2026-03-29',false,'2026-03-29 22:00:00+01'),
(uid,h_water,  '2026-03-29',true, '2026-03-29 22:00:00+01'),
(uid,h_sleep,  '2026-03-29',true, '2026-03-29 08:00:00+01'),
(uid,h_eating, '2026-03-29',false,'2026-03-29 22:00:00+01'),
(uid,h_morning,'2026-03-29',true, '2026-03-29 09:00:00+01'),

-- W2 Mon 30 — 6/6
(uid,h_gym,    '2026-03-30',true,'2026-03-30 11:15:00+02'),
(uid,h_meals,  '2026-03-30',true,'2026-03-30 21:00:00+02'),
(uid,h_water,  '2026-03-30',true,'2026-03-30 20:00:00+02'),
(uid,h_sleep,  '2026-03-30',true,'2026-03-30 07:30:00+02'),
(uid,h_eating, '2026-03-30',true,'2026-03-30 21:00:00+02'),
(uid,h_morning,'2026-03-30',true,'2026-03-30 07:45:00+02'),
-- W2 Tue 31 — 5/6
(uid,h_gym,    '2026-03-31',true, '2026-03-31 11:45:00+02'),
(uid,h_meals,  '2026-03-31',true, '2026-03-31 21:30:00+02'),
(uid,h_water,  '2026-03-31',true, '2026-03-31 19:00:00+02'),
(uid,h_sleep,  '2026-03-31',false,'2026-03-31 22:00:00+02'),
(uid,h_eating, '2026-03-31',true, '2026-03-31 21:30:00+02'),
(uid,h_morning,'2026-03-31',true, '2026-03-31 07:30:00+02'),
-- W2 Wed Apr 1 — 5/6
(uid,h_gym,    '2026-04-01',true, '2026-04-01 11:30:00+02'),
(uid,h_meals,  '2026-04-01',true, '2026-04-01 21:00:00+02'),
(uid,h_water,  '2026-04-01',true, '2026-04-01 18:00:00+02'),
(uid,h_sleep,  '2026-04-01',true, '2026-04-01 08:00:00+02'),
(uid,h_eating, '2026-04-01',true, '2026-04-01 21:00:00+02'),
(uid,h_morning,'2026-04-01',false,'2026-04-01 22:00:00+02'),
-- W2 Thu Apr 2 — 2/6 (rough day, no gym)
(uid,h_gym,    '2026-04-02',false,'2026-04-02 23:00:00+02'),
(uid,h_meals,  '2026-04-02',true, '2026-04-02 22:00:00+02'),
(uid,h_water,  '2026-04-02',true, '2026-04-02 23:00:00+02'),
(uid,h_sleep,  '2026-04-02',false,'2026-04-02 23:00:00+02'),
(uid,h_eating, '2026-04-02',false,'2026-04-02 23:00:00+02'),
(uid,h_morning,'2026-04-02',false,'2026-04-02 23:00:00+02'),
-- W2 Fri Apr 3 — 5/6 (bounced back)
(uid,h_gym,    '2026-04-03',true, '2026-04-03 11:15:00+02'),
(uid,h_meals,  '2026-04-03',true, '2026-04-03 20:30:00+02'),
(uid,h_water,  '2026-04-03',true, '2026-04-03 19:00:00+02'),
(uid,h_sleep,  '2026-04-03',true, '2026-04-03 08:00:00+02'),
(uid,h_eating, '2026-04-03',true, '2026-04-03 20:30:00+02'),
(uid,h_morning,'2026-04-03',false,'2026-04-03 22:00:00+02'),
-- W2 Sat Apr 4 — 3/6
(uid,h_gym,    '2026-04-04',true, '2026-04-04 10:45:00+02'),
(uid,h_meals,  '2026-04-04',true, '2026-04-04 21:00:00+02'),
(uid,h_water,  '2026-04-04',true, '2026-04-04 20:00:00+02'),
(uid,h_sleep,  '2026-04-04',false,'2026-04-04 23:00:00+02'),
(uid,h_eating, '2026-04-04',false,'2026-04-04 21:00:00+02'),
(uid,h_morning,'2026-04-04',false,'2026-04-04 23:00:00+02'),
-- W2 Sun Apr 5 — 4/6 (rest day)
(uid,h_gym,    '2026-04-05',false,'2026-04-05 22:00:00+02'),
(uid,h_meals,  '2026-04-05',true, '2026-04-05 20:30:00+02'),
(uid,h_water,  '2026-04-05',true, '2026-04-05 21:00:00+02'),
(uid,h_sleep,  '2026-04-05',true, '2026-04-05 08:30:00+02'),
(uid,h_eating, '2026-04-05',true, '2026-04-05 20:30:00+02'),
(uid,h_morning,'2026-04-05',false,'2026-04-05 22:00:00+02');

-- Week 1: 6+6+5+1+2+1+3 = 24/42 = 57% ≈ 58%
-- Week 2: 6+5+5+2+5+3+4 = 30/42 = 71% ≈ 72%


-- ─── STEP 6: SEED WORKOUTS ─────────────────────────────────
-- Week 1: Mon-Wed only (broke streak Thu)
-- Week 2: Mon-Wed + Fri + Sat (missed rough Thu, rest Sun)

INSERT INTO public.workouts (user_id, title, muscle_group, duration, exercises, date, completed, created_at) VALUES
-- Week 1
(uid, 'Upper Body Strength', 'Chest & Shoulders', '65 min',
 '[{"name":"Bench Press","sets":4,"reps":10,"weight":"60kg"},
   {"name":"Overhead Press","sets":3,"reps":10,"weight":"35kg"},
   {"name":"Dumbbell Rows","sets":4,"reps":12,"weight":"22kg"},
   {"name":"Lateral Raises","sets":3,"reps":15,"weight":"10kg"},
   {"name":"Tricep Dips","sets":3,"reps":12,"weight":"BW"}]',
 '2026-03-23', true, '2026-03-23 11:15:00+01'),

(uid, 'Cardio + Core', 'Core & Conditioning', '45 min',
 '[{"name":"Treadmill Run","sets":1,"reps":1,"weight":"25 min @ 9.5 km/h"},
   {"name":"Plank","sets":3,"reps":1,"weight":"60 sec"},
   {"name":"Russian Twists","sets":3,"reps":20,"weight":"8kg"},
   {"name":"Bicycle Crunches","sets":3,"reps":20,"weight":"BW"}]',
 '2026-03-24', true, '2026-03-24 10:30:00+01'),

(uid, 'Leg Day', 'Legs & Glutes', '55 min',
 '[{"name":"Squats","sets":4,"reps":10,"weight":"70kg"},
   {"name":"Romanian Deadlifts","sets":3,"reps":12,"weight":"50kg"},
   {"name":"Leg Press","sets":4,"reps":12,"weight":"100kg"},
   {"name":"Calf Raises","sets":3,"reps":15,"weight":"40kg"}]',
 '2026-03-25', true, '2026-03-25 12:00:00+01'),

-- Week 2
(uid, 'Push Day', 'Chest & Triceps', '60 min',
 '[{"name":"Bench Press","sets":4,"reps":10,"weight":"65kg"},
   {"name":"Incline Dumbbell Press","sets":3,"reps":12,"weight":"24kg"},
   {"name":"Overhead Press","sets":3,"reps":10,"weight":"37.5kg"},
   {"name":"Cable Flyes","sets":3,"reps":15,"weight":"15kg"},
   {"name":"Tricep Pushdowns","sets":3,"reps":12,"weight":"25kg"}]',
 '2026-03-30', true, '2026-03-30 11:00:00+02'),

(uid, 'Cardio + HIIT', 'Full Body', '50 min',
 '[{"name":"Rowing Machine","sets":1,"reps":1,"weight":"15 min"},
   {"name":"HIIT Circuit (burpees, mountain climbers, jump squats, high knees)","sets":4,"reps":1,"weight":"4 rounds"},
   {"name":"Cool-down Jog","sets":1,"reps":1,"weight":"10 min"}]',
 '2026-03-31', true, '2026-03-31 11:30:00+02'),

(uid, 'Pull Day', 'Back & Biceps', '65 min',
 '[{"name":"Deadlifts","sets":4,"reps":8,"weight":"80kg"},
   {"name":"Pull-ups","sets":4,"reps":8,"weight":"BW"},
   {"name":"Barbell Rows","sets":4,"reps":10,"weight":"55kg"},
   {"name":"Face Pulls","sets":3,"reps":15,"weight":"12kg"},
   {"name":"Bicep Curls","sets":3,"reps":12,"weight":"14kg"}]',
 '2026-04-01', true, '2026-04-01 11:15:00+02'),

(uid, 'Leg Day', 'Legs & Glutes', '60 min',
 '[{"name":"Squats","sets":4,"reps":10,"weight":"75kg"},
   {"name":"Leg Press","sets":4,"reps":12,"weight":"110kg"},
   {"name":"Walking Lunges","sets":3,"reps":12,"weight":"20kg"},
   {"name":"Leg Curls","sets":3,"reps":12,"weight":"35kg"},
   {"name":"Calf Raises","sets":4,"reps":15,"weight":"45kg"}]',
 '2026-04-03', true, '2026-04-03 11:00:00+02'),

(uid, 'Active Recovery', 'Full Body', '35 min',
 '[{"name":"Stationary Bike","sets":1,"reps":1,"weight":"20 min moderate"},
   {"name":"Full Body Stretch","sets":1,"reps":1,"weight":"15 min"}]',
 '2026-04-04', true, '2026-04-04 10:30:00+02');


-- ─── STEP 7: SEED MEALS ────────────────────────────────────

INSERT INTO public.meals (user_id, meal_type, name, description, calories, protein, date, created_at) VALUES
-- W1 Mon 23
(uid,'breakfast','Oatmeal with Banana & Almonds','Rolled oats, sliced banana, honey, crushed almonds',380,12,'2026-03-23','2026-03-23 08:30:00+01'),
(uid,'lunch','Grilled Chicken Quinoa Salad','Mixed greens, grilled chicken breast, quinoa, lemon vinaigrette',520,42,'2026-03-23','2026-03-23 13:45:00+01'),
(uid,'dinner','Salmon & Roasted Veg','Baked salmon fillet, roasted broccoli and sweet potato, brown rice',580,38,'2026-03-23','2026-03-23 20:30:00+01'),
-- W1 Tue 24
(uid,'breakfast','Greek Yogurt Bowl','Greek yogurt, granola, mixed berries, drizzle of honey',340,18,'2026-03-24','2026-03-24 08:15:00+01'),
(uid,'lunch','Turkey Avocado Wrap','Whole wheat wrap, sliced turkey, avocado, spinach, tomato',480,32,'2026-03-24','2026-03-24 14:00:00+01'),
(uid,'dinner','Beef Bolognese Pasta','Whole wheat pasta, lean ground beef sauce, parmesan',620,35,'2026-03-24','2026-03-24 21:00:00+01'),
-- W1 Wed 25
(uid,'breakfast','Eggs & Avocado Toast','Scrambled eggs on sourdough with smashed avocado',420,22,'2026-03-25','2026-03-25 08:45:00+01'),
(uid,'lunch','Chicken Stir-Fry','Chicken breast, mixed vegetables, soy sauce, jasmine rice',550,38,'2026-03-25','2026-03-25 13:30:00+01'),
(uid,'dinner','Pizza & Side Salad','2 slices margherita pizza with mixed green salad',680,24,'2026-03-25','2026-03-25 21:30:00+01'),
-- W1 Thu 26 (bad day)
(uid,'lunch','Big Mac Meal','McDonald''s Big Mac, medium fries, Coke',1080,28,'2026-03-26','2026-03-26 15:00:00+01'),
-- W1 Fri 27
(uid,'lunch','Kebab','Lamb kebab with fries and garlic sauce from campus spot',750,30,'2026-03-27','2026-03-27 14:30:00+01'),
(uid,'dinner','Frozen Pizza','Dr. Oetker Ristorante pepperoni pizza',820,22,'2026-03-27','2026-03-27 21:00:00+01'),
-- W1 Sat 28 & Sun 29: nothing logged

-- W2 Mon 30
(uid,'breakfast','Protein Smoothie','Oats, banana, peanut butter, whey protein, almond milk',450,30,'2026-03-30','2026-03-30 08:00:00+02'),
(uid,'lunch','Chicken & Sweet Potato','Grilled chicken breast, roasted sweet potato, steamed broccoli',540,45,'2026-03-30','2026-03-30 14:00:00+02'),
(uid,'dinner','Tuna Steak','Seared tuna steak, mixed leaf salad, basmati rice',520,42,'2026-03-30','2026-03-30 20:45:00+02'),
-- W2 Tue 31
(uid,'breakfast','Eggs on Toast','Two fried eggs on sourdough, avocado, chilli flakes',400,20,'2026-03-31','2026-03-31 08:30:00+02'),
(uid,'lunch','Chicken Caesar Salad','Romaine, grilled chicken, parmesan, Caesar dressing',420,38,'2026-03-31','2026-03-31 13:30:00+02'),
(uid,'dinner','Steak & Potatoes','Sirloin steak, roasted baby potatoes, green beans',650,48,'2026-03-31','2026-03-31 21:00:00+02'),
-- W2 Wed Apr 1
(uid,'breakfast','Overnight Oats','Oats, chia seeds, blueberries, almond milk',360,14,'2026-04-01','2026-04-01 07:45:00+02'),
(uid,'lunch','Salmon Poke Bowl','Salmon sashimi, edamame, avocado, sushi rice, soy sauce',560,36,'2026-04-01','2026-04-01 13:15:00+02'),
(uid,'dinner','Chicken Fajitas','Grilled chicken, peppers, onions, guacamole, tortillas',580,40,'2026-04-01','2026-04-01 20:30:00+02'),
-- W2 Thu Apr 2 (rough day)
(uid,'lunch','Whopper Meal','Burger King Whopper, fries, Sprite',980,26,'2026-04-02','2026-04-02 14:00:00+02'),
(uid,'dinner','Instant Ramen','Shin Ramyun with a fried egg',520,14,'2026-04-02','2026-04-02 21:30:00+02'),
-- W2 Fri Apr 3
(uid,'breakfast','Yogurt Parfait','Greek yogurt, granola, honey, mixed berries',380,20,'2026-04-03','2026-04-03 08:00:00+02'),
(uid,'lunch','Turkey Sandwich','Whole wheat bread, turkey, avocado, lettuce, tomato',490,32,'2026-04-03','2026-04-03 13:30:00+02'),
(uid,'dinner','Grilled Sea Bass','Sea bass fillet, couscous, roasted Mediterranean vegetables',480,36,'2026-04-03','2026-04-03 20:00:00+02'),
-- W2 Sat Apr 4
(uid,'breakfast','Pancakes','Pancakes with maple syrup, banana, and mixed berries',520,12,'2026-04-04','2026-04-04 09:30:00+02'),
(uid,'lunch','Chicken Shawarma Plate','Shawarma chicken, hummus, tabbouleh, pickles, pita',600,35,'2026-04-04','2026-04-04 14:00:00+02'),
(uid,'dinner','Pesto Pasta','Homemade pasta, basil pesto, grilled chicken, parmesan',580,38,'2026-04-04','2026-04-04 20:30:00+02'),
-- W2 Sun Apr 5
(uid,'breakfast','Smoothie Bowl','Banana, mixed berries, protein powder, granola, coconut',400,28,'2026-04-05','2026-04-05 09:00:00+02'),
(uid,'lunch','Halloumi Wrap','Grilled halloumi, roasted vegetables, hummus, spinach wrap',480,22,'2026-04-05','2026-04-05 13:00:00+02'),
(uid,'dinner','Chicken Curry','Chicken tikka masala, brown rice, naan bread',560,36,'2026-04-05','2026-04-05 20:00:00+02');


-- ─── STEP 8: SEED WEEKLY CHECK-INS ─────────────────────────

INSERT INTO public.weekly_check_ins (user_id, week_start, rating, consistency, challenges, focus_areas, went_well, was_difficult, created_at) VALUES
(uid, '2026-03-23', 2, 2,
 'Lost all momentum after Thursday. One bad day snowballed into four.',
 ARRAY['Consistency', 'Meal prep', 'Sleep schedule'],
 'The app finally works with real data and the first three days felt incredible — I was actually tracking everything and going to the gym consistently.',
 'Everything after Thursday. Some personal stuff came up and I completely abandoned the routine. By Sunday I was making excuses not to even open the app. Data capture alone doesn''t drive behaviour change.',
 '2026-03-29 22:30:00+01'),

(uid, '2026-03-30', 4, 4,
 'Thursday was rough again but I didn''t let it spiral this time.',
 ARRAY['Morning routine', 'Recovery from bad days', 'Sleep consistency'],
 'The push notifications saved me — the 11am gym reminder got me off the couch on Tuesday. Added streaks and they genuinely motivated me. Went from 58% to 72% habit completion. Friday recovery after missing Thursday felt like a real win.',
 'The notification server crashed mid-week which was annoying. Still can''t nail the morning routine consistently. Thursday was another bad day but at least I logged my meals even though I ate garbage.',
 '2026-04-05 21:00:00+02');


-- Done!
RAISE NOTICE 'Seed complete. Login: alex@student.ie.edu / FuelFit2026!';

END $$;
