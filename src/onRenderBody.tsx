import React from "react";
import { DarkThemeKey, ThemeSetting } from "./ThemeManager";
import { ThemeConfigProps } from "./wrapRootElement";
import { RenderBodyArgs } from "gatsby";

const MagicScriptTag = (props: { theme: ThemeConfigProps }) => {
  const codeToRunOnClient = `
        (function() {
            const themeFromLocalStorage = localStorage.getItem('${DarkThemeKey}') || '${
    ThemeSetting.SYSTEM
  }';
            const systemDarkModeSetting = () => window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
            const isDarkModeActive = () => {
                return !!systemDarkModeSetting()?.matches;
            };
            let colorMode;
            switch (themeFromLocalStorage) {
                case '${ThemeSetting.SYSTEM}': {
                  colorMode = isDarkModeActive() ? '${ThemeSetting.DARK}' : '${
    ThemeSetting.LIGHT
  }'
                  break
                }
                case '${ThemeSetting.DARK}':
                case '${ThemeSetting.LIGHT}':
                  colorMode = themeFromLocalStorage
                  break
                default:
                    colorMode = '${ThemeSetting.LIGHT}'
              }

            const root = document.documentElement;

            const iterate = (obj) => {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'object') {
                        iterate(obj[key])
                    } else {
                        root.style.setProperty(
                            "--" + key,
                            obj[key]
                        )
                    }
                })
            }

            const parsedTheme = JSON.parse('${JSON.stringify(props.theme)}')
            const theme = parsedTheme[colorMode]

            iterate(theme)
            root.style.setProperty('--initial-color-mode', colorMode);
        })()
    `;

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
};

export const onRenderBody = (
  { setPreBodyComponents }: RenderBodyArgs,
  theme: ThemeConfigProps
) => {
  setPreBodyComponents([
    <MagicScriptTag key="theme-injection" theme={theme} />,
  ]);
};
