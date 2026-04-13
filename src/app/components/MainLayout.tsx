import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Calendar, CheckSquare, TrendingUp, User } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { path: "/app", icon: Home, label: "Home" },
  { path: "/app/plan", icon: Calendar, label: "Plan" },
  { path: "/app/track", icon: CheckSquare, label: "Track" },
  { path: "/app/progress", icon: TrendingUp, label: "Progress" },
  { path: "/app/settings", icon: User, label: "Profile" },
];

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "var(--shadow-nav)",
        }}
      >
        <div className="max-w-[430px] mx-auto flex items-center justify-around px-2 pt-2 pb-5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileTap={{ scale: 0.85 }}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-0.5 relative py-1.5 px-4 rounded-xl transition-colors"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="navBg"
                      className="absolute -inset-2 rounded-xl"
                      style={{ background: "var(--secondary)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-[22px] h-[22px] relative z-10 transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className={`text-[10px] relative z-10 transition-colors duration-200 ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
