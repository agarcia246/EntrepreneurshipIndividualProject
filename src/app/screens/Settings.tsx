import { User, Bell, LogOut, ChevronRight, Presentation } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/hooks";
import { toast } from "sonner";
import {
  PageHeader,
  SkeletonScreen,
  Card,
} from "../components/shared";

export function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, update } = useProfile();

  const displayName = profile?.display_name || user?.user_metadata?.display_name || "User";
  const email = user?.email || "";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleNotifications = async () => {
    if (profile) {
      await update({ notifications_enabled: !profile.notifications_enabled });
      toast.success(profile.notifications_enabled ? "Notifications disabled" : "Notifications enabled");
    }
  };

  if (loading) return <SkeletonScreen cards={4} />;

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader title="Profile" subtitle="Manage your account and preferences" />

      <Card className="mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{displayName}</h2>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Card delay={0.05}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Goals</h3>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(profile?.goals || []).length > 0 ? (
              profile!.goals.map((goal: string) => (
                <span key={goal} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                  {goal}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No goals set</span>
            )}
          </div>
          <div className="flex items-center justify-between py-2.5 border-t border-border">
            <span className="text-sm text-foreground">Weekly workout frequency</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-muted-foreground">{profile?.workout_days || "3-4"} days</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </Card>

        <Card delay={0.1}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Preferences</h3>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-sm text-foreground">Diet style</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground capitalize">{profile?.diet_style || "balanced"}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2.5 border-t border-border">
              <span className="text-sm text-foreground">Cooking time</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">{profile?.cooking_time || "30 min"}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </Card>

        <Card delay={0.15}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settings</h3>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Notifications</span>
            </div>
            <motion.button
              role="switch"
              aria-checked={!!profile?.notifications_enabled}
              aria-label="Toggle notifications"
              onClick={toggleNotifications}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-7 rounded-full transition-colors duration-200 p-0.5 ${
                profile?.notifications_enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-sm"
                animate={{ x: profile?.notifications_enabled ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </motion.button>
          </div>
          <button
            onClick={() => navigate("/app/poster")}
            className="w-full mt-2 pt-3 border-t border-border flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <Presentation className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">View Project Poster</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="w-full bg-destructive/10 text-destructive py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-destructive/15 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
