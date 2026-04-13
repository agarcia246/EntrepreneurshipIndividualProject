import { useNavigate } from "react-router";
import { useState } from "react";
import { Mail, Lock, AlertCircle, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { seedDefaultData } from "@/lib/hooks";
import { OnboardingProgress, PrimaryButton } from "../components/shared";

export function SignUpLogin() {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setConfirmMsg("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
          setSubmitting(false);
          return;
        }
        navigate("/app");
      } else {
        const goals = JSON.parse(sessionStorage.getItem("onboarding_goals") || "[]");
        const prefs = JSON.parse(sessionStorage.getItem("onboarding_prefs") || "{}");

        const { error } = await signUp(email, password, prefs.displayName || email.split("@")[0]);
        if (error) {
          setError(error.message);
          setSubmitting(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from("profiles").update({
            goals,
            workout_days: prefs.workoutDays || "3-4",
            diet_style: prefs.dietStyle || "balanced",
            cooking_time: prefs.cookingTime || "30min",
            notifications_enabled: prefs.notifications !== false,
          }).eq("id", session.user.id);

          await seedDefaultData(session.user.id);

          sessionStorage.removeItem("onboarding_goals");
          sessionStorage.removeItem("onboarding_prefs");
          navigate("/app");
        } else {
          setConfirmMsg("Check your email for a confirmation link, then sign in.");
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col px-6 pt-12 pb-8">
      {!isLogin && <OnboardingProgress step={4} total={4} />}

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin ? "Sign in to continue your journey" : "Get started with FuelFit"}
              </p>
            </div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2.5 bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {confirmMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-primary/10 text-primary px-4 py-3 rounded-xl text-sm">
                  {confirmMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm shadow-[var(--shadow-card)] transition-shadow focus:shadow-[var(--shadow-card-hover)]"
                disabled={submitting}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-card text-foreground text-sm shadow-[var(--shadow-card)] transition-shadow focus:shadow-[var(--shadow-card-hover)]"
                disabled={submitting}
              />
            </div>

            <div className="pt-1">
              <PrimaryButton type="submit" loading={submitting}>
                {isLogin ? "Sign In" : "Sign Up"}
              </PrimaryButton>
            </div>
          </motion.form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-background text-muted-foreground">or</span>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); setConfirmMsg(""); }}
              className="text-primary font-semibold"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
