import React from "react";
import { createContext, useEffect, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface ThemeManager {
  isDark: boolean;

  toggleDark(value?: boolean): void;
}

const defaultState: ThemeManager = {
  isDark: false,
  toggleDark: () => undefined
};

export const ThemeManagerContext = createContext(defaultState);

const supportsDarkMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const ThemeManagerProvider = (props: Props) => {
  const [isDark, setIsDark] = useState(false);

  const toggleDark = (value?: boolean) => {
    const toggledTheme = value ?? !isDark;
    setIsDark(toggledTheme);
    localStorage.setItem("dark", JSON.stringify(toggledTheme));
  };

  useEffect(() => {
    const themeFromLocalStorage = localStorage.getItem("dark");

    if (typeof themeFromLocalStorage === 'string') {
      setIsDark(JSON.parse(themeFromLocalStorage));
    } else if (supportsDarkMode()) {
      setIsDark(true);
    }
  }, []);

  return (
    <ThemeManagerContext.Provider
      value={{
        isDark,
        toggleDark
      }}
    >
      {props.children}
    </ThemeManagerContext.Provider>
  );
};
