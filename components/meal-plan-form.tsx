"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { MealPlan } from "@/lib/local-storage"
import { saveMealPlan, updateMealPlan } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface MealPlanFormProps {
  initialData?: MealPlan
  isEditing?: boolean
}

export function MealPlanForm({ initialData, isEditing = false }: MealPlanFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [clientName, setClientName] = useState(initialData?.client_name || "");
  const [category, setCategory] = useState<'Normal' | 'Liver Reset'>(initialData?.category || 'Normal');
  
  // --- THIS IS THE CRITICAL FIX ---
  // The isSaving state variable was missing.
  const [isSaving, setIsSaving] = useState(false);
  
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) {
      toast.error("Missing Information", { description: "Please provide a title and client name." });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && initialData?.id) {
        const fullUpdatedPlan: MealPlan = {
          ...initialData,
          title,
          client_name: clientName,
          category,
        };
        const result = updateMealPlan(fullUpdatedPlan);
        if (!result) throw new Error("Failed to update meal plan");
        toast.success("Plan Updated!", { description: "Redirecting you to the editor..." });
        router.push(`/dashboard/meal-plans/${initialData.id}/edit`);
        router.refresh();

      } else {
        const newPlan = saveMealPlan({
          title,
          client_name: clientName,
          weeks: [],
          category,
        });
        toast.success("Plan Created!", { description: "Redirecting you to the editor..." });
        router.push(`/dashboard/meal-plans/${newPlan.id}/edit`);
      }
    } catch (error) {
      toast.error("Operation Failed.");
    } finally {
      // It's good practice to also set saving to false here
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Meal Plan Details" : "Create a New Meal Plan"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Plan Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientName">Client Name *</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plan-type">Plan Type</Label>
            <Select onValueChange={(value: 'Normal' | 'Liver Reset') => setCategory(value)} defaultValue={category}>
              <SelectTrigger id="plan-type"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal Meal Plan</SelectItem>
                <SelectItem value="Liver Reset">Liver Reset Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create and Edit Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
