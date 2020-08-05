import React, { ReactNode } from "react";
import { StyledThemeProvider } from "./StyledThemeProvider";
import { ThemeManagerProvider } from "./ThemeManager";
import { InitialBootLoader } from "./InitialBootLoader";

interface ThemeConfigProps {
  dark?: object;
  light?: object;
}

interface GatsbyRootProps {
  element: ReactNode;
}

export const wrapRootElement = (
  gatsbyRootProps: GatsbyRootProps,
  themeProps: ThemeConfigProps
) => {
  const { dark = {}, light = {} } = themeProps;

  return (
    <ThemeManagerProvider>
      <InitialBootLoader>
        <StyledThemeProvider lightTheme={light} darkTheme={dark}>
          {gatsbyRootProps.element}
        </StyledThemeProvider>
      </InitialBootLoader>
    </ThemeManagerProvider>
  );
};
