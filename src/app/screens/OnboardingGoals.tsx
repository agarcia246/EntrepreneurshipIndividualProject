import { useNavigate } from "react-router";
import { useState } from "react";
import { Target, Dumbbell, Salad, Flame, RotateCcw, Check } from "lucide-react";
import { motion } from "motion/react";
import { OnboardingProgress, PrimaryButton } from "../components/shared";
import type { LucideIcon } from "lucide-react";

const goals: { id: string; label: string; icon: LucideIcon; color: string }[] = [
  { id: "muscle", label: "Build muscle", icon: Dumbbell, color: "bg-blue-500/10 text-blue-600" },
  { id: "consistent", label: "Stay consistent", icon: Target, color: "bg-green-500/10 text-green-600" },
  { id: "healthier", label: "Eat healthier", icon: Salad, color: "bg-emerald-500/10 text-emerald-600" },
  { id: "fat", label: "Lose fat", icon: Flame, color: "bg-orange-500/10 text-orange-600" },
  { id: "routine", label: "Improve routine", icon: RotateCcw, color: "bg-purple-500/10 text-purple-600" },
];

export function OnboardingGoals() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem("onboarding_goals") || "[]"); }
    catch { return []; }
  });

  const toggleGoal = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    sessionStorage.setItem("onboarding_goals", JSON.stringify(selected));
    navigate("/onboarding/preferences");
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-12 pb-8">
      <OnboardingProgress step={2} total={4} />

      <div className="flex-1 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">
            What are your goals?
          </h1>
          <p className="text-muted-foreground text-sm">Select all that apply</p>
        </motion.div>

        <div className="space-y-2.5">
          {goals.map((goal, index) => {
            const isSelected = selected.includes(goal.id);
            const Icon = goal.icon;
            return (
              <motion.button
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleGoal(goal.id)}
                className={`w-full p-4 rounded-xl flex items-center gap-3.5 transition-all duration-200 ${
                  isSelected
                    ? "bg-primary/5 border-2 border-primary shadow-[var(--shadow-card)]"
                    : "bg-card border-2 border-transparent shadow-[var(--shadow-card)]"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-primary text-white" : goal.color
                } transition-all duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">{goal.label}</span>
                <motion.div
                  initial={false}
                  animate={{
                    scale: isSelected ? 1 : 0,
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <PrimaryButton
          onClick={handleContinue}
          disabled={selected.length === 0}
        >
          Continue
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
