import { Dumbbell, UtensilsCrossed, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface DayPlan {
  day: string;
  date: string;
  dateISO: string;
  workoutCount: number;
  workoutTitle: string;
  mealCount: number;
  isToday: boolean;
}

export function WeeklyPlanner() {
  const { user } = useAuth();
  const [days, setDays] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

    const weekDays: DayPlan[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      weekDays.push({
        day: dayNames[d.getDay()],
        date: `${monthNames[d.getMonth()]} ${d.getDate()}`,
        dateISO: iso,
        workoutCount: 0,
        workoutTitle: "Rest",
        mealCount: 0,
        isToday: iso === now.toISOString().split("T")[0],
      });
    }

    const startISO = weekDays[0].dateISO;
    const endISO = weekDays[6].dateISO;

    const [workoutsRes, mealsRes] = await Promise.all([
      supabase.from("workouts").select("date, title").eq("user_id", user.id).gte("date", startISO).lte("date", endISO),
      supabase.from("meals").select("date").eq("user_id", user.id).gte("date", startISO).lte("date", endISO),
    ]);

    const workoutsByDate: Record<string, { count: number; title: string }> = {};
    for (const w of workoutsRes.data ?? []) {
      if (!workoutsByDate[w.date]) workoutsByDate[w.date] = { count: 0, title: w.title };
      workoutsByDate[w.date].count++;
    }

    const mealsByDate: Record<string, number> = {};
    for (const m of mealsRes.data ?? []) {
      mealsByDate[m.date] = (mealsByDate[m.date] || 0) + 1;
    }

    for (const day of weekDays) {
      const wb = workoutsByDate[day.dateISO];
      if (wb) {
        day.workoutCount = wb.count;
        day.workoutTitle = wb.title + (wb.count > 1 ? ` +${wb.count - 1}` : "");
      }
      day.mealCount = mealsByDate[day.dateISO] || 0;
    }

    setDays(weekDays);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch() }, [fetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-foreground mb-1">Weekly Plan</h1>
        <p className="text-muted-foreground">Your schedule for this week</p>
      </motion.div>

      <div className="space-y-3 mb-6">
        {days.map((day, index) => (
          <motion.div
            key={day.dateISO}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-2xl p-5 border-2 ${
              day.isToday
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground">{day.day}</h3>
                  {day.isToday && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{day.date}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{day.workoutTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-accent" />
                <span className="text-sm text-foreground">
                  {day.mealCount > 0 ? `${day.mealCount} meals planned` : "No meals planned"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
