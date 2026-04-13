import {
  TrendingUp, TrendingDown, Dumbbell, UtensilsCrossed, CheckCircle,
  Flame, Droplets, Moon, Beef, Cookie, ArrowRight,
  Trophy, Calendar, Target, Minus,
} from "lucide-react";
import { motion } from "motion/react";
import { useDetailedStats, useWeeklyCheckIn } from "@/lib/hooks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area,
} from "recharts";
import {
  PageHeader,
  SkeletonScreen,
  GradientCard,
  Card,
  AnimatedNumber,
  StatPill,
  PrimaryButton,
} from "../components/shared";

const iconMap: Record<string, LucideIcon> = {
  droplets: Droplets, moon: Moon, beef: Beef,
  "trending-up": TrendingUp, cookie: Cookie, dumbbell: Dumbbell,
  "check-circle": CheckCircle,
};

function TrendBadge({ current, previous, unit = "%" }: { current: number; previous: number; unit?: string }) {
  const diff = current - previous;
  if (diff === 0) return (
    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 bg-muted px-2 py-0.5 rounded-full">
      <Minus className="w-3 h-3" /> Same
    </span>
  );
  const positive = diff > 0;
  return (
    <span className={`text-[10px] flex items-center gap-0.5 px-2 py-0.5 rounded-full font-medium ${
      positive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
    }`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? "+" : ""}{diff}{unit}
    </span>
  );
}

function MiniBar({ value, max, active = true }: { value: number; max: number; active?: boolean }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`h-full rounded-full ${active ? "bg-primary" : "bg-muted-foreground/30"}`}
      />
    </div>
  );
}

const chartTooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    boxShadow: "var(--shadow-elevated)",
    fontSize: "12px",
    padding: "8px 12px",
  },
  cursor: { fill: "rgba(0,0,0,0.03)" },
};

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
    toast.success("Reflection saved!");
  };

  if (loading || !data) return <SkeletonScreen cards={5} />;

  const { days, habitBreakdowns, weekComparison, totals } = data;

  const habitChartData = days.map(d => ({
    name: d.dayLabel.split(" ")[0],
    rate: d.habitRate,
  }));

  const nutritionChartData = days.map(d => ({
    name: d.dayLabel.split(" ")[0],
    calories: d.calories,
    protein: d.protein,
  }));

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader title="Progress" subtitle="Last 14 days at a glance" />

      <GradientCard gradient="var(--gradient-hero)" className="mb-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <StatPill icon={Flame} value={totals.activeDayStreak} label="day streak" />
          <StatPill icon={Dumbbell} value={totals.workoutsCompleted} label="workouts" />
          <StatPill icon={Target} value={totals.habitsCompleted} label="habits hit" />
        </div>
      </GradientCard>

      <Card delay={0.05} className="mb-3">
        <h3 className="text-sm font-semibold text-foreground mb-0.5 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Daily Habit Completion
        </h3>
        <p className="text-xs text-muted-foreground mb-3">% of habits completed each day</p>
        <div className="h-36 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={habitChartData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number) => [`${value}%`, "Completion"]}
              />
              <Bar
                dataKey="rate"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card delay={0.1} className="mb-3">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Week-over-Week
        </h3>
        <div className="space-y-3.5">
          {[
            { label: "Habit completion", c: weekComparison.week2HabitRate, p: weekComparison.week1HabitRate, max: 100, unit: "%" },
            { label: "Workouts", c: weekComparison.week2Workouts, p: weekComparison.week1Workouts, max: 7, unit: "" },
            { label: "Avg daily calories", c: weekComparison.week2AvgCalories, p: weekComparison.week1AvgCalories, max: 3000, unit: " cal" },
            { label: "Avg daily protein", c: weekComparison.week2AvgProtein, p: weekComparison.week1AvgProtein, max: 200, unit: "g" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-foreground">{item.label}</span>
                <TrendBadge current={item.c} previous={item.p} unit={item.unit} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Prev week</span>
                    <span>{item.p.toLocaleString()}{item.unit}</span>
                  </div>
                  <MiniBar value={item.p} max={item.max} active={false} />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>This week</span>
                    <span className="font-semibold text-foreground">{item.c.toLocaleString()}{item.unit}</span>
                  </div>
                  <MiniBar value={item.c} max={item.max} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card delay={0.15} className="mb-3">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Habit Breakdown
        </h3>
        <div className="space-y-3">
          {habitBreakdowns.map((h) => {
            const Icon = iconMap[h.icon] || CheckCircle;
            return (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground">{h.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {h.currentStreak > 0 && (
                      <span className="text-[10px] text-orange-500 flex items-center gap-0.5 font-medium">
                        <Flame className="w-3 h-3" />{h.currentStreak}d
                      </span>
                    )}
                    <span className="text-xs font-semibold text-foreground">{h.rate}%</span>
                  </div>
                </div>
                <MiniBar value={h.completedDays} max={h.totalDays} />
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {h.completedDays} of {h.totalDays} days
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card delay={0.2} className="mb-3">
        <h3 className="text-sm font-semibold text-foreground mb-0.5 flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-accent" />
          Nutrition Trend
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span>Avg {totals.avgDailyCalories.toLocaleString()} cal/day</span>
          <span className="text-border">|</span>
          <span>Avg {totals.avgDailyProtein}g protein/day</span>
        </div>
        <div className="h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={nutritionChartData}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                {...chartTooltipStyle}
                formatter={(value: number, name: string) => [
                  name === "calories" ? `${value} cal` : `${value}g`,
                  name === "calories" ? "Calories" : "Protein",
                ]}
              />
              <Area
                type="monotone"
                dataKey="calories"
                stroke="var(--accent)"
                fill="url(#calGrad)"
                strokeWidth={2}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 gap-3 mb-3"
      >
        <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-1.5 mb-2">
            <Dumbbell className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground font-medium">Workouts</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            <AnimatedNumber value={totals.workoutsCompleted} />
            <span className="text-sm font-normal text-muted-foreground">/{totals.workoutsTotal}</span>
          </p>
          <p className="text-[10px] text-muted-foreground">completed</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-1.5 mb-2">
            <UtensilsCrossed className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] text-muted-foreground font-medium">Meals Logged</span>
          </div>
          <p className="text-xl font-bold text-foreground">
            <AnimatedNumber value={totals.mealsLogged} />
          </p>
          <p className="text-[10px] text-muted-foreground">in 14 days</p>
        </div>
      </motion.div>

      {totals.bestDay && totals.bestDay.habitRate > 0 && (
        <Card delay={0.3} className="mb-3 border-2 border-amber-400/20 bg-amber-50/50">
          <div className="flex items-center gap-2 mb-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-foreground">Best Day</span>
          </div>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">{totals.bestDay.dayLabel}</strong> — {totals.bestDay.habitRate}% habits, {totals.bestDay.workoutsDone} workout{totals.bestDay.workoutsDone !== 1 ? "s" : ""}, {totals.bestDay.calories.toLocaleString()} cal
          </p>
        </Card>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate("/app/feedback")}
        className="w-full bg-card rounded-xl p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] mb-3 flex items-center justify-between transition-shadow"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">Weekly Check-In</p>
            <p className="text-[10px] text-muted-foreground">{checkIn ? "Update your reflection" : "Reflect on this week"}</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </motion.button>

      <Card delay={0.4} className="bg-accent/5 border border-accent/10">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weekly Reflection</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">What went well this week?</label>
            <textarea
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="Share your wins..."
              className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm resize-none h-20 shadow-[var(--shadow-card)]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">What was difficult?</label>
            <textarea
              value={wasDifficult}
              onChange={(e) => setWasDifficult(e.target.value)}
              placeholder="What challenges did you face?"
              className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm resize-none h-20 shadow-[var(--shadow-card)]"
            />
          </div>
        </div>
        <div className="mt-3">
          <PrimaryButton
            onClick={handleSaveReflection}
            loading={saving}
            variant="solid"
          >
            Save Reflection
          </PrimaryButton>
        </div>
      </Card>
    </div>
  );
}
