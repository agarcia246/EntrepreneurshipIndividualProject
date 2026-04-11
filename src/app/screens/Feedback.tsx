import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useWeeklyCheckIn } from "@/lib/hooks";

const focusOptions = [
  "More consistent workouts",
  "Better meal planning",
  "Improve sleep habits",
  "Increase protein intake",
  "Reduce stress",
];

export function Feedback() {
  const navigate = useNavigate();
  const { checkIn, loading, save } = useWeeklyCheckIn();
  const [rating, setRating] = useState(0);
  const [consistency, setConsistency] = useState(3);
  const [challenges, setChallenges] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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
        <button onClick={() => navigate("/app/progress")} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-3xl text-foreground mb-1">Weekly Check-In</h1>
        <p className="text-muted-foreground">Reflect on your week</p>
      </motion.div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 border border-border"
        >
          <label className="block text-foreground mb-4">
            Rate your week from 1-5
          </label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-2"
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 border border-border"
        >
          <label className="block text-foreground mb-4">
            How consistent did you feel this week?
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="5"
              value={consistency}
              onChange={(e) => setConsistency(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not consistent</span>
              <span>Very consistent</span>
            </div>
            <p className="text-center text-2xl text-primary">{consistency}/5</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-6 border border-border"
        >
          <label className="block text-foreground mb-4">
            What got in the way?
          </label>
          <textarea
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="Share any challenges or obstacles..."
            className="w-full p-4 rounded-xl border border-border bg-background text-foreground resize-none h-32"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl p-6 border border-border"
        >
          <label className="block text-foreground mb-4">
            What should next week focus on?
          </label>
          <div className="space-y-2">
            {focusOptions.map((option) => (
              <button
                key={option}
                onClick={() => toggleFocus(option)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  focus.includes(option)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <span className="text-foreground">{option}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/10 text-primary px-4 py-3 rounded-xl text-sm text-center"
          >
            Check-in saved successfully!
          </motion.div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
          Submit Check-In
        </button>
      </div>
    </div>
  );
}
