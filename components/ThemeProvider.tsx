"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext<{theme: string, setTheme: (t: string) => void}>({theme: "dark", setTheme: () => {}})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fintree_theme")
      if (saved) setTheme(saved)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fintree_theme", theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  )
} 