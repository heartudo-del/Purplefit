"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveMealPlan } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

export default function NewMealPlanPage() {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [category, setCategory] = useState<'Normal' | 'Liver Reset'>('Normal');
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
      // Create a new meal plan object with an empty weeks array
      const newPlan = saveMealPlan({
        title,
        client_name: clientName,
        weeks: [], // Start with an empty plan, making it a "draft"
        category,
      });
      
      toast.success("Plan Created!", { description: "Redirecting you to the editor..." });
      // Redirect to the editor page for the newly created plan
      router.push(`/dashboard/meal-plans/${newPlan.id}/edit`);
    } catch (error) {
      toast.error("Failed to create plan.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <DashboardHeader />
      <div className="flex flex-col lg:flex-row">
        <DashboardNav />
        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Meal Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Plan Title *</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 4-Week Fat Loss Program" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g., Jane Doe" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="plan-type">Plan Type</Label>
                    <Select onValueChange={(value: 'Normal' | 'Liver Reset') => setCategory(value)} defaultValue={category}>
                      <SelectTrigger id="plan-type"><SelectValue placeholder="Select a plan type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Normal">Normal Meal Plan</SelectItem>
                        <SelectItem value="Liver Reset">Liver Reset Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Create and Edit Plan"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push("/dashboard/meal-plans")}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
