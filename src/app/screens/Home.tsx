import { useNavigate } from "react-router";
import { Dumbbell, UtensilsCrossed, CheckCircle, Plus, Flame, Target, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useWorkouts, useMeals, useHabits, useHabitLogs } from "@/lib/hooks";
import {
  GradientCard,
  Card,
  AnimatedNumber,
  AnimatedProgress,
  SkeletonScreen,
  PrimaryButton,
} from "../components/shared";

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workouts, loading: wLoading } = useWorkouts();
  const { meals, loading: mLoading } = useMeals();
  const { habits, loading: hLoading } = useHabits();
  const { logs } = useHabitLogs();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const loading = wLoading || mLoading || hLoading;
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "there";
  const completedHabits = logs.filter((l) => l.completed).length;
  const totalHabits = habits.length || 1;
  const consistency = Math.round((completedHabits / totalHabits) * 100);
  const todayWorkout = workouts[0];
  const totalCalories = meals.reduce((s, m) => s + (m.calories || 0), 0);

  if (loading) return <SkeletonScreen cards={4} />;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-sm text-muted-foreground mb-0.5">{greeting}</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{displayName}</h1>
      </motion.div>

      <div className="space-y-3.5">
        <GradientCard delay={0.05}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 opacity-80" />
              <span className="text-sm font-medium opacity-90">Today's Progress</span>
            </div>
            <AnimatedNumber
              value={consistency}
              suffix="%"
              className="text-2xl font-bold"
            />
          </div>
          <AnimatedProgress value={consistency} />
          <p className="text-xs opacity-70 mt-2.5">
            {completedHabits} of {habits.length} habits complete
          </p>
        </GradientCard>

        {todayWorkout ? (
          <Card delay={0.1} onClick={() => navigate("/app/workout")}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-medium">Today's Workout</span>
                  <h3 className="text-foreground font-semibold">{todayWorkout.title}</h3>
                </div>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {todayWorkout.duration}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{todayWorkout.muscle_group}</p>
            <PrimaryButton onClick={() => navigate("/app/workout")} className="text-sm">
              Start Workout
            </PrimaryButton>
          </Card>
        ) : (
          <Card delay={0.1}>
            <div className="flex flex-col items-center py-3">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Dumbbell className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">No workouts planned for today</p>
              <button onClick={() => navigate("/app/workout")} className="text-primary text-sm font-semibold">
                Add a workout
              </button>
            </div>
          </Card>
        )}

        <Card delay={0.15}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium">Nutrition</span>
                <h3 className="text-foreground font-semibold">{meals.length} meals logged</h3>
              </div>
            </div>
            {totalCalories > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" />
                <AnimatedNumber value={totalCalories} className="font-semibold text-foreground" /> cal
              </div>
            )}
          </div>
          {meals.length > 0 ? (
            <div className="space-y-2 mb-3">
              {meals.slice(0, 3).map((meal) => (
                <div key={meal.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{meal.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{meal.calories} cal</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">No meals logged yet today</p>
          )}
          <PrimaryButton variant="outline" onClick={() => navigate("/app/meals")} className="text-sm">
            View Meal Plan
          </PrimaryButton>
        </Card>

        <Card delay={0.2}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium">Today's Habits</span>
                <h3 className="text-foreground font-semibold">
                  {completedHabits}/{habits.length} done
                </h3>
              </div>
            </div>
          </div>
          {habits.length > 0 ? (
            <div className="space-y-2 mb-3">
              {habits.slice(0, 3).map((habit) => {
                const done = logs.some((l) => l.habit_id === habit.id && l.completed);
                return (
                  <div key={habit.id} className="flex items-center gap-2.5 py-1">
                    {done ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-border rounded-full" />
                    )}
                    <span className={`text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                      {habit.label}
                    </span>
                  </div>
                );
              })}
              {habits.length > 3 && (
                <p className="text-xs text-muted-foreground pl-7">+{habits.length - 3} more</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">No habits set up yet</p>
          )}
          <PrimaryButton variant="outline" onClick={() => navigate("/app/track")} className="text-sm">
            Update Habits
          </PrimaryButton>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/app/plan")}
            className="bg-card rounded-xl py-4 px-3 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-accent)" }}
          >
            <span className="text-white text-sm font-semibold">Weekly Plan</span>
            <ArrowRight className="w-4 h-4 text-white/80" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/app/progress")}
            className="bg-card rounded-xl py-4 px-3 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow flex items-center justify-center gap-2 border border-border"
          >
            <span className="text-foreground text-sm font-semibold">Progress</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQuickAdd(!showQuickAdd)}
        className="fixed bottom-28 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-[var(--shadow-elevated)] z-40"
        style={{ background: "var(--gradient-primary)" }}
      >
        <motion.div animate={{ rotate: showQuickAdd ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showQuickAdd && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setShowQuickAdd(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="fixed bottom-44 right-5 bg-card rounded-xl p-2 shadow-[var(--shadow-elevated)] z-40 w-48"
            >
              {[
                { label: "Log workout", path: "/app/workout", icon: Dumbbell },
                { label: "Add meal", path: "/app/meals", icon: UtensilsCrossed },
                { label: "Check habit", path: "/app/track", icon: CheckCircle },
              ].map((item, i) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { navigate(item.path); setShowQuickAdd(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted text-foreground text-sm flex items-center gap-2.5 transition-colors"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
