import React from "react";
import { createContext, useEffect, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface ThemeManager {
  isDark: boolean;

  toggleDark(): void;
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

  const toggleDark = () => {
    const toggledTheme = !isDark;
    setIsDark(toggledTheme);
    localStorage.setItem("dark", JSON.stringify(toggledTheme));
  };

  useEffect(() => {
    const localStorageTheme = localStorage.getItem("dark");
    const latestTheme = localStorageTheme && JSON.parse(localStorageTheme);
    if (latestTheme) {
      setIsDark(latestTheme);
    } else if (supportsDarkMode() && latestTheme) {
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
