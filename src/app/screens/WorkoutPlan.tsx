import { Clock, Repeat, Plus, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useWorkouts } from "@/lib/hooks";
import { toast } from "sonner";
import type { Json } from "@/lib/database.types";
import {
  PageHeader,
  SkeletonScreen,
  EmptyState,
  Card,
  PrimaryButton,
} from "../components/shared";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export function WorkoutPlan() {
  const { workouts, loading, add, markComplete } = useWorkouts();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const selectedWorkout = workouts[selectedIdx];
  const exercises: Exercise[] = selectedWorkout
    ? (selectedWorkout.exercises as Exercise[])
    : [];

  const toggleComplete = (index: number) => {
    setCompleted((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleMarkComplete = async () => {
    if (selectedWorkout) {
      await markComplete(selectedWorkout.id);
      toast.success("Workout completed! Great job!", {
        description: selectedWorkout.title,
      });
    }
  };

  const handleAddSample = async () => {
    await add({
      title: "Full Body",
      muscle_group: "All muscle groups",
      duration: "40 min",
      exercises: [
        { name: "Burpees", sets: "3 sets", reps: "10 reps" },
        { name: "Push-ups", sets: "3 sets", reps: "15 reps" },
        { name: "Squats", sets: "3 sets", reps: "15 reps" },
        { name: "Plank", sets: "3 sets", reps: "45 sec" },
      ] as unknown as Json,
      date: new Date().toISOString().split("T")[0],
      completed: false,
    });
    toast.success("Workout added!");
  };

  if (loading) return <SkeletonScreen cards={4} />;

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader
        title="Workout Plan"
        subtitle={workouts.length > 0 ? "Choose your workout for today" : "No workouts planned yet"}
        back="/app"
      />

      {workouts.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No workouts yet"
          description="Add your first workout to get started on your fitness journey"
          action={
            <PrimaryButton onClick={handleAddSample} className="w-auto px-6">
              Add Sample Workout
            </PrimaryButton>
          }
        />
      ) : (
        <>
          <div className="flex gap-2 mb-5 overflow-x-auto pb-2 -mx-1 px-1">
            {workouts.map((workout, i) => (
              <motion.button
                key={workout.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedIdx(i); setCompleted([]); }}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                  selectedIdx === i
                    ? "text-white shadow-[var(--shadow-card)]"
                    : "bg-card text-muted-foreground shadow-[var(--shadow-card)]"
                }`}
                style={selectedIdx === i ? { background: "var(--gradient-primary)" } : undefined}
              >
                {workout.title}
              </motion.button>
            ))}
          </div>

          {selectedWorkout && (
            <motion.div
              key={selectedWorkout.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <Card>
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-xl font-bold text-foreground">{selectedWorkout.title}</h2>
                  {selectedWorkout.completed && (
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{selectedWorkout.muscle_group}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedWorkout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{exercises.length} exercises</span>
                  </div>
                </div>
              </Card>

              <div className="space-y-2">
                {exercises.map((exercise, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleComplete(index)}
                    className={`w-full rounded-xl p-4 flex items-center gap-3.5 transition-all ${
                      completed.includes(index)
                        ? "bg-primary/5 border-2 border-primary shadow-[var(--shadow-card)]"
                        : "bg-card border border-transparent shadow-[var(--shadow-card)]"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      completed.includes(index)
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}>
                      {completed.includes(index) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className={`font-medium text-sm ${completed.includes(index) ? "text-foreground line-through decoration-primary/40" : "text-foreground"}`}>
                        {exercise.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{exercise.sets} × {exercise.reps}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {index + 1}/{exercises.length}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-2.5 pt-2">
                {!selectedWorkout.completed && (
                  <PrimaryButton onClick={handleMarkComplete}>
                    Mark Workout Complete
                  </PrimaryButton>
                )}
                <PrimaryButton variant="outline" onClick={handleAddSample}>
                  Add Another Workout
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
