"use client"

import { useState, useEffect } from "react"
import type { FoodEntry, MealPlanMeal } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { Badge } from "./ui/badge"

interface MealSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (foodEntryIds: string[], customTexts: string[]) => void
  foodEntries: FoodEntry[]
  mealType: string
  currentMeal?: MealPlanMeal | null
  // --- FIX #3: Pass the day number to the selector ---
  day?: number 
}

// Helper to get day name from number
const getDayName = (dayNumber?: number) => {
  if (dayNumber === undefined) return "";
  const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days[dayNumber] || "";
}

export function MealSelector({
  isOpen,
  onClose,
  onSelect,
  foodEntries,
  mealType,
  currentMeal,
  day
}: MealSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [customTexts, setCustomTexts] = useState<string[]>([])
  const [currentCustomText, setCurrentCustomText] = useState("")

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(currentMeal?.food_entry_ids || []))
      setCustomTexts(currentMeal?.custom_meal_texts || [])
      setCurrentCustomText("")
    }
  }, [isOpen, currentMeal])

  const handleFoodEntryToggle = (foodEntryId: string) => {
    const newSelectedIds = new Set(selectedIds)
    if (newSelectedIds.has(foodEntryId)) {
      newSelectedIds.delete(foodEntryId)
    } else {
      newSelectedIds.add(foodEntryId)
    }
    setSelectedIds(newSelectedIds)
  }

  const handleAddCustomText = () => {
    if (currentCustomText.trim()) {
      setCustomTexts([...customTexts, currentCustomText.trim()])
      setCurrentCustomText("")
    }
  }

  const handleRemoveCustomText = (indexToRemove: number) => {
    setCustomTexts(customTexts.filter((_, index) => index !== indexToRemove))
  }
  
  const handleSave = () => {
    onSelect(Array.from(selectedIds), customTexts)
    onClose()
  }

  const relevantFoodEntries = foodEntries.filter(entry => entry.meal_type === mealType);
  const dayName = getDayName(day);
  const mealTypeName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          {/* --- FIX #3: Updated Title --- */}
          <DialogTitle>
            Select Meals for {mealTypeName} on {dayName}
          </DialogTitle>
        </DialogHeader>

        {/* ... (The rest of the JSX is unchanged and correct) ... */}
        <div className="grid gap-6 py-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Select from Database</h3>
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 border rounded-md p-2">
              {relevantFoodEntries.map((entry) => (
                <div key={entry.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={entry.id}
                    checked={selectedIds.has(entry.id)}
                    onCheckedChange={() => handleFoodEntryToggle(entry.id)}
                  />
                  <label htmlFor={entry.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {entry.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Add Custom Meals</h3>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="e.g., 'A glass of water'"
                value={currentCustomText}
                onChange={(e) => setCurrentCustomText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomText()}
              />
              <Button type="button" onClick={handleAddCustomText}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {customTexts.map((text, index) => (
                <div key={index} className="flex items-center justify-between">
                   <Badge variant="secondary">{text}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCustomText(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
