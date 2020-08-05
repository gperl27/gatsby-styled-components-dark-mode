import React, { ReactNode, useEffect, useState } from "react";
import { ThemeManagerContext } from "./ThemeManager";

interface InitialBootLoaderProps {
  children: ReactNode;
}

export function InitialBootLoader(props: InitialBootLoaderProps) {
  const context = React.useContext(ThemeManagerContext);
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    context.initThemeFromStorage();
    setDidLoad(true);
  }, []);

  if (!didLoad) {
    return null;
  }

  return <>{props.children}</>;
}
