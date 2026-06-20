"use client"

import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme/provider"

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}
