import React from "react"
import { createContext, useEffect, useState } from "react"

const defaultState = {
  isDark: false,
  toggleDark: () => undefined,
}

export const ThemeManagerContext = createContext(defaultState)

const supportsDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches

export const ThemeManagerProvider = (props) => {
  const [isDark, setIsDark] = useState(false)

  const toggleDark = () => {
    const toggledTheme = !isDark
    setIsDark(toggledTheme)
    localStorage.setItem("dark", JSON.stringify(toggledTheme))
  }

  useEffect(() => {
    const localStorageTheme = localStorage.getItem("dark")
    const latestTheme = localStorageTheme && JSON.parse(localStorageTheme)
    if (latestTheme) {
      setIsDark(latestTheme)
    } else if (supportsDarkMode()) {
      setIsDark(true)
    }
  }, [])

  return (
    <ThemeManagerContext.Provider
      value={{
        isDark,
        toggleDark,
      }}
    >
      {props.children}
    </ThemeManagerContext.Provider>
  )
}
