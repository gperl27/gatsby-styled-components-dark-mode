import React, { useContext } from "react"
import { ThemeProvider } from "styled-components"
import { ThemeManagerContext } from "./ThemeManager"

export const StyledThemeProvider = ({ children, darkTheme, lightTheme }) => {
  const themeManagerContext = useContext(ThemeManagerContext)

  const isDark = themeManagerContext.isDark
  const currentTheme = isDark ? darkTheme : lightTheme
  const theme = { ...currentTheme, isDark }

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}
