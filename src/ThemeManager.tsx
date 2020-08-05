import React from "react";
import { createContext, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export enum ThemeSetting {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

const DarkThemeKey = 'dark';

interface ThemeManager {
  isDark: boolean;
  themeSetting: ThemeSetting;
  toggleDark(value?: boolean): void;
  changeThemeSetting: (setting: ThemeSetting) => void;
  initThemeFromStorage: () => void
}

const defaultState: ThemeManager = {
  isDark: false,
  toggleDark: () => undefined,

  themeSetting: ThemeSetting.SYSTEM,
  changeThemeSetting: (_: ThemeSetting) => undefined,
  initThemeFromStorage: () => undefined
};

export const ThemeManagerContext = createContext(defaultState);

const systemDarkModeSetting = () => window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const isDarkModeActive = () => {
  // Assume that dark mode is not active if there's no system dark mode setting available
  return !!systemDarkModeSetting()?.matches;
};

export const ThemeManagerProvider = (props: Props) => {
  const [isDark, setIsDark] = useState(false);
  const [themeSetting, setThemeSetting] = useState(ThemeSetting.SYSTEM);

  const toggleDark = (value?: boolean) => {
    const newIsDark = value ?? !isDark
    const theme = newIsDark ? ThemeSetting.DARK : ThemeSetting.LIGHT
    setIsDark(newIsDark)
    setThemeSetting(theme)
    localStorage.setItem(DarkThemeKey, theme)
  };

  const changeThemeSetting = (setting: ThemeSetting) => {
    switch (setting) {
      case ThemeSetting.SYSTEM: {
        setIsDark(isDarkModeActive())
        break
      }
      case ThemeSetting.LIGHT:
      case ThemeSetting.DARK:
        setIsDark(setting === ThemeSetting.DARK)
    }
    setThemeSetting(setting);
    localStorage.setItem(DarkThemeKey, setting)
  }

  const initThemeFromStorage = () => {
    const themeFromLocalStorage = localStorage.getItem(DarkThemeKey);

    if (!themeFromLocalStorage) {
      setIsDark(isDarkModeActive())

      return
    }

    if (themeFromLocalStorage in ThemeSetting) {
      changeThemeSetting(themeFromLocalStorage as ThemeSetting)
    } else {
      // Fallback if the stored theme is the legacy "true"/"false"
      changeThemeSetting(JSON.parse(themeFromLocalStorage) ? ThemeSetting.DARK : ThemeSetting.LIGHT)
    }
  }

  return (
    <ThemeManagerContext.Provider
      value={{
        isDark,
        toggleDark,
        themeSetting,
        changeThemeSetting,
        initThemeFromStorage
      }}
    >
      {props.children}
    </ThemeManagerContext.Provider>
  );
};
