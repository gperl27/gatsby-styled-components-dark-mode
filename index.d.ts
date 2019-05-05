import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface ThemeManager {
  isDark: boolean

  toggleDark(): void
}

export declare const ThemeManagerContext: React.Context<ThemeManager>
declare const ThemeManagerProvider: (props: Props) => JSX.Element
export { ThemeManagerProvider }
