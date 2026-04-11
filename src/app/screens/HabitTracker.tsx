import { Droplets, Moon, Beef, TrendingUp, Cookie, Dumbbell, Flame, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useHabits, useHabitLogs } from "@/lib/hooks";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  droplets: Droplets,
  moon: Moon,
  beef: Beef,
  "trending-up": TrendingUp,
  cookie: Cookie,
  dumbbell: Dumbbell,
  "check-circle": CheckCircle,
};

export function HabitTracker() {
  const { habits, loading: hLoading } = useHabits();
  const { logs, loading: lLoading, toggle } = useHabitLogs();

  const loading = hLoading || lLoading;
  const completedIds = new Set(logs.filter((l) => l.completed).map((l) => l.habit_id));
  const completionRate = habits.length > 0 ? Math.round((completedIds.size / habits.length) * 100) : 0;

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
        <h1 className="text-3xl text-foreground mb-1">Habit Tracker</h1>
        <p className="text-muted-foreground">Track your daily habits</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-3xl p-6 text-white mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm opacity-80">Today's completion</span>
          <span className="text-2xl">{completionRate}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-sm opacity-80 mt-3">
          {completedIds.size} of {habits.length} habits complete
        </p>
      </motion.div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No habits set up yet. Complete onboarding to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit, index) => {
            const isCompleted = completedIds.has(habit.id);
            const Icon = iconMap[habit.icon] || CheckCircle;

            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl p-5 border-2 transition-all ${
                  isCompleted
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-xl ${isCompleted ? "bg-primary" : "bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${isCompleted ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1">{habit.label}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Target: {habit.target} {habit.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          Keep going!
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(habit.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {isCompleted && <div className="w-3 h-3 bg-white rounded-full" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
