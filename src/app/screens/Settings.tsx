import { User, Bell, Moon, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/hooks";

export function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, update } = useProfile();

  const displayName = profile?.display_name || user?.user_metadata?.display_name || "User";
  const email = user?.email || "";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleNotifications = async () => {
    if (profile) {
      await update({ notifications_enabled: !profile.notifications_enabled });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl text-foreground mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-6 border border-border mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-foreground">{displayName}</h2>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <h3 className="text-foreground p-4 border-b border-border">Goals</h3>
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {(profile?.goals || []).length > 0 ? (
                profile!.goals.map((goal) => (
                  <span key={goal} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    {goal}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No goals set</span>
              )}
            </div>
          </div>
          <div className="p-4 flex items-center justify-between border-t border-border">
            <span className="text-foreground">Weekly workout frequency</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{profile?.workout_days || "3-4"} days</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <h3 className="text-foreground p-4 border-b border-border">Preferences</h3>
          <div className="p-4 flex items-center justify-between">
            <span className="text-foreground">Diet style</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground capitalize">{profile?.diet_style || "balanced"}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between border-t border-border">
            <span className="text-foreground">Cooking time</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{profile?.cooking_time || "30 min"}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <h3 className="text-foreground p-4 border-b border-border">Settings</h3>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground">Notifications</span>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-7 rounded-full transition-colors ${
                profile?.notifications_enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  profile?.notifications_enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleSignOut}
          className="w-full bg-destructive text-destructive-foreground py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}
