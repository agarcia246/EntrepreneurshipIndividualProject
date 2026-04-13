import { Dumbbell, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { PageHeader, SkeletonScreen } from "../components/shared";

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

  if (loading) return <SkeletonScreen cards={5} />;

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader title="Weekly Plan" subtitle="Your schedule for this week" />

      <div className="space-y-2.5 mb-6">
        {days.map((day, index) => (
          <motion.div
            key={day.dateISO}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04, duration: 0.35 }}
            className={`rounded-xl p-4 transition-all ${
              day.isToday
                ? "bg-primary/5 border-2 border-primary shadow-[var(--shadow-card-hover)]"
                : "bg-card border border-transparent shadow-[var(--shadow-card)]"
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  day.isToday
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {day.day}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold text-sm">{day.date}</span>
                    {day.isToday && (
                      <span className="text-[10px] font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pl-[52px]">
              <div className="flex items-center gap-1.5">
                <Dumbbell className={`w-3.5 h-3.5 ${day.workoutCount > 0 ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">{day.workoutTitle}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UtensilsCrossed className={`w-3.5 h-3.5 ${day.mealCount > 0 ? "text-accent" : "text-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">
                  {day.mealCount > 0 ? `${day.mealCount} meals` : "No meals"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
