import { Flame, Beef, Trash2, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useMeals } from "@/lib/hooks";
import { toast } from "sonner";
import {
  PageHeader,
  SkeletonScreen,
  EmptyState,
  GradientCard,
  Card,
  AnimatedNumber,
  PrimaryButton,
} from "../components/shared";

const sampleMeals = [
  { meal_type: "Breakfast", name: "Greek Yogurt Bowl", description: "Greek yogurt, granola, berries, honey", calories: 420, protein: 24 },
  { meal_type: "Lunch", name: "Chicken & Rice Bowl", description: "Grilled chicken, brown rice, broccoli, avocado", calories: 580, protein: 45 },
  { meal_type: "Dinner", name: "Salmon & Veggies", description: "Baked salmon, sweet potato, green beans", calories: 520, protein: 38 },
  { meal_type: "Snack", name: "Protein Shake", description: "Whey protein, banana, peanut butter, oat milk", calories: 350, protein: 28 },
];

const mealTypeColors: Record<string, string> = {
  Breakfast: "bg-amber-500/10 text-amber-600",
  Lunch: "bg-green-500/10 text-green-600",
  Dinner: "bg-blue-500/10 text-blue-600",
  Snack: "bg-purple-500/10 text-purple-600",
};

export function MealPlan() {
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
    toast.success("Meal plan generated!");
  };

  const handleRemove = async (id: string, name: string) => {
    await remove(id);
    toast("Meal removed", { description: name });
  };

  if (loading) return <SkeletonScreen cards={4} />;

  return (
    <div className="min-h-screen bg-background px-5 pt-8 pb-6">
      <PageHeader
        title="Meal Plan"
        subtitle="Today's nutrition plan"
        back="/app"
      />

      {meals.length > 0 && (
        <GradientCard gradient="var(--gradient-accent)" className="mb-4">
          <span className="text-xs font-medium opacity-80">Daily totals</span>
          <div className="grid grid-cols-2 gap-4 mt-2.5">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Flame className="w-4 h-4 opacity-80" />
                <span className="text-xs opacity-70">Calories</span>
              </div>
              <AnimatedNumber value={totalCalories} className="text-2xl font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <Beef className="w-4 h-4 opacity-80" />
                <span className="text-xs opacity-70">Protein</span>
              </div>
              <AnimatedNumber value={totalProtein} suffix="g" className="text-2xl font-bold" />
            </div>
          </div>
        </GradientCard>
      )}

      {meals.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No meals logged"
          description="Generate a meal plan to start tracking your nutrition"
          action={
            <PrimaryButton onClick={handleGenerateMeals} loading={adding} className="w-auto px-6">
              Generate Meal Plan
            </PrimaryButton>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {meals.map((meal, index) => (
            <Card key={meal.id} delay={index * 0.06}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mealTypeColors[meal.meal_type] || "bg-muted text-muted-foreground"}`}>
                    {meal.meal_type}
                  </span>
                  <h3 className="text-foreground font-semibold mt-1.5">{meal.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{meal.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <Flame className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{meal.calories} cal</span>
                  </div>
                  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                    <Beef className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{meal.protein}g</span>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(meal.id, meal.name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                </motion.button>
              </div>
            </Card>
          ))}

          <div className="pt-2">
            <PrimaryButton onClick={handleGenerateMeals} loading={adding}>
              Generate More Meals
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
}
