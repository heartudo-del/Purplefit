"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Note: The FoodEntry interface in local-storage now includes 'category'
import { saveFoodEntry, updateFoodEntry, type FoodEntry } from "@/lib/local-storage"
import { toast } from "sonner"

interface FoodEntryFormProps {
  initialData?: Partial<FoodEntry>
  isEditing?: boolean
}

// Define the available categories
const CATEGORIES = ["Normal", "Liver Reset", "Snack"] as const;

export function FoodEntryForm({ initialData, isEditing = false }: FoodEntryFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [mealType, setMealType] = useState(initialData?.meal_type || "breakfast")
  const [calories, setCalories] = useState(initialData?.calories?.toString() || "")
  
  // --- NEW: Add state for the category ---
  const [category, setCategory] = useState(initialData?.category || "Normal")
  
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!name || !mealType || !category) {
      toast.error("Missing Fields", { description: "Please fill in all required fields." });
      return;
    }

    setIsLoading(true)

    try {
      const foodEntryData = {
        name,
        description: description || "",
        meal_type: mealType as "breakfast" | "lunch" | "dinner",
        calories: calories ? Number.parseInt(calories) : undefined,
        category: category as "Normal" | "Liver Reset" | "Snack", // Add category to the data
      }

      if (isEditing && initialData?.id) {
        updateFoodEntry(initialData.id, foodEntryData)
        toast.success("Food Entry Updated", { description: `"${name}" has been successfully updated.` });
      } else {
        saveFoodEntry(foodEntryData)
        toast.success("Food Entry Added", { description: `"${name}" has been added to your database.` });
      }

      router.push("/dashboard/food-entries")
      router.refresh(); // Important to show the new/updated data in the list
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Operation Failed", { description: errorMessage });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Food Entry" : "Add New Food Entry"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grilled Chicken Breast"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the food item..."
              rows={3}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="meal-type">Meal Type *</Label>
              <Select value={mealType} onValueChange={(value) => setMealType(value as any)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- NEW: Category Selector --- */}
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as any)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          <div className="grid gap-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 250"
              min="0"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update Food Entry" : "Add Food Entry"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/food-entries")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
