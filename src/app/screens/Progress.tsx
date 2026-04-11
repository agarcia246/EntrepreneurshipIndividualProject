import { TrendingUp, Dumbbell, UtensilsCrossed, CheckCircle, Flame, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useStats, useWeeklyCheckIn } from "@/lib/hooks";
import { useState } from "react";

export function Progress() {
  const { stats, loading } = useStats();
  const { checkIn, save } = useWeeklyCheckIn();
  const [wentWell, setWentWell] = useState(checkIn?.went_well || "");
  const [wasDifficult, setWasDifficult] = useState(checkIn?.was_difficult || "");
  const [saving, setSaving] = useState(false);

  const handleSaveReflection = async () => {
    setSaving(true);
    await save({
      rating: checkIn?.rating || 0,
      consistency: checkIn?.consistency || 3,
      challenges: checkIn?.challenges || "",
      focus_areas: checkIn?.focus_areas || [],
      went_well: wentWell,
      was_difficult: wasDifficult,
    });
    setSaving(false);
  };

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
        <h1 className="text-3xl text-foreground mb-1">Progress</h1>
        <p className="text-muted-foreground">Your fitness journey so far</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-3xl p-6 text-white mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80 mb-1">Workouts completed</p>
            <div className="flex items-center gap-2">
              <Flame className="w-8 h-8" />
              <span className="text-4xl">{stats.workoutsCompleted}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">total</p>
            <p className="text-sm opacity-80 mt-1">Keep it going!</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Workouts</span>
          </div>
          <p className="text-3xl text-foreground mb-1">{stats.workoutsCompleted}</p>
          <p className="text-sm text-muted-foreground">of {stats.workoutsTotal} total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center gap-2 mb-3">
            <UtensilsCrossed className="w-5 h-5 text-accent" />
            <span className="text-sm text-muted-foreground">Meals</span>
          </div>
          <p className="text-3xl text-foreground mb-1">{stats.mealsLogged}</p>
          <p className="text-sm text-muted-foreground">meals logged</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 border border-border col-span-2"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Habits</span>
          </div>
          <p className="text-3xl text-foreground mb-1">{stats.habitsCompleted}</p>
          <p className="text-sm text-muted-foreground">of {stats.habitsTotal} completed</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-accent/10 rounded-3xl p-6 border border-accent/20"
      >
        <h3 className="text-foreground mb-3">Weekly reflection</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              What went well this week?
            </label>
            <textarea
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="Share your wins..."
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground resize-none h-24"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              What was difficult?
            </label>
            <textarea
              value={wasDifficult}
              onChange={(e) => setWasDifficult(e.target.value)}
              placeholder="What challenges did you face?"
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground resize-none h-24"
            />
          </div>
        </div>
        <button
          onClick={handleSaveReflection}
          disabled={saving}
          className="w-full mt-4 bg-accent text-accent-foreground py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Reflection
        </button>
      </motion.div>
    </div>
  );
}
