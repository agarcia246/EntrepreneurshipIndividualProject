import {
  TrendingUp, TrendingDown, Dumbbell, UtensilsCrossed, CheckCircle,
  Flame, Loader2, Droplets, Moon, Beef, Cookie, ArrowRight,
  Trophy, Calendar, Target, Minus,
} from "lucide-react";
import { motion } from "motion/react";
import { useDetailedStats, useWeeklyCheckIn } from "@/lib/hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  droplets: Droplets, moon: Moon, beef: Beef,
  "trending-up": TrendingUp, cookie: Cookie, dumbbell: Dumbbell,
  "check-circle": CheckCircle,
};

function TrendBadge({ current, previous, unit = "%" }: { current: number; previous: number; unit?: string }) {
  const diff = current - previous;
  if (diff === 0) return (
    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
      <Minus className="w-3 h-3" /> No change
    </span>
  );
  const positive = diff > 0;
  return (
    <span className={`text-xs flex items-center gap-0.5 ${positive ? "text-primary" : "text-destructive"}`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? "+" : ""}{diff}{unit} vs last week
    </span>
  );
}

function MiniBar({ value, max, color = "bg-primary" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Progress() {
  const navigate = useNavigate();
  const { data, loading } = useDetailedStats(14);
  const { checkIn, save } = useWeeklyCheckIn();
  const [wentWell, setWentWell] = useState("");
  const [wasDifficult, setWasDifficult] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (checkIn) {
      setWentWell(checkIn.went_well || "");
      setWasDifficult(checkIn.was_difficult || "");
    }
  }, [checkIn]);

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

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const { days, habitBreakdowns, weekComparison, totals } = data;
  const maxCalories = Math.max(...days.map((d) => d.calories), 1);

  return (
    <div className="min-h-screen bg-background px-6 pt-8 pb-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl text-foreground mb-1">Progress</h1>
        <p className="text-muted-foreground">Last 14 days at a glance</p>
      </motion.div>

      {/* ── Hero Stats Row ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-3xl p-6 text-white mb-6"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Flame className="w-6 h-6 mx-auto mb-1 opacity-80" />
            <p className="text-3xl">{totals.activeDayStreak}</p>
            <p className="text-xs opacity-70">day streak</p>
          </div>
          <div>
            <Dumbbell className="w-6 h-6 mx-auto mb-1 opacity-80" />
            <p className="text-3xl">{totals.workoutsCompleted}</p>
            <p className="text-xs opacity-70">workouts</p>
          </div>
          <div>
            <Target className="w-6 h-6 mx-auto mb-1 opacity-80" />
            <p className="text-3xl">{totals.habitsCompleted}</p>
            <p className="text-xs opacity-70">habits hit</p>
          </div>
        </div>
      </motion.div>

      {/* ── Daily Habit Completion Chart ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card rounded-3xl p-6 border border-border mb-4"
      >
        <h3 className="text-foreground mb-1 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Daily Habit Completion
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Percentage of habits completed each day</p>
        <div className="flex items-end gap-[3px] h-28">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
              <span className="text-[9px] text-muted-foreground">{day.habitRate > 0 ? `${day.habitRate}` : ""}</span>
              <div className="w-full bg-muted rounded-t-sm relative" style={{ height: "100%" }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-sm transition-all ${
                    day.habitRate === 100 ? "bg-primary" : day.habitRate >= 67 ? "bg-primary/70" : day.habitRate > 0 ? "bg-primary/40" : "bg-muted"
                  }`}
                  style={{ height: `${day.habitRate}%` }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground leading-none">{day.dayLabel.split(" ")[0]}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary inline-block" /> 100%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary/70 inline-block" /> 67-99%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-primary/40 inline-block" /> 1-66%</span>
        </div>
      </motion.div>

      {/* ── Week-over-Week Comparison ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl p-6 border border-border mb-4"
      >
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Week-over-Week
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Habit completion</span>
              <TrendBadge current={weekComparison.week2HabitRate} previous={weekComparison.week1HabitRate} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 1</span><span>{weekComparison.week1HabitRate}%</span>
                </div>
                <MiniBar value={weekComparison.week1HabitRate} max={100} color="bg-muted-foreground/40" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 2</span><span>{weekComparison.week2HabitRate}%</span>
                </div>
                <MiniBar value={weekComparison.week2HabitRate} max={100} />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Workouts</span>
              <TrendBadge current={weekComparison.week2Workouts} previous={weekComparison.week1Workouts} unit="" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 1</span><span>{weekComparison.week1Workouts}</span>
                </div>
                <MiniBar value={weekComparison.week1Workouts} max={7} color="bg-muted-foreground/40" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 2</span><span>{weekComparison.week2Workouts}</span>
                </div>
                <MiniBar value={weekComparison.week2Workouts} max={7} />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Avg daily calories</span>
              <TrendBadge current={weekComparison.week2AvgCalories} previous={weekComparison.week1AvgCalories} unit=" cal" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 1</span><span>{weekComparison.week1AvgCalories.toLocaleString()}</span>
                </div>
                <MiniBar value={weekComparison.week1AvgCalories} max={3000} color="bg-muted-foreground/40" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 2</span><span>{weekComparison.week2AvgCalories.toLocaleString()}</span>
                </div>
                <MiniBar value={weekComparison.week2AvgCalories} max={3000} />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">Avg daily protein</span>
              <TrendBadge current={weekComparison.week2AvgProtein} previous={weekComparison.week1AvgProtein} unit="g" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 1</span><span>{weekComparison.week1AvgProtein}g</span>
                </div>
                <MiniBar value={weekComparison.week1AvgProtein} max={200} color="bg-muted-foreground/40" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Week 2</span><span>{weekComparison.week2AvgProtein}g</span>
                </div>
                <MiniBar value={weekComparison.week2AvgProtein} max={200} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Per-Habit Breakdown ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-3xl p-6 border border-border mb-4"
      >
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Habit Breakdown
        </h3>
        <div className="space-y-4">
          {habitBreakdowns.map((h) => {
            const Icon = iconMap[h.icon] || CheckCircle;
            return (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{h.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {h.currentStreak > 0 && (
                      <span className="text-xs text-orange-500 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />{h.currentStreak}d
                      </span>
                    )}
                    <span className="text-sm text-foreground">{h.rate}%</span>
                  </div>
                </div>
                <MiniBar value={h.completedDays} max={h.totalDays} />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {h.completedDays} of {h.totalDays} days
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Calorie & Protein Trend ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl p-6 border border-border mb-4"
      >
        <h3 className="text-foreground mb-1 flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-accent" />
          Nutrition Trend
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span>Avg {totals.avgDailyCalories.toLocaleString()} cal/day</span>
          <span>·</span>
          <span>Avg {totals.avgDailyProtein}g protein/day</span>
        </div>
        <div className="flex items-end gap-[3px] h-24">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col items-center flex-1 gap-1">
              <div className="w-full bg-muted rounded-t-sm relative" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 w-full bg-accent rounded-t-sm transition-all"
                  style={{ height: `${maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[9px] text-muted-foreground leading-none">{day.dayLabel.split(" ")[0]}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Daily calorie intake — taller = more calories</p>
      </motion.div>

      {/* ── Summary Cards ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="grid grid-cols-2 gap-3 mb-4"
      >
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Workouts</span>
          </div>
          <p className="text-2xl text-foreground">{totals.workoutsCompleted}<span className="text-sm text-muted-foreground">/{totals.workoutsTotal}</span></p>
          <p className="text-xs text-muted-foreground">completed</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Meals Logged</span>
          </div>
          <p className="text-2xl text-foreground">{totals.mealsLogged}</p>
          <p className="text-xs text-muted-foreground">in 14 days</p>
        </div>
      </motion.div>

      {/* ── Best Day ────────────────────────────────────────── */}
      {totals.bestDay && totals.bestDay.habitRate > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-primary/5 rounded-2xl p-5 border-2 border-primary/20 mb-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-foreground">Best Day</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">{totals.bestDay.dayLabel}</strong> — {totals.bestDay.habitRate}% habits, {totals.bestDay.workoutsDone} workout{totals.bestDay.workoutsDone !== 1 ? "s" : ""}, {totals.bestDay.calories.toLocaleString()} cal
          </p>
        </motion.div>
      )}

      {/* ── Weekly Check-In CTA ─────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        onClick={() => navigate("/app/feedback")}
        className="w-full bg-card rounded-2xl p-5 border border-border mb-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <p className="text-foreground">Weekly Check-In</p>
            <p className="text-xs text-muted-foreground">{checkIn ? "Update your reflection" : "Reflect on this week"}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground" />
      </motion.button>

      {/* ── Weekly Reflection ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-accent/10 rounded-3xl p-6 border border-accent/20"
      >
        <h3 className="text-foreground mb-3">Weekly Reflection</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">What went well this week?</label>
            <textarea
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="Share your wins..."
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground resize-none h-24"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">What was difficult?</label>
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
