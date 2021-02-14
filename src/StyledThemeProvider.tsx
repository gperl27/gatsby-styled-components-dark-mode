import React, { ReactNode, useContext } from "react";
import { ThemeProvider } from "styled-components";
import { ThemeManagerContext } from "./ThemeManager";

interface Props {
  children: ReactNode;
  darkTheme: Record<string, unknown>;
  lightTheme: Record<string, unknown>;
}

export const StyledThemeProvider = (props: Props) => {
  const { children, darkTheme, lightTheme } = props;
  const { isDark, didLoad } = useContext(ThemeManagerContext);
  const currentTheme = isDark ? darkTheme : lightTheme;
  const theme = {
    isDark,
    ...(didLoad ? currentTheme : transformTheme(currentTheme)),
  };

  return (
    <ThemeProvider theme={theme}>
      <>{children}</>
    </ThemeProvider>
  );
};

const transformTheme = (theme: Record<string, unknown>) => {
  const newTheme: { [key: string]: string | Record<string, unknown> } = {};
  Object.keys(theme).forEach((key) => {
    const value = theme[key];
    if (typeof value === "object" && !!value) {
      newTheme[key] = transformTheme(
        value as { [key: string]: Record<string, unknown> }
      );
    } else {
      newTheme[key] = `var(--${key})`;
    }
  });

  return newTheme;
};
