import { ArrowLeft, Flame, Beef, Trash2, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { useMeals } from "@/lib/hooks";

const sampleMeals = [
  { meal_type: "Breakfast", name: "Greek Yogurt Bowl", description: "Greek yogurt, granola, berries, honey", calories: 420, protein: 24 },
  { meal_type: "Lunch", name: "Chicken & Rice Bowl", description: "Grilled chicken, brown rice, broccoli, avocado", calories: 580, protein: 45 },
  { meal_type: "Dinner", name: "Salmon & Veggies", description: "Baked salmon, sweet potato, green beans", calories: 520, protein: 38 },
  { meal_type: "Snack", name: "Protein Shake", description: "Whey protein, banana, peanut butter, oat milk", calories: 350, protein: 28 },
];

export function MealPlan() {
  const navigate = useNavigate();
  const { meals, loading, add, remove } = useMeals();
  const [adding, setAdding] = useState(false);

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

  const handleGenerateMeals = async () => {
    setAdding(true);
    const today = new Date().toISOString().split("T")[0];
    for (const meal of sampleMeals) {
      await add({ ...meal, date: today } as any);
    }
    setAdding(false);
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
        <h1 className="text-3xl text-foreground mb-1">Meal Plan</h1>
        <p className="text-muted-foreground">Today's nutrition plan</p>
      </motion.div>

      {meals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent rounded-3xl p-6 text-accent-foreground mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm opacity-80">Daily totals</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-sm opacity-80">Calories</span>
              </div>
              <p className="text-2xl">{totalCalories.toLocaleString()}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Beef className="w-4 h-4" />
                <span className="text-sm opacity-80">Protein</span>
              </div>
              <p className="text-2xl">{totalProtein}g</p>
            </div>
          </div>
        </motion.div>
      )}

      {meals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No meals logged today</p>
          <button
            onClick={handleGenerateMeals}
            disabled={adding}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate Meal Plan
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-3xl p-6 border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground">{meal.meal_type}</span>
                  <h3 className="text-lg text-foreground mb-1">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{meal.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Beef className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{meal.protein}g protein</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => remove(meal.id)}
                  className="flex-1 py-2 rounded-xl border border-border text-foreground text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </motion.div>
          ))}

          <button
            onClick={handleGenerateMeals}
            disabled={adding}
            className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate More Meals
          </button>
        </div>
      )}
    </div>
  );
}
