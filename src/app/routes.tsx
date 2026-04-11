import { createHashRouter } from "react-router";
import { Splash } from "./screens/Splash";
import { OnboardingWelcome } from "./screens/OnboardingWelcome";
import { OnboardingGoals } from "./screens/OnboardingGoals";
import { OnboardingPreferences } from "./screens/OnboardingPreferences";
import { SignUpLogin } from "./screens/SignUpLogin";
import { MainLayout } from "./components/MainLayout";
import { Home } from "./screens/Home";
import { WeeklyPlanner } from "./screens/WeeklyPlanner";
import { WorkoutPlan } from "./screens/WorkoutPlan";
import { MealPlan } from "./screens/MealPlan";
import { HabitTracker } from "./screens/HabitTracker";
import { Progress } from "./screens/Progress";
import { Feedback } from "./screens/Feedback";
import { Settings } from "./screens/Settings";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createHashRouter([
  {
    path: "/",
    element: <Splash />,
  },
  {
    path: "/onboarding/welcome",
    element: <OnboardingWelcome />,
  },
  {
    path: "/onboarding/goals",
    element: <OnboardingGoals />,
  },
  {
    path: "/onboarding/preferences",
    element: <OnboardingPreferences />,
  },
  {
    path: "/signup",
    element: <SignUpLogin />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "plan", element: <WeeklyPlanner /> },
      { path: "workout", element: <WorkoutPlan /> },
      { path: "meals", element: <MealPlan /> },
      { path: "track", element: <HabitTracker /> },
      { path: "progress", element: <Progress /> },
      { path: "feedback", element: <Feedback /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);
