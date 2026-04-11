import { useNavigate } from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

const goals = [
  { id: "muscle", label: "Build muscle" },
  { id: "consistent", label: "Stay consistent" },
  { id: "healthier", label: "Eat healthier" },
  { id: "fat", label: "Lose fat" },
  { id: "routine", label: "Improve routine" },
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
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-8 pb-8">
      <button
        onClick={() => navigate("/onboarding/welcome")}
        className="self-start mb-8"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-2xl text-foreground mb-2">What are your goals?</h1>
          <p className="text-muted-foreground">Select all that apply</p>
        </div>

        <div className="space-y-3">
          {goals.map((goal, index) => (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full p-5 rounded-2xl border-2 transition-all ${
                selected.includes(goal.id)
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <span className="text-foreground text-lg">{goal.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}
