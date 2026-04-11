export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          goals: string[]
          workout_days: string
          diet_style: string
          cooking_time: string
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string
          goals?: string[]
          workout_days?: string
          diet_style?: string
          cooking_time?: string
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          goals?: string[]
          workout_days?: string
          diet_style?: string
          cooking_time?: string
          notifications_enabled?: boolean
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          label: string
          icon: string
          target: number
          unit: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          icon?: string
          target?: number
          unit?: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          label?: string
          icon?: string
          target?: number
          unit?: string
          sort_order?: number
        }
      }
      habit_logs: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          date: string
          completed: boolean
          value: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: string
          date: string
          completed?: boolean
          value?: number | null
          created_at?: string
        }
        Update: {
          completed?: boolean
          value?: number | null
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          title: string
          muscle_group: string
          duration: string
          exercises: Json
          date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          muscle_group?: string
          duration?: string
          exercises?: Json
          date?: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          muscle_group?: string
          duration?: string
          exercises?: Json
          date?: string
          completed?: boolean
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          meal_type: string
          name: string
          description: string
          calories: number
          protein: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: string
          name: string
          description?: string
          calories?: number
          protein?: number
          date?: string
          created_at?: string
        }
        Update: {
          meal_type?: string
          name?: string
          description?: string
          calories?: number
          protein?: number
          date?: string
        }
      }
      weekly_check_ins: {
        Row: {
          id: string
          user_id: string
          week_start: string
          rating: number
          consistency: number
          challenges: string
          focus_areas: string[]
          went_well: string
          was_difficult: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start: string
          rating?: number
          consistency?: number
          challenges?: string
          focus_areas?: string[]
          went_well?: string
          was_difficult?: string
          created_at?: string
        }
        Update: {
          rating?: number
          consistency?: number
          challenges?: string
          focus_areas?: string[]
          went_well?: string
          was_difficult?: string
        }
      }
    }
  }
}
