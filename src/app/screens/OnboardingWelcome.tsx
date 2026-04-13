import { useNavigate } from "react-router";
import { Activity, Calendar, UtensilsCrossed, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { OnboardingProgress, PrimaryButton } from "../components/shared";

const features = [
  { icon: Activity, label: "Smart Workouts", color: "bg-green-500/10 text-green-600" },
  { icon: UtensilsCrossed, label: "Meal Planning", color: "bg-sky-500/10 text-sky-600" },
  { icon: Calendar, label: "Weekly Plans", color: "bg-amber-500/10 text-amber-600" },
];

export function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-12 pb-8">
      <OnboardingProgress step={1} total={4} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center gap-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <div className="text-center space-y-3 max-w-sm">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome to FuelFit
          </h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Your simple planner for workouts, healthy meals, and building better habits — designed for busy students.
          </p>
        </div>

        <div className="flex gap-3 w-full max-w-xs">
          {features.map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-card shadow-[var(--shadow-card)]"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feat.color}`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight">
                {feat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <PrimaryButton onClick={() => navigate("/onboarding/goals")}>
          Get Started
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
