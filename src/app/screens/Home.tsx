import { useNavigate } from "react-router";
import { Dumbbell, UtensilsCrossed, CheckCircle, Plus, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useWorkouts, useMeals, useHabits, useHabitLogs } from "@/lib/hooks";

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
        className="mb-8"
      >
        <h1 className="text-3xl text-foreground mb-1">Welcome back, {displayName}</h1>
        <p className="text-muted-foreground">Let's make today count</p>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary rounded-3xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm opacity-80">Daily consistency</span>
            <span className="text-2xl">{consistency}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${consistency}%` }} />
          </div>
          <p className="text-sm opacity-80 mt-3">
            {completedHabits} of {habits.length} habits complete
          </p>
        </motion.div>

        {todayWorkout ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-6 border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Today's Workout</span>
                </div>
                <h3 className="text-xl text-foreground">{todayWorkout.title}</h3>
              </div>
              <span className="text-muted-foreground text-sm">{todayWorkout.duration}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">{todayWorkout.muscle_group}</p>
            <button
              onClick={() => navigate("/app/workout")}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl"
            >
              View Workout
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-6 border border-border text-center"
          >
            <Dumbbell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm mb-3">No workouts planned for today</p>
            <button
              onClick={() => navigate("/app/workout")}
              className="text-primary text-sm"
            >
              Add a workout
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl p-6 border border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="w-5 h-5 text-accent" />
            <span className="text-foreground">Today's Meals</span>
          </div>
          {meals.length > 0 ? (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between">
                  <span className="text-foreground">{meal.name}</span>
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No meals logged yet today</p>
          )}
          <button
            onClick={() => navigate("/app/meals")}
            className="w-full mt-4 py-3 rounded-xl border-2 border-primary text-primary"
          >
            View Meal Plan
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-3xl p-6 border border-border"
        >
          <span className="text-foreground mb-4 block">Today's Habits</span>
          {habits.length > 0 ? (
            <div className="space-y-3">
              {habits.slice(0, 3).map((habit) => {
                const done = logs.some((l) => l.habit_id === habit.id && l.completed);
                return (
                  <div key={habit.id} className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-border rounded-full" />
                    )}
                    <span className={done ? "text-foreground" : "text-muted-foreground"}>
                      {habit.label}
                    </span>
                  </div>
                );
              })}
              {habits.length > 3 && (
                <p className="text-sm text-muted-foreground">+{habits.length - 3} more</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No habits set up yet</p>
          )}
          <button
            onClick={() => navigate("/app/track")}
            className="w-full mt-4 py-3 rounded-xl border-2 border-primary text-primary"
          >
            Update Habits
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => navigate("/app/plan")}
            className="bg-accent text-accent-foreground py-4 rounded-2xl"
          >
            View Weekly Plan
          </button>
          <button
            onClick={() => navigate("/app/progress")}
            className="bg-card border-2 border-border text-foreground py-4 rounded-2xl"
          >
            View Progress
          </button>
        </motion.div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowQuickAdd(!showQuickAdd)}
        className="fixed bottom-24 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-40 right-6 bg-card border border-border rounded-2xl p-4 shadow-xl space-y-2"
        >
          <button
            onClick={() => navigate("/app/workout")}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted text-foreground"
          >
            Log workout
          </button>
          <button
            onClick={() => navigate("/app/meals")}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted text-foreground"
          >
            Add meal
          </button>
          <button
            onClick={() => navigate("/app/track")}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted text-foreground"
          >
            Check habit
          </button>
        </motion.div>
      )}
    </div>
  );
}
