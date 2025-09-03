"use client"

import { useState } from "react"
import type { MealPlan } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Search, Eye, Download } from "lucide-react"
import Link from "next/link"
import { deleteMealPlan } from "@/lib/local-storage"

interface MealPlansTableProps {
  mealPlans: MealPlan[]
}

export function MealPlansTable({ mealPlans: initialMealPlans }: MealPlansTableProps) {
  const [mealPlans, setMealPlans] = useState(initialMealPlans)
  const [searchTerm, setSearchTerm] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null)

  const filteredPlans = mealPlans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plan.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleGeneratePDF = async (planId: string, planTitle: string) => {
    setIsGeneratingPDF(planId)
    try {
      // For now, show alert - PDF generation would need to be implemented client-side
      alert("PDF generation feature will be implemented in the next update!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(null)
    }
  }

  const handleDelete = (planId: string) => {
    if (confirm("Are you sure you want to delete this meal plan?")) {
      const success = deleteMealPlan(planId)
      if (success) {
        setMealPlans(mealPlans.filter((plan) => plan.id !== planId))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Meal Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by title or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredPlans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">
                {mealPlans.length === 0 ? "No meal plans created yet." : "No meal plans found matching your search."}
              </p>
              {mealPlans.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard/meal-plans/new">Create Your First Meal Plan</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPlans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{plan.title}</h3>
                    {plan.client_name && <p className="text-gray-600 text-sm mb-2">Client: {plan.client_name}</p>}
                    <p className="text-gray-500 text-xs">Created: {formatDate(plan.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/meal-plans/${plan.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/meal-plans/${plan.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGeneratePDF(plan.id, plan.title)}
                      disabled={isGeneratingPDF === plan.id}
                    >
                      {isGeneratingPDF === plan.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600">
            Showing {filteredPlans.length} of {mealPlans.length} meal plans
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
