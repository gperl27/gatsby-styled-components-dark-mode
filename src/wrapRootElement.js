import React from "react"
import { StyledThemeProvider } from "./StyledThemeProvider"
import { ThemeManagerProvider } from "./ThemeManager"

export const wrapRootElement = (
  { element },
  { dark = {}, light = {} },
) => {
  return (
    <ThemeManagerProvider>
      <StyledThemeProvider lightTheme={light} darkTheme={dark}>
        {element}
      </StyledThemeProvider>
    </ThemeManagerProvider>
  )
}
