"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client" // Corrected path
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function DashboardHeader() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("You have been signed out.")
      router.push("/") // Redirect to the homepage after sign out
      router.refresh()
    } catch (error) {
      toast.error("Sign out failed.")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          {/* --- THIS IS THE CRITICAL FIX --- */}
          {/* We use a Link and the Next.js Image component to correctly load the logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/logo.jpg" // This path correctly points to public/logo.jpg
              alt="Purple Fit Logo"
              width={120} // Adjust width as needed
              height={30} // Adjust height as needed
              priority // Loads the logo faster
            />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
