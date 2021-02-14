# Gatsby Styled-Components Dark Mode

A Gatsby plugin that handles injecting a dark and light theme using styled components

- Exposes functionality for toggling between dark and light theme
- Also allows for using the system's theme
- Automatically handles content flash when refreshing the page
- Persists the state of your users' dark options in their browsers.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![npm (tag)](https://img.shields.io/npm/v/gatsby-styled-components-dark-mode/latest)
![npm (tag)](https://img.shields.io/npm/v/gatsby-styled-components-dark-mode/next)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


## Installation

Install the package

` $ npm i gatsby-styled-components-dark-mode`

or

` $ yarn add gatsby-styled-components-dark-mode`

Add the plugin to your `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-styled-components-dark-mode`,
      options: {
        light: { mainColor: "brandyRose" },
        dark: { mainColor: "manatee" },
      },
    },
  ],
};
```

## Requirements

You must have the following installed in your gatsby project:

- [styled-components](https://www.styled-components.com/)
  - Use this [plugin](https://www.gatsbyjs.org/packages/gatsby-plugin-styled-components/?=gatsby%20styled%20com) for gatsby integration

## How to Use

The plugin expects **two** options in your `gatsby-config.js` file:

```javascript
light: object;
dark: object;
```

These objects are defined by _you_ in your project, so you have full control over your styling. Everything else is handled for you.

in a presumed `src/theme.js`

```javascript
export const darkTheme = {
  mainColor: "topaz",
  secondaryColor: "ruby",
};

export const lightTheme = {
  mainColor: "pampas",
  secondaryColor: "ruby",
  buttonColor: "shadyLady",
  // Note both themes don't necessary have to match (you'll probably want them to though)
};
```

in `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-styled-components-dark-mode`,
      options: {
        light: require(`${__dirname}/src/theme.js`).lightTheme,
        dark: require(`${__dirname}/src/theme.js`).darkTheme,
      },
    },
  ],
};
```

### Multiple files

You may want to keep your themes separate, thus you could do the following:

in `src/darkTheme.js`

```javascript
const darkTheme = {
  mainColor: "topaz",
  secondaryColor: "ruby",
};

export default darkTheme;
```

in `src/lightTheme.js`

```javascript
const lightTheme = {
  mainColor: "pampas",
  buttonColor: "shadyLady",
};

export default lightTheme;
```

in `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-styled-components-dark-mode`,
      options: {
        light: require(`${__dirname}/src/lightTheme.js`),
        dark: require(`${__dirname}/src/darkTheme.js`),
      },
    },
  ],
};
```

### Accessing the styles

We can now utilize the power of styled-components. Any component wrapped in a `styled` or `css` has access to your theme!

#### Inside of styled's template string `props`

```javascript
const MyLightOrDarkStyledComponent = styled.div`
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) => props.theme.secondaryColor};
`;
```

#### Using styled's `withTheme` higher-order component

```javascript
const MyThemedUpComponent = withTheme((props) => (
  <div styles={{ color: props.theme.mainColor }}>Hello world</div>
));
```

#### Using styled's `ThemeContext` to use as a hook

```javascript
import { ThemeContext } from "styled-components"

const MyThemedUpComponent = () => (
  const theme =  useContext(ThemeContext)

  <div styles={{ color: theme.mainColor }}>Hello world</div>
);
```

In `theme` you'll also have access to `isDark`

So you could do conditionally styling _inside_ your styled components if you wanted to

```javascript
const MyLightOrDarkStyledComponent = styled.div`
  color: ${(props) =>
    props.theme.isDark ? props.theme.darkColor : props.theme.lightColor};
`;
```

### Toggling the theme

Somewhere in your app, you'll want to provide functionality to actually change the theme from one theme to the other, or to respect the current system dark mode setting.

The plugin exposes this functionality through a hook `useStyledDarkMode`:

| prop               | type                            | description                                                                                                                                                                              |
| ------------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isDark             | boolean?                        | State that describes if your app is in dark mode or not. Notice this can be undefined since we don't know is dark until the provider can parse the initial styles after the first paint. |
| toggleDark         | (value?: boolean) => void       | Function that toggles dark/light mode.                                                                                                                                                   |
| themeSetting       | ThemeSetting                    | The current theme setting - either `ThemeSetting.LIGHT`, `ThemeSetting.DARK` or `ThemeSetting.SYSTEM`                                                                                    |
| changeThemeSetting | (setting: ThemeSetting) => void | Function that allows setting dark mode, light mode or system-setting mode                                                                                                                |

#### Example - light/dark mode toggle

in a presumed `src/component/layout.tsx`

```javascript
import { useStyledDarkMode } from "gatsby-styled-components-dark-mode";

export const Layout = (props) => {
  const { isDark } = useStyledDarkMode();

  return (
    <div>
      <label>
        <input
          type="checkbox"
          onChange={() => themeContext.toggleDark()}
          checked={!!isDark}
        />{" "}
        Dark mode
      </label>
    </div>
  );
};
```

#### Example - light/dark/system mode toggle

in a presumed `src/component/layout.tsx`

```javascript
import {
  useStyledDarkMode,
  ThemeSetting,
} from "gatsby-styled-components-dark-mode";

export const Layout = (props) => {
  const { changeThemeSetting } = useStyledDarkMode();
  const onThemeSettingChanged = (ev) => changeThemeSetting(ev.target.value);

  return (
    <div>
      <label>
        <input
          type="radio"
          value={ThemeSetting.LIGHT}
          onChange={onThemeSettingChanged}
          checked={themeContext.themeSetting == ThemeSetting.LIGHT}
        />{" "}
        Light mode
      </label>
      <br />
      <label>
        <input
          type="radio"
          value={ThemeSetting.DARK}
          onChange={onThemeSettingChanged}
          checked={themeContext.themeSetting == ThemeSetting.DARK}
        />{" "}
        Dark mode
      </label>
      <br />
      <label>
        <input
          type="radio"
          value={ThemeSetting.SYSTEM}
          onChange={onThemeSettingChanged}
          checked={themeContext.themeSetting == ThemeSetting.SYSTEM}
        />{" "}
        Use system setting
      </label>
    </div>
  );
};
```

### Global Styling

Until further notice, global styling requires a tad bit more overhead due to what styled-components' api offers.

Keep in mind, this is _not_ required, but is probably needed for theming.

Your theme already knows if it's dark/light so all you have to do is pass the theme object to a `createGlobalStyle` function

Check [the docs](https://www.styled-components.com/docs/api#createglobalstyle) for more info

#### Usage

in a presumed `src/theme.js`

```javascript
export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%; 
  }
  
  body {
    background-color: rgb(${(props) => props.theme.global.bg});
    color: rgb(${(props) => props.theme.global.color});
  }
  
  a {
    color: rgb(${(props) => props.theme.global.link});
  }
  
  a:hover {
    color: rgb(${(props) => props.theme.global.linkHover});
  }
  
  blockquote {
    color: inherit;
    border-left-color: inherit;
  }
`;
```

You'll probably want to render this in your root - `layout.jsx` is a good place to start

in `src/layout.jsx`

```javascript
import { ThemeContext } from "styled-components";
import { GlobalStyle } from "./theme";

export const Layout = (props) => {
  const theme = useContext(ThemeContext);
  return (
    <div>
      <GlobalStyle theme={theme} />
      // content
    </div>
  );
};
```

## Full Example

`gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-styled-components-dark-mode`,
      options: {
        light: require(`${__dirname}/src/theme.js`).lightTheme,
        dark: require(`${__dirname}/src/theme.js`).darkTheme,
      },
    },
  ],
};
```

`src/theme.js`

```javascript
import { createGlobalStyle } from "styled-components";

// I'm using rgb numbers here for easily using rgba styling throughout the app
// You can put hexcodes, names, or any other definitions that fits the context of your app
const colorPalette = {
  lightShades: "242, 242, 241",
  lightAccent: "139, 142, 149",
  mainBrand: "140, 100, 88",
  darkAccent: "133, 129, 137",
  darkShades: "32, 30, 32",

  success: "95, 153, 81",
  warning: "221, 136, 25",
  error: "244, 67, 54",
};

const baseTheme = {
  actions: {
    error: colorPalette.error,
    info: colorPalette.darkShades,
    primary: colorPalette.mainBrand,
    success: colorPalette.success,
    warning: colorPalette.warning,
  },
  palette: {
    darkAccent: colorPalette.darkAccent,
    darkShades: colorPalette.darkShades,
    lightAccent: colorPalette.lightAccent,
    lightShades: colorPalette.lightShades,
    mainBrand: colorPalette.mainBrand,
  },
};

export const darkTheme = {
  ...baseTheme,
  global: {
    bg: colorPalette.darkShades,
    color: colorPalette.lightShades,
    link: colorPalette.mainBrand,
    linkHover: colorPalette.lightAccent,
  },
};

export const lightTheme = {
  ...baseTheme,
  global: {
    bg: colorPalette.lightShades,
    color: colorPalette.darkShades,
    link: colorPalette.mainBrand,
    linkHover: colorPalette.darkAccent,
  },
};

export const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%; 
  }
  body {
    background-color: rgb(${(props) => props.theme.global.bg});
    color: rgb(${(props) => props.theme.global.color});
    
    transition: background 0.2s ease-out;
  }
  
  a {
    color: rgb(${(props) => props.theme.global.link});
  }
  
  a:hover {
    color: rgb(${(props) => props.theme.global.linkHover});
  }
`;
```

`src/layout.js`

```javascript
import { useStyledDarkMode } from "gatsby-styled-components-dark-mode";
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { GlobalStyle } from "./theme";

const MainHeading = styled.h2`
  color: rgb(${(props) => props.theme.palette.mainBrand});
`;

export const Layout = (props) => {
  const theme = useContext(ThemeContext);
  const { isDark, toggleDark } = useStyledDarkMode();

  return (
    <div>
      <GlobalStyle theme={theme} />
      <header>
        <MainHeading>
          <a href={"#"}>Gatsby Dark Theme</a>
        </MainHeading>
        <div>
          <label>
            <input
              type="checkbox"
              onChange={() => toggleDark()}
              checked={!!isDark}
            />{" "}
            Dark mode
          </label>
        </div>
      </header>
      <main>{props.children}</main>
    </div>
  );
};
```

### Typescript Example

https://github.com/gperl27/website

## Roadmap

- ~~typescript~~

- hot-reload

Currently, when changing a theme, the app will recompile but _will not_ hot reload. You have to do a full page-refresh to see your theming changes.

- improved global styling

Ideally, I would like to pass `{ global: "path/to/globalStyles }` where these styles can get interpolated/compiled into something that's friendly enough for styled-components' `createGlobalStyle` api.

- live demo

- default theme setup or scaffolding if people want it

## Contributing

This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and leverages [semantic release](https://github.com/semantic-release/semantic-release) for versioning and distribution. It uses these tools out of the box.

### Distribution channels

- master
  - Reflects current stable release under the `latest` tag
- next
  - Reflects experimental release under the `next` tag
