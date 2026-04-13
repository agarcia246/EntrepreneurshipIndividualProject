import { useNavigate } from "react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { OnboardingProgress, PrimaryButton } from "../components/shared";

export function OnboardingPreferences() {
  const navigate = useNavigate();

  const stored = (() => {
    try { return JSON.parse(sessionStorage.getItem("onboarding_prefs") || "{}"); }
    catch { return {}; }
  })();

  const [workoutDays, setWorkoutDays] = useState(stored.workoutDays || "3-4");
  const [dietStyle, setDietStyle] = useState(stored.dietStyle || "balanced");
  const [cookingTime, setCookingTime] = useState(stored.cookingTime || "30min");
  const [notifications, setNotifications] = useState(stored.notifications !== false);

  const handleContinue = () => {
    sessionStorage.setItem("onboarding_prefs", JSON.stringify({
      workoutDays, dietStyle, cookingTime, notifications,
    }));
    navigate("/signup");
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-12 pb-8">
      <OnboardingProgress step={3} total={4} />

      <div className="flex-1 space-y-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">
            Your preferences
          </h1>
          <p className="text-muted-foreground text-sm">Help us personalize your plan</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)]"
          >
            <label className="block text-foreground text-sm font-semibold mb-2.5">
              Workout days per week
            </label>
            <select
              value={workoutDays}
              onChange={(e) => setWorkoutDays(e.target.value)}
              className="w-full p-3.5 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="2-3">2-3 days</option>
              <option value="3-4">3-4 days</option>
              <option value="4-5">4-5 days</option>
              <option value="5-6">5-6 days</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)]"
          >
            <label className="block text-foreground text-sm font-semibold mb-2.5">
              Diet style
            </label>
            <select
              value={dietStyle}
              onChange={(e) => setDietStyle(e.target.value)}
              className="w-full p-3.5 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="balanced">Balanced</option>
              <option value="high-protein">High protein</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)]"
          >
            <label className="block text-foreground text-sm font-semibold mb-2.5">
              Time available for cooking
            </label>
            <select
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full p-3.5 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="15min">15 minutes or less</option>
              <option value="30min">30 minutes</option>
              <option value="45min">45 minutes</option>
              <option value="60min">1 hour+</option>
            </select>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] flex items-center justify-between"
          >
            <span className="text-foreground text-sm font-semibold">Enable notifications</span>
            <motion.button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full transition-colors duration-200 p-0.5 ${
                notifications ? "bg-primary" : "bg-muted"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-sm"
                animate={{ x: notifications ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <PrimaryButton onClick={handleContinue}>
          Create My Plan
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
