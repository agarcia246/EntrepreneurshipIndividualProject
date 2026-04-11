import { useNavigate } from "react-router";
import { Activity, Calendar, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";

export function OnboardingWelcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col items-center justify-center gap-8"
      >
        <div className="flex gap-4">
          <div className="bg-primary/10 rounded-2xl p-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div className="bg-accent/10 rounded-2xl p-4">
            <UtensilsCrossed className="w-8 h-8 text-accent" />
          </div>
          <div className="bg-primary/10 rounded-2xl p-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-3xl text-foreground">Welcome to FuelFit</h1>
          <p className="text-muted-foreground text-lg">
            Your simple planner for workouts, healthy meals, and building better habits—designed for busy students.
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate("/onboarding/goals")}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl"
      >
        Get Started
      </motion.button>
    </div>
  );
}
