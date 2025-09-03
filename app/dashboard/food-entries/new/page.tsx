"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { FoodEntryForm } from "@/components/food-entry-form"

export default function NewFoodEntryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Add New Food Entry</h1>
              <p className="text-gray-600 mt-2">Create a new food entry for your meal plans</p>
            </div>

            <FoodEntryForm />
          </div>
        </main>
      </div>
    </div>
  )
}
