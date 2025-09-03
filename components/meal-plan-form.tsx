"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { saveMealPlan, updateMealPlan, type MealPlan } from "@/lib/local-storage"

interface MealPlanFormProps {
  initialData?: Partial<MealPlan>
  isEditing?: boolean
}

export function MealPlanForm({ initialData, isEditing = false }: MealPlanFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [clientName, setClientName] = useState(initialData?.client_name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const mealPlanData = {
        title,
        client_name: clientName || "",
        weeks: [
          {
            id: crypto.randomUUID(),
            week_number: 1,
            meals: [],
          },
        ],
      }

      if (isEditing && initialData?.id) {
        const result = updateMealPlan(initialData.id, mealPlanData)
        if (!result) throw new Error("Failed to update meal plan")
        router.push(`/dashboard/meal-plans/${initialData.id}/edit`)
      } else {
        const newMealPlan = saveMealPlan(mealPlanData)
        router.push(`/dashboard/meal-plans/${newMealPlan.id}/edit`)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Meal Plan" : "Create New Meal Plan"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Meal Plan Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weight Loss Plan - January 2024"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., John Smith"
            />
          </div>

          {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : isEditing ? "Update Meal Plan" : "Create Meal Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/meal-plans")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
