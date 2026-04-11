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

// ─── Detailed Stats (for rich Progress page) ───────────────

export interface DailySnapshot {
  date: string
  dayLabel: string
  habitsCompleted: number
  habitsTotal: number
  habitRate: number
  workoutsDone: number
  calories: number
  protein: number
  mealsLogged: number
}

export interface HabitBreakdown {
  id: string
  label: string
  icon: string
  completedDays: number
  totalDays: number
  rate: number
  currentStreak: number
}

export interface WeekComparison {
  week1HabitRate: number
  week2HabitRate: number
  week1Workouts: number
  week2Workouts: number
  week1AvgCalories: number
  week2AvgCalories: number
  week1AvgProtein: number
  week2AvgProtein: number
}

export interface DetailedStats {
  days: DailySnapshot[]
  habitBreakdowns: HabitBreakdown[]
  weekComparison: WeekComparison
  totals: {
    workoutsCompleted: number
    workoutsTotal: number
    mealsLogged: number
    habitsCompleted: number
    habitsTotal: number
    avgDailyCalories: number
    avgDailyProtein: number
    bestDay: DailySnapshot | null
    activeDayStreak: number
  }
  checkIns: WeeklyCheckIn[]
}

export function useDetailedStats(rangeDays = 14) {
  const { user } = useAuth()
  const [data, setData] = useState<DetailedStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - rangeDays + 1)
    const startISO = startDate.toISOString().split('T')[0]
    const endISO = today.toISOString().split('T')[0]

    const dateList: string[] = []
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      dateList.push(d.toISOString().split('T')[0])
    }

    Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).order('sort_order'),
      supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('date', startISO).lte('date', endISO),
      supabase.from('workouts').select('*').eq('user_id', user.id).gte('date', startISO).lte('date', endISO),
      supabase.from('meals').select('*').eq('user_id', user.id).gte('date', startISO).lte('date', endISO),
      supabase.from('weekly_check_ins').select('*').eq('user_id', user.id).order('week_start', { ascending: false }).limit(4),
    ]).then(([habitsRes, logsRes, workoutsRes, mealsRes, checkInsRes]) => {
      const habits = habitsRes.data ?? []
      const logs = logsRes.data ?? []
      const workouts = workoutsRes.data ?? []
      const meals = mealsRes.data ?? []
      const checkIns = checkInsRes.data ?? []
      const totalHabits = habits.length

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

      const days: DailySnapshot[] = dateList.map(date => {
        const dayLogs = logs.filter(l => l.date === date)
        const dayWorkouts = workouts.filter(w => w.date === date && w.completed)
        const dayMeals = meals.filter(m => m.date === date)
        const completed = dayLogs.filter(l => l.completed).length
        const d = new Date(date + 'T12:00:00')
        return {
          date,
          dayLabel: `${dayNames[d.getDay()]} ${d.getDate()}`,
          habitsCompleted: completed,
          habitsTotal: totalHabits,
          habitRate: totalHabits > 0 ? Math.round((completed / totalHabits) * 100) : 0,
          workoutsDone: dayWorkouts.length,
          calories: dayMeals.reduce((s, m) => s + (m.calories || 0), 0),
          protein: dayMeals.reduce((s, m) => s + (m.protein || 0), 0),
          mealsLogged: dayMeals.length,
        }
      })

      // Per-habit breakdown
      const habitBreakdowns: HabitBreakdown[] = habits.map(h => {
        const hLogs = logs.filter(l => l.habit_id === h.id)
        const completedDays = hLogs.filter(l => l.completed).length

        // Calculate current streak (consecutive completed days ending today or yesterday)
        let streak = 0
        for (let i = dateList.length - 1; i >= 0; i--) {
          const log = hLogs.find(l => l.date === dateList[i])
          if (log?.completed) streak++
          else break
        }

        return {
          id: h.id,
          label: h.label,
          icon: h.icon,
          completedDays,
          totalDays: dateList.length,
          rate: Math.round((completedDays / dateList.length) * 100),
          currentStreak: streak,
        }
      })

      // Week-over-week comparison
      const midpoint = Math.floor(dateList.length / 2)
      const week1Days = days.slice(0, midpoint)
      const week2Days = days.slice(midpoint)

      const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
      const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)

      const weekComparison: WeekComparison = {
        week1HabitRate: avg(week1Days.map(d => d.habitRate)),
        week2HabitRate: avg(week2Days.map(d => d.habitRate)),
        week1Workouts: sum(week1Days.map(d => d.workoutsDone)),
        week2Workouts: sum(week2Days.map(d => d.workoutsDone)),
        week1AvgCalories: avg(week1Days.filter(d => d.calories > 0).map(d => d.calories)),
        week2AvgCalories: avg(week2Days.filter(d => d.calories > 0).map(d => d.calories)),
        week1AvgProtein: avg(week1Days.filter(d => d.protein > 0).map(d => d.protein)),
        week2AvgProtein: avg(week2Days.filter(d => d.protein > 0).map(d => d.protein)),
      }

      const bestDay = [...days].sort((a, b) => b.habitRate - a.habitRate)[0] || null

      // Active day streak
      let activeDayStreak = 0
      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].habitsCompleted > 0 || days[i].workoutsDone > 0) activeDayStreak++
        else break
      }

      const totalWorkoutsCompleted = workouts.filter(w => w.completed).length
      const daysWithCalories = days.filter(d => d.calories > 0)

      setData({
        days,
        habitBreakdowns,
        weekComparison,
        totals: {
          workoutsCompleted: totalWorkoutsCompleted,
          workoutsTotal: workouts.length,
          mealsLogged: meals.length,
          habitsCompleted: logs.filter(l => l.completed).length,
          habitsTotal: logs.length,
          avgDailyCalories: avg(daysWithCalories.map(d => d.calories)),
          avgDailyProtein: avg(daysWithCalories.map(d => d.protein)),
          bestDay,
          activeDayStreak,
        },
        checkIns,
      })
      setLoading(false)
    })
  }, [user, rangeDays])

  return { data, loading }
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
