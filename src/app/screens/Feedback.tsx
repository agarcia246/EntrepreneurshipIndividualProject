import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Check } from "lucide-react";
import { useWeeklyCheckIn } from "@/lib/hooks";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  PageHeader,
  SkeletonScreen,
  Card,
  PrimaryButton,
} from "../components/shared";

const focusOptions = [
  "More consistent workouts",
  "Better meal planning",
  "Improve sleep habits",
  "Increase protein intake",
  "Reduce stress",
];

export function Feedback() {
  const { checkIn, loading, save } = useWeeklyCheckIn();
  const [rating, setRating] = useState(0);
  const [consistency, setConsistency] = useState(3);
  const [challenges, setChallenges] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (checkIn) {
      setRating(checkIn.rating);
      setConsistency(checkIn.consistency);
      setChallenges(checkIn.challenges);
      setFocus(checkIn.focus_areas);
    }
  }, [checkIn]);

  const toggleFocus = (option: string) => {
    setFocus((prev) =>
      prev.includes(option) ? prev.filter((f) => f !== option) : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await save({ rating, consistency, challenges, focus_areas: focus });
    setSubmitting(false);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.65 },
      colors: ["#16a34a", "#0ea5e9", "#f59e0b"],
    });
    toast.success("Check-in submitted!", {
      description: "Keep reflecting — it makes a difference.",
    });
  };

  if (loading) return <SkeletonScreen cards={4} />;

  const consistencyLabels = ["", "Not at all", "Slightly", "Somewhat", "Quite", "Very"];

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader
        title="Weekly Check-In"
        subtitle="Reflect on your week"
        back="/app/progress"
      />

      <div className="space-y-3">
        <Card>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Rate your week
          </label>
          <div className="flex gap-1.5 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileTap={{ scale: 0.85 }}
                onClick={() => setRating(star)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <motion.div
                  animate={{
                    scale: star <= rating ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Star
                    className={`w-9 h-9 transition-colors ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </motion.div>
              </motion.button>
            ))}
          </div>
          {rating > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs text-muted-foreground mt-2"
            >
              {rating <= 2 ? "We all have tough weeks. Next one will be better!" :
               rating === 3 ? "Solid week! Room for growth." :
               rating === 4 ? "Great week! You're building momentum." :
               "Amazing week! You crushed it!"}
            </motion.p>
          )}
        </Card>

        <Card delay={0.05}>
          <label className="block text-sm font-semibold text-foreground mb-3">
            How consistent did you feel?
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="5"
              value={consistency}
              onChange={(e) => setConsistency(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Not consistent</span>
              <span>Very consistent</span>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">{consistency}</span>
              <span className="text-sm text-muted-foreground">/5</span>
              <p className="text-xs text-muted-foreground mt-0.5">{consistencyLabels[consistency]} consistent</p>
            </div>
          </div>
        </Card>

        <Card delay={0.1}>
          <label className="block text-sm font-semibold text-foreground mb-2.5">
            What got in the way?
          </label>
          <textarea
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="Share any challenges or obstacles..."
            className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-sm resize-none h-28 shadow-[var(--shadow-card)]"
          />
        </Card>

        <Card delay={0.15}>
          <label className="block text-sm font-semibold text-foreground mb-3">
            What should next week focus on?
          </label>
          <div className="space-y-1.5">
            {focusOptions.map((option) => {
              const isSelected = focus.includes(option);
              return (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFocus(option)}
                  className={`w-full p-3.5 rounded-lg flex items-center gap-3 transition-all text-left ${
                    isSelected
                      ? "bg-primary/5 border-2 border-primary"
                      : "bg-muted/50 border-2 border-transparent"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isSelected ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0"
                      />
                    )}
                  </AnimatePresence>
                  <span className="text-sm text-foreground">{option}</span>
                </motion.button>
              );
            })}
          </div>
        </Card>

        <PrimaryButton
          onClick={handleSubmit}
          loading={submitting}
        >
          Submit Check-In
        </PrimaryButton>
      </div>
    </div>
  );
}
