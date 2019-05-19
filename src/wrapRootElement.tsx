import React, { ReactNode } from "react";
import { StyledThemeProvider } from "./StyledThemeProvider";
import { ThemeManagerProvider } from "./ThemeManager";

interface GatsbyConfigProps {
  dark?: object;
  light?: object;
}

interface GatsbyRootProps {
  element: ReactNode;
}

interface Props {
  gatsbyProps: GatsbyRootProps;
  themeConfig: GatsbyConfigProps;
}

export const wrapRootElement = (props: Props) => {
  const {
    gatsbyProps: { element },
    themeConfig: { dark = {}, light = {} }
  } = props;

  return (
    <ThemeManagerProvider>
      <StyledThemeProvider lightTheme={light} darkTheme={dark}>
        {element}
      </StyledThemeProvider>
    </ThemeManagerProvider>
  );
};
