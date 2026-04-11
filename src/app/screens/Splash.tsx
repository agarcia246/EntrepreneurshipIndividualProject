import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/lib/auth";

export function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      navigate(user ? "/app" : "/onboarding/welcome");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="h-screen w-full bg-primary flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <div className="bg-white/10 rounded-3xl p-6">
          <Dumbbell className="w-16 h-16 text-white" strokeWidth={2} />
        </div>
        <div className="text-center">
          <h1 className="text-4xl text-white mb-3">FuelFit</h1>
          <p className="text-lg text-white/80">Student Planner</p>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-white/60 absolute bottom-12 text-center px-6"
      >
        Plan your week. Train better. Eat smarter.
      </motion.p>
    </div>
  );
}
