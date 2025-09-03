"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getMealPlans, deleteMealPlan, type MealPlan } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Plus, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MealPlansPage() {
  // --- THIS IS THE CRITICAL FIX ---
  // We use useState to hold the list of plans.
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [planToDelete, setPlanToDelete] = useState<MealPlan | null>(null);
  const router = useRouter();

  // We use useEffect to load the data from localStorage ONCE when the component mounts.
  // This is the correct, safe way to load client-side data.
  useEffect(() => {
    const loadedPlans = getMealPlans();
    setMealPlans(loadedPlans);
  }, []);

  const handleDeletePlan = () => {
    if (!planToDelete) return;
    
    deleteMealPlan(planToDelete.id);
    setMealPlans(currentPlans => currentPlans.filter(p => p.id !== planToDelete.id));
    toast.success(`"${planToDelete.title}" was deleted.`);
    setPlanToDelete(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Meal Plans</h1>
            <p className="text-gray-600">
              Create and manage meal plans for your clients ({mealPlans.length} plans)
            </p>
          </div>
          <Link href="/dashboard/meal-plans/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Plan
            </Button>
          </Link>
        </div>

        {mealPlans.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">No Meal Plans Found</h3>
            <p className="text-gray-600 mt-2">Get started by creating your first meal plan.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mealPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                  <CardDescription>Client: {plan.client_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Created on: {new Date(plan.created_at).toLocaleDateString()}
                  </p>
                   <p className="text-sm text-gray-500">
                    Type: <span className="font-medium">{plan.category}</span>
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setPlanToDelete(plan)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Link href={`/dashboard/meal-plans/${plan.id}/edit`}>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meal plan titled "{planToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
