import { createContext, use, useMemo, useSyncExternalStore } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
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

function getServerSnapshot(): Theme {
  return "light"
}

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback)
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  const listener = () => callback()
  mediaQuery.addEventListener("change", listener)
  return () => {
    window.removeEventListener("storage", callback)
    mediaQuery.removeEventListener("change", listener)
  }
}

function getSnapshot(): Theme {
  return getInitialTheme()
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  const setTheme = useMemo(
    () => (newTheme: Theme) => {
      localStorage.setItem(StorageKey, newTheme)
      applyThemeClass(newTheme)
    },
    [],
  )

  const toggleTheme = useMemo(
    () => () => {
      const next = theme === "light" ? "dark" : "light"
      setTheme(next)
    },
    [theme, setTheme],
  )

  const value = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
