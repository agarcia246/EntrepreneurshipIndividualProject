import { Droplets, Moon, Beef, TrendingUp, Cookie, Dumbbell, Flame, CheckCircle, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHabits, useHabitLogs } from "@/lib/hooks";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import type { LucideIcon } from "lucide-react";
import {
  PageHeader,
  SkeletonScreen,
  GradientCard,
  AnimatedNumber,
  AnimatedProgress,
} from "../components/shared";

const iconMap: Record<string, LucideIcon> = {
  droplets: Droplets,
  moon: Moon,
  beef: Beef,
  "trending-up": TrendingUp,
  cookie: Cookie,
  dumbbell: Dumbbell,
  "check-circle": CheckCircle,
};

const iconColors: Record<string, string> = {
  droplets: "bg-blue-500/10 text-blue-500",
  moon: "bg-indigo-500/10 text-indigo-500",
  beef: "bg-red-500/10 text-red-500",
  "trending-up": "bg-green-500/10 text-green-500",
  cookie: "bg-amber-500/10 text-amber-500",
  dumbbell: "bg-purple-500/10 text-purple-500",
  "check-circle": "bg-primary/10 text-primary",
};

export function HabitTracker() {
  const { habits, loading: hLoading } = useHabits();
  const { logs, loading: lLoading, toggle } = useHabitLogs();
  const prevRateRef = useRef(0);

  const loading = hLoading || lLoading;
  const completedIds = new Set(logs.filter((l) => l.completed).map((l) => l.habit_id));
  const completionRate = habits.length > 0 ? Math.round((completedIds.size / habits.length) * 100) : 0;

  useEffect(() => {
    if (completionRate === 100 && prevRateRef.current < 100 && habits.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#16a34a", "#0ea5e9", "#f59e0b", "#ef4444"],
      });
      toast.success("All habits complete! You're on fire!", {
        icon: "🎉",
      });
    }
    prevRateRef.current = completionRate;
  }, [completionRate, habits.length]);

  const handleToggle = async (habitId: string, label: string) => {
    const wasCompleted = completedIds.has(habitId);
    await toggle(habitId);
    if (!wasCompleted) {
      toast.success(`${label} — done!`);
    }
  };

  if (loading) return <SkeletonScreen cards={5} />;

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader title="Habit Tracker" subtitle="Track your daily habits" />

      <GradientCard className="mb-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 opacity-80" />
            <span className="text-sm font-medium opacity-90">Today's completion</span>
          </div>
          <AnimatedNumber value={completionRate} suffix="%" className="text-2xl font-bold" />
        </div>
        <AnimatedProgress value={completionRate} />
        <p className="text-xs opacity-70 mt-2">
          {completedIds.size} of {habits.length} habits complete
        </p>
      </GradientCard>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">No habits set up yet. Complete onboarding to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {habits.map((habit, index) => {
            const isCompleted = completedIds.has(habit.id);
            const Icon = iconMap[habit.icon] || CheckCircle;
            const colorClass = iconColors[habit.icon] || "bg-primary/10 text-primary";

            return (
              <motion.button
                key={habit.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleToggle(habit.id, habit.label)}
                className={`w-full rounded-xl p-4 flex items-center gap-3 transition-all ${
                  isCompleted
                    ? "bg-primary/5 border-2 border-primary shadow-[var(--shadow-card)]"
                    : "bg-card border border-transparent shadow-[var(--shadow-card)]"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? "bg-primary text-white" : colorClass
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-medium text-foreground">{habit.label}</h3>
                  <span className="text-xs text-muted-foreground">
                    Target: {habit.target} {habit.unit}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="done"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="todo"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-7 h-7 rounded-full border-2 border-border flex-shrink-0"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
