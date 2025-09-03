"use client"

import Image from "next/image"
import { Menu, X } from "lucide-react"

interface DashboardHeaderProps {
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function DashboardHeader({ onMenuToggle, isMobileMenuOpen }: DashboardHeaderProps) {
  return (
    <header className="purple-gradient shadow-lg border-b border-purple-300/30">
      <div className="mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="w-10 h-7 relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PF-FgdJMlTBze74Y6mdKI0AT4NeIf8X7s.png"
                alt="Purple Fit Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Purple Fit</h1>
              <p className="text-xs text-purple-100 hidden sm:block">Meal Planner</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-purple-100 hidden sm:block">Nutritionist Dashboard</span>
          </div>
        </div>
      </div>
    </header>
  )
}
