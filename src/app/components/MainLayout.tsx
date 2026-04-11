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
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 relative py-2 px-4"
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-xs transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
