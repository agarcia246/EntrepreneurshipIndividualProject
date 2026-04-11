-- ============================================================
-- FuelFit Student Planner — Initial Schema
-- Run in Supabase SQL Editor or via `supabase db push`
-- ============================================================

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  goals        text[] not null default '{}',
  workout_days text not null default '3-4',
  diet_style   text not null default 'balanced',
  cooking_time text not null default '30min',
  notifications_enabled boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Habits
create table public.habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  label      text not null,
  icon       text not null default 'check-circle',
  target     numeric not null default 1,
  unit       text not null default 'day',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index habits_user_id_idx on public.habits(user_id);
alter table public.habits enable row level security;

create policy "Users can read own habits"
  on public.habits for select using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete using (auth.uid() = user_id);


-- 3. Habit Logs (daily completions)
create table public.habit_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  habit_id   uuid not null references public.habits(id) on delete cascade,
  date       date not null default current_date,
  completed  boolean not null default false,
  value      numeric,
  created_at timestamptz not null default now(),
  unique(habit_id, date)
);

create index habit_logs_user_date_idx on public.habit_logs(user_id, date);
alter table public.habit_logs enable row level security;

create policy "Users can read own habit logs"
  on public.habit_logs for select using (auth.uid() = user_id);

create policy "Users can insert own habit logs"
  on public.habit_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own habit logs"
  on public.habit_logs for update using (auth.uid() = user_id);

create policy "Users can delete own habit logs"
  on public.habit_logs for delete using (auth.uid() = user_id);


-- 4. Workouts
create table public.workouts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  muscle_group text not null default '',
  duration     text not null default '45 min',
  exercises    jsonb not null default '[]',
  date         date not null default current_date,
  completed    boolean not null default false,
  created_at   timestamptz not null default now()
);

create index workouts_user_date_idx on public.workouts(user_id, date);
alter table public.workouts enable row level security;

create policy "Users can read own workouts"
  on public.workouts for select using (auth.uid() = user_id);

create policy "Users can insert own workouts"
  on public.workouts for insert with check (auth.uid() = user_id);

create policy "Users can update own workouts"
  on public.workouts for update using (auth.uid() = user_id);

create policy "Users can delete own workouts"
  on public.workouts for delete using (auth.uid() = user_id);


-- 5. Meals
create table public.meals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  meal_type   text not null,
  name        text not null,
  description text not null default '',
  calories    int not null default 0,
  protein     int not null default 0,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

create index meals_user_date_idx on public.meals(user_id, date);
alter table public.meals enable row level security;

create policy "Users can read own meals"
  on public.meals for select using (auth.uid() = user_id);

create policy "Users can insert own meals"
  on public.meals for insert with check (auth.uid() = user_id);

create policy "Users can update own meals"
  on public.meals for update using (auth.uid() = user_id);

create policy "Users can delete own meals"
  on public.meals for delete using (auth.uid() = user_id);


-- 6. Weekly Check-Ins
create table public.weekly_check_ins (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  week_start    date not null,
  rating        int not null default 0,
  consistency   int not null default 3,
  challenges    text not null default '',
  focus_areas   text[] not null default '{}',
  went_well     text not null default '',
  was_difficult text not null default '',
  created_at    timestamptz not null default now(),
  unique(user_id, week_start)
);

create index check_ins_user_idx on public.weekly_check_ins(user_id);
alter table public.weekly_check_ins enable row level security;

create policy "Users can read own check-ins"
  on public.weekly_check_ins for select using (auth.uid() = user_id);

create policy "Users can insert own check-ins"
  on public.weekly_check_ins for insert with check (auth.uid() = user_id);

create policy "Users can update own check-ins"
  on public.weekly_check_ins for update using (auth.uid() = user_id);

create policy "Users can delete own check-ins"
  on public.weekly_check_ins for delete using (auth.uid() = user_id);
