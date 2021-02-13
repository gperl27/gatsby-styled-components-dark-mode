import React, { ReactNode, useContext } from "react";
import { ThemeProvider } from "styled-components";
import { ThemeManagerContext } from "./ThemeManager";

interface Props {
  children: ReactNode;
  darkTheme: object;
  lightTheme: object;
}

export const StyledThemeProvider = (props: Props) => {
  const { children, darkTheme, lightTheme } = props;
  const { isDark, didLoad } = useContext(ThemeManagerContext);
  const currentTheme = isDark ? darkTheme : lightTheme;
  const theme = {
    isDark,
    ...(didLoad ? currentTheme : transformTheme(currentTheme))
  }

  return (
    <ThemeProvider theme={theme}>
      <>{children}</>
    </ThemeProvider>
  );
};

const transformTheme = (theme: { [key: string]: any }) => {
  const newTheme: { [key: string]: any } = {}
  Object.keys(theme).forEach(key => {
    if (typeof theme[key] === 'object') {
      newTheme[key] = transformTheme(theme[key])
    } else {
      newTheme[key] = `var(--${key})`
    }
  })

  return newTheme
}