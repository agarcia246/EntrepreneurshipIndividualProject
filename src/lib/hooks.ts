import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'
import type { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Habit = Database['public']['Tables']['habits']['Row']
type HabitLog = Database['public']['Tables']['habit_logs']['Row']
type Workout = Database['public']['Tables']['workouts']['Row']
type Meal = Database['public']['Tables']['meals']['Row']
type WeeklyCheckIn = Database['public']['Tables']['weekly_check_ins']['Row']

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function weekStartISO() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff)).toISOString().split('T')[0]
}

// ─── Profile ───────────────────────────────────────────────

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile(data)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const update = async (updates: Partial<Profile>) => {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (!error) await fetch()
    return { error }
  }

  return { profile, loading, update, refetch: fetch }
}

// ─── Habits ────────────────────────────────────────────────

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order')
    setHabits(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const add = async (habit: { label: string; icon?: string; target?: number; unit?: string }) => {
    if (!user) return
    await supabase.from('habits').insert({
      user_id: user.id,
      label: habit.label,
      icon: habit.icon || 'check-circle',
      target: habit.target || 1,
      unit: habit.unit || 'day',
      sort_order: habits.length,
    })
    await fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id)
    await fetch()
  }

  return { habits, loading, add, remove, refetch: fetch }
}

export function useHabitLogs(date?: string) {
  const { user } = useAuth()
  const d = date || todayISO()
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', d)
    setLogs(data ?? [])
    setLoading(false)
  }, [user, d])

  useEffect(() => { fetch() }, [fetch])

  const toggle = async (habitId: string) => {
    if (!user) return
    const existing = logs.find(l => l.habit_id === habitId)
    if (existing) {
      await supabase.from('habit_logs').update({ completed: !existing.completed }).eq('id', existing.id)
    } else {
      await supabase.from('habit_logs').insert({
        user_id: user.id,
        habit_id: habitId,
        date: d,
        completed: true,
      })
    }
    await fetch()
  }

  return { logs, loading, toggle, refetch: fetch }
}

// ─── Workouts ──────────────────────────────────────────────

export function useWorkouts(date?: string) {
  const { user } = useAuth()
  const d = date || todayISO()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', d)
      .order('created_at')
    setWorkouts(data ?? [])
    setLoading(false)
  }, [user, d])

  useEffect(() => { fetch() }, [fetch])

  const add = async (workout: Omit<Workout, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    await supabase.from('workouts').insert({ ...workout, user_id: user.id })
    await fetch()
  }

  const markComplete = async (id: string) => {
    await supabase.from('workouts').update({ completed: true }).eq('id', id)
    await fetch()
  }

  return { workouts, loading, add, markComplete, refetch: fetch }
}

export function useAllWorkouts() {
  const { user } = useAuth()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
    setWorkouts(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])
  return { workouts, loading, refetch: fetch }
}

// ─── Meals ─────────────────────────────────────────────────

export function useMeals(date?: string) {
  const { user } = useAuth()
  const d = date || todayISO()
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', d)
      .order('created_at')
    setMeals(data ?? [])
    setLoading(false)
  }, [user, d])

  useEffect(() => { fetch() }, [fetch])

  const add = async (meal: Omit<Meal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    await supabase.from('meals').insert({ ...meal, user_id: user.id })
    await fetch()
  }

  const remove = async (id: string) => {
    await supabase.from('meals').delete().eq('id', id)
    await fetch()
  }

  return { meals, loading, add, remove, refetch: fetch }
}

// ─── Weekly Check-Ins ──────────────────────────────────────

export function useWeeklyCheckIn() {
  const { user } = useAuth()
  const weekStart = weekStartISO()
  const [checkIn, setCheckIn] = useState<WeeklyCheckIn | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('weekly_check_ins')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .single()
    setCheckIn(data)
    setLoading(false)
  }, [user, weekStart])

  useEffect(() => { fetch() }, [fetch])

  const save = async (values: {
    rating: number
    consistency: number
    challenges: string
    focus_areas: string[]
    went_well?: string
    was_difficult?: string
  }) => {
    if (!user) return
    if (checkIn) {
      await supabase.from('weekly_check_ins').update(values).eq('id', checkIn.id)
    } else {
      await supabase.from('weekly_check_ins').insert({
        user_id: user.id,
        week_start: weekStart,
        ...values,
      })
    }
    await fetch()
  }

  return { checkIn, loading, save, refetch: fetch }
}

// ─── Stats (for Progress) ──────────────────────────────────

export function useStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    workoutsTotal: 0,
    mealsLogged: 0,
    habitsCompleted: 0,
    habitsTotal: 0,
    currentStreak: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    Promise.all([
      supabase.from('workouts').select('id, completed', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('meals').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('habit_logs').select('id, completed', { count: 'exact' }).eq('user_id', user.id).eq('completed', true),
      supabase.from('habit_logs').select('id', { count: 'exact' }).eq('user_id', user.id),
    ]).then(([workoutsRes, mealsRes, habitsDoneRes, habitsAllRes]) => {
      const workouts = workoutsRes.data ?? []
      const completedWorkouts = workouts.filter((w: { completed: boolean }) => w.completed).length
      setStats({
        workoutsCompleted: completedWorkouts,
        workoutsTotal: workoutsRes.count ?? 0,
        mealsLogged: mealsRes.count ?? 0,
        habitsCompleted: habitsDoneRes.count ?? 0,
        habitsTotal: habitsAllRes.count ?? 0,
        currentStreak: completedWorkouts,
      })
      setLoading(false)
    })
  }, [user])

  return { stats, loading }
}

// ─── Seed default data for new users ───────────────────────

export async function seedDefaultData(userId: string) {
  const defaultHabits = [
    { label: '8 glasses of water', icon: 'droplets', target: 8, unit: 'glasses' },
    { label: '7+ hours sleep', icon: 'moon', target: 7, unit: 'hours' },
    { label: 'Protein target', icon: 'beef', target: 120, unit: 'grams' },
    { label: 'Steps goal', icon: 'trending-up', target: 8000, unit: 'steps' },
    { label: 'No junk food', icon: 'cookie', target: 1, unit: 'day' },
    { label: 'Gym session', icon: 'dumbbell', target: 1, unit: 'session' },
  ]

  const defaultWorkouts = [
    {
      title: 'Push Day', muscle_group: 'Chest, Shoulders, Triceps', duration: '45 min',
      exercises: [
        { name: 'Bench Press', sets: '4 sets', reps: '8-10 reps' },
        { name: 'Overhead Press', sets: '3 sets', reps: '10-12 reps' },
        { name: 'Incline Dumbbell Press', sets: '3 sets', reps: '10-12 reps' },
        { name: 'Lateral Raises', sets: '3 sets', reps: '12-15 reps' },
        { name: 'Tricep Dips', sets: '3 sets', reps: '10-12 reps' },
      ],
    },
    {
      title: 'Pull Day', muscle_group: 'Back, Biceps', duration: '45 min',
      exercises: [
        { name: 'Deadlift', sets: '4 sets', reps: '6-8 reps' },
        { name: 'Pull-ups', sets: '3 sets', reps: '8-10 reps' },
        { name: 'Barbell Rows', sets: '3 sets', reps: '10-12 reps' },
        { name: 'Face Pulls', sets: '3 sets', reps: '12-15 reps' },
        { name: 'Bicep Curls', sets: '3 sets', reps: '10-12 reps' },
      ],
    },
    {
      title: 'Legs', muscle_group: 'Quads, Hamstrings, Glutes', duration: '50 min',
      exercises: [
        { name: 'Squats', sets: '4 sets', reps: '8-10 reps' },
        { name: 'Romanian Deadlift', sets: '3 sets', reps: '10-12 reps' },
        { name: 'Leg Press', sets: '3 sets', reps: '12-15 reps' },
        { name: 'Leg Curls', sets: '3 sets', reps: '12-15 reps' },
        { name: 'Calf Raises', sets: '4 sets', reps: '15-20 reps' },
      ],
    },
  ]

  const defaultMeals = [
    { meal_type: 'Breakfast', name: 'Greek Yogurt Bowl', description: 'Greek yogurt, granola, berries, honey', calories: 420, protein: 24 },
    { meal_type: 'Lunch', name: 'Chicken & Rice Bowl', description: 'Grilled chicken, brown rice, broccoli, avocado', calories: 580, protein: 45 },
    { meal_type: 'Dinner', name: 'Salmon & Veggies', description: 'Baked salmon, sweet potato, green beans', calories: 520, protein: 38 },
    { meal_type: 'Snack', name: 'Protein Shake', description: 'Whey protein, banana, peanut butter, oat milk', calories: 350, protein: 28 },
  ]

  const today = todayISO()

  await supabase.from('habits').insert(
    defaultHabits.map((h, i) => ({ ...h, user_id: userId, sort_order: i }))
  )

  await supabase.from('workouts').insert(
    defaultWorkouts.map(w => ({ ...w, user_id: userId, date: today, completed: false }))
  )

  await supabase.from('meals').insert(
    defaultMeals.map(m => ({ ...m, user_id: userId, date: today }))
  )
}
