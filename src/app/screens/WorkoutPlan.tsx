import { ArrowLeft, Clock, Repeat, Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { useWorkouts } from "@/lib/hooks";
import type { Json } from "@/lib/database.types";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

export function WorkoutPlan() {
  const navigate = useNavigate();
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
        <button onClick={() => navigate("/app")} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-3xl text-foreground mb-1">Workout Plan</h1>
        <p className="text-muted-foreground">
          {workouts.length > 0 ? "Choose your workout for today" : "No workouts planned yet"}
        </p>
      </motion.div>

      {workouts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">Add your first workout to get started</p>
          <button
            onClick={handleAddSample}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl"
          >
            Add Sample Workout
          </button>
        </motion.div>
      ) : (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {workouts.map((workout, i) => (
              <button
                key={workout.id}
                onClick={() => { setSelectedIdx(i); setCompleted([]); }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedIdx === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {workout.title}
              </button>
            ))}
          </div>

          {selectedWorkout && (
            <motion.div
              key={selectedWorkout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-card rounded-3xl p-6 border border-border">
                <h2 className="text-2xl text-foreground mb-2">{selectedWorkout.title}</h2>
                <p className="text-muted-foreground mb-4">{selectedWorkout.muscle_group}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedWorkout.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Repeat className="w-4 h-4" />
                    <span>{exercises.length} exercises</span>
                  </div>
                </div>
                {selectedWorkout.completed && (
                  <span className="inline-block mt-3 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-2xl p-5 border-2 transition-all ${
                      completed.includes(index)
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-foreground mb-1">{exercise.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exercise.sets} × {exercise.reps}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleComplete(index)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          completed.includes(index)
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {completed.includes(index) && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3 pt-4">
                {!selectedWorkout.completed && (
                  <button
                    onClick={handleMarkComplete}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-2xl"
                  >
                    Mark Workout Complete
                  </button>
                )}
                <button
                  onClick={handleAddSample}
                  className="w-full border-2 border-border bg-card text-foreground py-4 rounded-2xl"
                >
                  Add Another Workout
                </button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
