"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { initializeDefaultData } from "@/lib/local-storage"
import { Plus, UtensilsCrossed, Calendar, Zap } from "lucide-react"

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    initializeDefaultData()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <DashboardHeader onMenuToggle={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex">
        <DashboardNav isMobileMenuOpen={isMobileMenuOpen} onItemClick={closeMobileMenu} />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Welcome to your Purple Fit meal planning dashboard
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="purple-card rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <UtensilsCrossed className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Food Entries</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">Manage your food database</p>
                <a
                  href="/dashboard/food-entries"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View Food Entries →
                </a>
              </div>

              <div className="purple-card rounded-xl shadow-sm p-6 border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Meal Plans</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm">Create and manage meal plans</p>
                <a
                  href="/dashboard/meal-plans"
                  className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View Meal Plans →
                </a>
              </div>

              <div className="purple-card rounded-xl shadow-sm p-6 border md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href="/dashboard/meal-plans/new"
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Create New Meal Plan</span>
                  </a>
                  <a
                    href="/dashboard/food-entries/new"
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Add Food Entry</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
