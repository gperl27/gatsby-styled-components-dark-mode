import React from "react";
import { createContext, useEffect, useState, ReactNode } from "react";

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
  toggleDark(value?: boolean): void;
  
  themeSetting: ThemeSetting;
  changeThemeSetting: (setting: ThemeSetting) => void;
}

const defaultState: ThemeManager = {
  isDark: false,
  toggleDark: () => undefined,
  
  themeSetting: ThemeSetting.SYSTEM,
  changeThemeSetting: (_: ThemeSetting) => undefined,
};

export const ThemeManagerContext = createContext(defaultState);

const systemDarkModeSetting = () => window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const isDarkModeActive = () => {
  // Assume that dark mode is not active if there's no system dark mode setting available
  if (systemDarkModeSetting()?.matches) {
    return true;
  }

  return false;
};

export const ThemeManagerProvider = (props: Props) => {
  const [isDark, setIsDark] = useState(false);
  const [themeSetting, setThemeSetting] = useState(ThemeSetting.SYSTEM);

  const toggleDark = (value?: boolean) => {
    const toggledTheme = value ?? !isDark;
    setThemeSetting(toggledTheme ? ThemeSetting.DARK : ThemeSetting.LIGHT);
  };

  const changeThemeSetting = (setting: ThemeSetting) => {
    setThemeSetting(setting);
    localStorage.setItem(DarkThemeKey, setting);
  };

  useEffect(() => {
    // Add a listener to the dark mode setting
    const listener = (e: MediaQueryListEvent) => {
      if (themeSetting == ThemeSetting.SYSTEM) {
        setIsDark(e.matches);
      }
    };

    systemDarkModeSetting()?.addListener(listener);
    return () => systemDarkModeSetting()?.removeListener(listener);
  }, []);

  useEffect(() => {
    // Set dark mode to active if the theme setting is specifically dark, or if the current system setting for dark mode is active
    setIsDark(themeSetting == ThemeSetting.DARK || !!(themeSetting == ThemeSetting.SYSTEM && isDarkModeActive()));
  }, [themeSetting]);

  useEffect(() => {
    const themeFromLocalStorage = localStorage.getItem(DarkThemeKey);

    if (typeof themeFromLocalStorage === 'string') {
      if (themeFromLocalStorage in ThemeSetting) {
        setThemeSetting(themeFromLocalStorage as ThemeSetting);
      } else {
        // Fallback if the stored theme is the legacy "true"/"false"
        setThemeSetting(JSON.parse(themeFromLocalStorage) ? ThemeSetting.DARK : ThemeSetting.LIGHT);
      }

      return;
    }

    // If there's no stored setting, set the theme to use the system's current setting
    changeThemeSetting(isDarkModeActive() ? ThemeSetting.DARK : ThemeSetting.LIGHT);
  }, []);

  return (
    <ThemeManagerContext.Provider
      value={{
        isDark,
        toggleDark,
        themeSetting,
        changeThemeSetting,
      }}
    >
      {props.children}
    </ThemeManagerContext.Provider>
  );
};
