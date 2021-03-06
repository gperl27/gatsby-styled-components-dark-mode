import { useContext } from "react";
import { ThemeManagerContext } from "./ThemeManager";

export const useStyledDarkMode = () => {
  const { isDark, changeThemeSetting, toggleDark, themeSetting } = useContext(
    ThemeManagerContext
  );

  return {
    isDark,
    changeThemeSetting,
    toggleDark,
    themeSetting,
  };
};
