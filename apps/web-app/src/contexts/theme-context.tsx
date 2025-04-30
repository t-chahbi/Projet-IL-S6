"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTheme } from "next-themes"

type ThemeContextType = {
  currentTheme: string
  setTheme: (theme: string) => void
  isNeonTheme: boolean
  isLightTheme: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "dark",
  setTheme: () => {},
  isNeonTheme: false,
  isLightTheme: false,
})

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme: setNextTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string>("dark")
  const [isNeonTheme, setIsNeonTheme] = useState<boolean>(false)
  const [isLightTheme, setIsLightTheme] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && theme) {
      setCurrentTheme(theme)
      setIsNeonTheme(theme === "neon-blue")
      setIsLightTheme(theme === "light")
    }
  }, [theme, mounted])

  const handleSetTheme = (newTheme: string) => {
    setNextTheme(newTheme)
  }

  // Retourner un contexte vide pendant le rendu côté serveur
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        isNeonTheme,
        isLightTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => useContext(ThemeContext)
