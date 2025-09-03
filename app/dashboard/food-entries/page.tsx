"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { FoodEntriesTable } from "@/components/food-entries-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getFoodEntries, type FoodEntry } from "@/lib/local-storage"

export default function FoodEntriesPage() {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadFoodEntries = () => {
    setIsLoading(true)
    const entries = getFoodEntries()
    console.log("[v0] Loaded food entries:", entries.length)
    setFoodEntries(entries)
    setIsLoading(false)
  }

  useEffect(() => {
    loadFoodEntries()
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      loadFoodEntries()
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <DashboardNav />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-8">
                <p>Loading food entries...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Food Entries</h1>
                <p className="text-gray-600 mt-2">Manage your food database ({foodEntries.length} entries)</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadFoodEntries}>
                  Refresh
                </Button>
                <Button asChild>
                  <Link href="/dashboard/food-entries/new">Add New Food Entry</Link>
                </Button>
              </div>
            </div>

            <FoodEntriesTable foodEntries={foodEntries} />
          </div>
        </main>
      </div>
    </div>
  )
}
