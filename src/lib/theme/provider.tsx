import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const StorageKey = "theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light"
  }

  const stored = localStorage.getItem(StorageKey)
  if (stored === "light" || stored === "dark") {
    return stored
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }

  return "light"
}

function applyThemeClass(theme: Theme) {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    applyThemeClass(theme)
    localStorage.setItem(StorageKey, theme)
  }, [theme])

  useEffect(() => {
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
