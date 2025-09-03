"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, UtensilsCrossed, Calendar } from "lucide-react"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/dashboard/food-entries",
    label: "Food Entries",
    icon: UtensilsCrossed,
  },
  {
    href: "/dashboard/meal-plans",
    label: "Meal Plans",
    icon: Calendar,
  },
]

interface DashboardNavProps {
  isMobileMenuOpen?: boolean
  onItemClick?: () => void
}

export function DashboardNav({ isMobileMenuOpen, onItemClick }: DashboardNavProps) {
  const pathname = usePathname()

  return (
    <>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onItemClick} />}

      <nav
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r transform transition-transform duration-300 ease-in-out md:transform-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 pt-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      pathname === item.href
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700",
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </>
  )
}
