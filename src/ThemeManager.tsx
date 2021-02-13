import React from "react";
import { createContext, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export enum ThemeSetting {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export const DarkThemeKey = 'theme';

interface ThemeManager {
  isDark?: boolean;
  themeSetting: ThemeSetting;
  toggleDark(value?: boolean): void;
  changeThemeSetting: (setting: ThemeSetting) => void;
  didLoad: boolean
}

const defaultState: ThemeManager = {
  isDark: undefined,
  didLoad: false,
  themeSetting: ThemeSetting.SYSTEM,
  toggleDark: () => undefined,
  changeThemeSetting: (_: ThemeSetting) => undefined,
};

export const ThemeManagerContext = createContext(defaultState);

const systemDarkModeSetting = () => window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const isDarkModeActive = () => {
  // Assume that dark mode is not active if there's no system dark mode setting available
  return !!systemDarkModeSetting()?.matches;
};

export const ThemeManagerProvider = (props: Props) => {
  const [themeSetting, setThemeSetting] = useState(ThemeSetting.SYSTEM);
  const [didLoad, setDidLoad] = useState(false);
  const [isDark, setIsDark] = React.useState<boolean | undefined>();

  React.useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      '--initial-color-mode'
    );

    setIsDark(initialColorValue === ThemeSetting.DARK);
    setDidLoad(true)
  }, []);

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
        break
    }
    setThemeSetting(setting);
    localStorage.setItem(DarkThemeKey, setting)
  }

  return (
    <ThemeManagerContext.Provider
      value={{
        isDark,
        toggleDark,
        themeSetting,
        changeThemeSetting,
        didLoad
      }}
    >
      {props.children}
    </ThemeManagerContext.Provider>
  );
};
