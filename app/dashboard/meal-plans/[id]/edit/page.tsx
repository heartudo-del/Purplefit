"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation" 
import { getMealPlan, getFoodEntries, updateMealPlan, type MealPlan, type FoodEntry, type MealPlanWeek, type MealPlanMeal } from "@/lib/local-storage"
import { generateMealPlanPDF } from "@/lib/pdf-generator"
import { toast } from "sonner"

// All UI components
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Download, Save } from "lucide-react"
import { MealSelector } from "@/components/meal-selector"

const DAYS = [ { number: 1, name: "Monday" }, { number: 2, name: "Tuesday" }, { number: 3, name: "Wednesday" }, { number: 4, name: "Thursday" }, { number: 5, name: "Friday" }, { number: 6, name: "Saturday" }, { number: 7, name: "Sunday" }];
const MEAL_TYPES = [{ key: "breakfast", name: "Breakfast", time: "7-8am", color: "bg-orange-100 text-orange-800" }, { key: "lunch", name: "Lunch", time: "1-2pm", color: "bg-blue-100 text-blue-800" }, { key: "dinner", name: "Dinner", time: "6-7pm", color: "bg-purple-100 text-purple-800" }];

export default function EditMealPlanPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedMeal, setSelectedMeal] = useState<{ weekId: string; day: number; mealType: string; } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const id = params?.id as string | undefined;
    if (!id) return;

    try {
      const plan = getMealPlan(id);
      if (!plan) {
        toast.error("Meal Plan Not Found", { description: "Redirecting..." });
        router.push("/dashboard/meal-plans");
        return;
      }
      const entries = getFoodEntries();
      setMealPlan(plan);
      setFoodEntries(entries);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Error Loading Data");
    } finally {
      setIsLoading(false);
    }
  }, [params, router]);

  // --- HANDLER FUNCTIONS REWRITTEN FOR RELIABILITY ---

  const handleSavePlan = async (showToast: boolean = true) => {
    if (!mealPlan) return;
    setIsSaving(true);
    try {
      updateMealPlan(mealPlan); // Save the current state from the editor
      if (showToast) {
        toast.success("Meal Plan Saved!", { description: "Your draft has been successfully saved." });
      }
      router.refresh();
    } catch (error) {
      if (showToast) { toast.error("Save Failed."); }
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleGeneratePDF = async () => {
    if (!mealPlan) return;
    setIsGeneratingPDF(true);
    try {
      toast.info("Saving latest changes first...");
      await handleSavePlan(false); // Await the save to ensure data is persisted

      // Now, call the generator function with the confirmed saved data
      const savedPlan = getMealPlan(mealPlan.id);
      if (savedPlan) {
        await generateMealPlanPDF(savedPlan, foodEntries);
      } else {
        throw new Error("Could not retrieve saved plan for PDF generation.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // This function ONLY updates the component's state (the "draft"). It does NOT save.
  const handleMealSelect = (newFoodEntryIds: string[], newCustomTexts: string[]) => {
    if (!selectedMeal) return;
    setMealPlan(currentPlan => {
      if (!currentPlan) return null;
      const updatedWeeks = currentPlan.weeks.map(week => {
        if (week.id !== selectedMeal.weekId) return week;
        const { day, mealType } = selectedMeal;
        const mealSlotIndex = week.meals.findIndex(m => m.day_of_week === day && m.meal_type === mealType);
        if (newFoodEntryIds.length === 0 && newCustomTexts.length === 0) {
          if (mealSlotIndex > -1) week.meals.splice(mealSlotIndex, 1);
          return { ...week, meals: week.meals };
        }
        if (mealSlotIndex > -1) {
          week.meals[mealSlotIndex] = { ...week.meals[mealSlotIndex], food_entry_ids: newFoodEntryIds, custom_meal_texts: newCustomTexts };
          return { ...week, meals: week.meals };
        } else {
          const newMeal: MealPlanMeal = { id: crypto.randomUUID(), day_of_week: day, meal_type: mealType as "breakfast" | "lunch" | "dinner", food_entry_ids: newFoodEntryIds, custom_meal_texts: newCustomTexts };
          return { ...week, meals: [...week.meals, newMeal] };
        }
      });
      return { ...currentPlan, weeks: updatedWeeks };
    });
    setSelectedMeal(null);
  };

  // This function ONLY updates the component's state (the "draft"). It does NOT save.
  const addNewWeek = () => {
    setMealPlan(currentPlan => {
      if (!currentPlan) return null;
      const newWeek: MealPlanWeek = { id: crypto.randomUUID(), week_number: currentPlan.weeks.length + 1, meals: [] };
      return { ...currentPlan, weeks: [...currentPlan.weeks, newWeek] };
    });
  };

  const getMealForDay = (week: MealPlanWeek, day: number, mealType: string) => week.meals.find((m) => m.day_of_week === day && m.meal_type === mealType);
  const getFoodEntryById = (id: string) => foodEntries.find((entry) => entry.id === id);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p>Loading Meal Plan...</p></div>;
  if (!mealPlan) return <div className="min-h-screen flex items-center justify-center"><p>Could not load the meal plan.</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <DashboardHeader />
      <div className="flex flex-col lg:flex-row">
        <DashboardNav />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{mealPlan.title}</h2>
                  <p className="text-gray-600">Client: {mealPlan.client_name}</p>
                  <p className="text-xs text-gray-500 mt-1">Make your changes and click "Save Plan" to save your draft.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button onClick={handleGeneratePDF} disabled={isGeneratingPDF} variant="outline" className="w-full">
                    {isGeneratingPDF ? "Generating..." : <><Download className="h-4 w-4 mr-2" /> Export PDF</>}
                  </Button>
                  <Button onClick={() => handleSavePlan()} disabled={isSaving} className="w-full">
                    {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Plan</>}
                  </Button>
                </div>
              </div>

              {mealPlan.weeks.length === 0 ? (
                <div className="text-center py-10">
                  <h3 className="text-lg font-semibold">This meal plan is empty.</h3>
                  <p className="text-gray-600 mt-2">Get started by adding your first week.</p>
                  <Button onClick={addNewWeek} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add First Week
                  </Button>
                </div>
              ) : (
                mealPlan.weeks.map((week) => (
                  <Card key={week.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Week {week.week_number}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[800px]">
                          <thead>
                            <tr>
                              <th className="text-left p-2 border-b font-medium w-24">Meal</th>
                              {DAYS.map((day) => (<th key={day.number} className="text-left p-2 border-b font-medium min-w-48">{day.name}</th>))}
                            </tr>
                          </thead>
                          <tbody>
                            {MEAL_TYPES.map((mealType) => (
                              <tr key={mealType.key}>
                                <td className="p-2 border-b align-top">
                                  <Badge className={mealType.color}>{mealType.name}</Badge>
                                  <div className="text-xs text-gray-500 mt-1">{mealType.time}</div>
                                </td>
                                {DAYS.map((day) => {
                                  const meal = getMealForDay(week, day.number, mealType.key);
                                  const hasContent = meal && (meal.food_entry_ids.length > 0 || meal.custom_meal_texts.length > 0);
                                  return (
                                    <td key={day.number} className="p-2 border-b align-top">
                                      <div className="min-h-20">
                                        {hasContent ? (
                                          <div className="bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100" onClick={() => setSelectedMeal({ weekId: week.id, day: day.number, mealType: mealType.key })}>
                                            <ul className="space-y-1 list-disc list-inside">
                                              {meal.food_entry_ids.map(id => { const foodEntry = getFoodEntryById(id); return <li key={id} className="text-sm">{foodEntry?.name || 'Unknown'}</li>; })}
                                              {meal.custom_meal_texts.map((text, i) => (<li key={`c-${i}`} className="text-sm italic">{text}</li>))}
                                            </ul>
                                          </div>
                                        ) : (
                                          <Button variant="outline" size="sm" className="w-full h-20 border-dashed" onClick={() => setSelectedMeal({ weekId: week.id, day: day.number, mealType: mealType.key })}>
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              <div className="flex justify-center">
                <Button onClick={addNewWeek} disabled={isSaving}> <Plus className="h-4 w-4 mr-2" /> Add New Week </Button>
              </div>

              {selectedMeal && (
                <MealSelector isOpen={!!selectedMeal} onClose={() => setSelectedMeal(null)} onSelect={handleMealSelect} foodEntries={foodEntries} mealType={selectedMeal.mealType}
                  currentMeal={getMealForDay(mealPlan.weeks.find((w) => w.id === selectedMeal.weekId)!, selectedMeal.day, selectedMeal.mealType)} day={selectedMeal.day}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
