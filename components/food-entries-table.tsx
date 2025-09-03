"use client"

import { useState, useEffect } from "react"
import type { FoodEntry } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { deleteFoodEntry } from "@/lib/local-storage"

interface FoodEntriesTableProps {
  foodEntries: FoodEntry[]
}

export function FoodEntriesTable({ foodEntries: initialFoodEntries }: FoodEntriesTableProps) {
  const [foodEntries, setFoodEntries] = useState(initialFoodEntries)
  const [searchTerm, setSearchTerm] = useState("")
  const [mealTypeFilter, setMealTypeFilter] = useState<string>("all")

  useEffect(() => {
    setFoodEntries(initialFoodEntries)
  }, [initialFoodEntries])

  const filteredEntries = foodEntries.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesMealType = mealTypeFilter === "all" || entry.meal_type === mealTypeFilter
    return matchesSearch && matchesMealType
  })

  const getMealTypeBadgeColor = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "bg-orange-100 text-orange-800"
      case "lunch":
        return "bg-blue-100 text-blue-800"
      case "dinner":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = (entryId: string) => {
    if (confirm("Are you sure you want to delete this food entry?")) {
      const success = deleteFoodEntry(entryId)
      if (success) {
        setFoodEntries(foodEntries.filter((entry) => entry.id !== entryId))
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search food entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Meal Types</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No food entries found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{entry.name}</h3>
                      <Badge className={getMealTypeBadgeColor(entry.meal_type)}>
                        {entry.meal_type.charAt(0).toUpperCase() + entry.meal_type.slice(1)}
                      </Badge>
                      {entry.calories && <Badge variant="outline">{entry.calories} cal</Badge>}
                    </div>
                    {entry.description && <p className="text-gray-600 text-sm">{entry.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/food-entries/${entry.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}>
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
            Showing {filteredEntries.length} of {foodEntries.length} food entries
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
