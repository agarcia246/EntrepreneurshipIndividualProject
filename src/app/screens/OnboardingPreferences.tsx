import { useNavigate } from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

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
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-8 pb-8">
      <button
        onClick={() => navigate("/onboarding/goals")}
        className="self-start mb-8"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="flex-1 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl text-foreground mb-2">Your preferences</h1>
          <p className="text-muted-foreground">Help us personalize your plan</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-foreground mb-3">Workout days per week</label>
            <select
              value={workoutDays}
              onChange={(e) => setWorkoutDays(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground"
            >
              <option value="2-3">2-3 days</option>
              <option value="3-4">3-4 days</option>
              <option value="4-5">4-5 days</option>
              <option value="5-6">5-6 days</option>
            </select>
          </div>

          <div>
            <label className="block text-foreground mb-3">Diet style</label>
            <select
              value={dietStyle}
              onChange={(e) => setDietStyle(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground"
            >
              <option value="balanced">Balanced</option>
              <option value="high-protein">High protein</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-foreground mb-3">Time available for cooking</label>
            <select
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full p-4 rounded-xl border border-border bg-card text-foreground"
            >
              <option value="15min">15 minutes or less</option>
              <option value="30min">30 minutes</option>
              <option value="45min">45 minutes</option>
              <option value="60min">1 hour+</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
            <span className="text-foreground">Enable notifications</span>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-7 rounded-full transition-colors ${
                notifications ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl mt-6"
      >
        Create My Plan
      </button>
    </div>
  );
}
