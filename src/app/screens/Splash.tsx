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
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 opacity-[0.07]">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 200 + i * 80,
              height: 200 + i * 80,
              left: `${20 + i * 10}%`,
              top: `${10 + i * 12}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 1.5, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center gap-5 relative z-10"
      >
        <motion.div
          className="bg-white/15 backdrop-blur-sm rounded-3xl p-7 border border-white/20"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Dumbbell className="w-14 h-14 text-white" strokeWidth={2} />
        </motion.div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">FuelFit</h1>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-white/80 font-medium"
          >
            Student Planner
          </motion.p>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="text-white/60 absolute bottom-14 text-center px-6 text-sm"
      >
        Plan your week. Train better. Eat smarter.
      </motion.p>

      <motion.div
        className="absolute bottom-6 w-12 h-1 rounded-full bg-white/20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1.8, ease: "linear" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
