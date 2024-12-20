# mui-icons-material-lazy

The idea behind this NPM lib is to be ables to use [the `@mui/icons-material` catalog of icons](https://mui.com/material-ui/material-icons/) even if
the icons that will be used aren't known at build time.

Since including all 2000+ icons in the bundle would make the bundle size explode there is a need for a solution that enables to load the icons lazily
when they are needed.

It's a requirement we have for the [Onyxia project](https://github.com/InseeFrLab/onyxia) because the web application is distributed as a white-labeled
statical SPA. People that deploy an onyxia instance [can customize the look of onyxia](https://docs.onyxia.sh/admin-doc/theme) via injecting standardized
environnement variable.  
This means that we can't know at build time which icons will be used.

# Usage

```bash
yarn add mui-icons-material-lazy
```

`package.json`

```jsonc
{
    "scripts": {
        "postinstall": "mui-icons-material-lazy postinstall"
        // If you are in a monorepo you can specify your SPA (Vite or CRA) project path like:
        // "postinstall": "mui-icons-material-lazy postinstall --project packages/front
    }
}
```

```tsx
import { createGetIconUrl } from "mui-icons-material-lazy";

const { getIconUrl, getIconUrlByName } = createGetIconUrl({
    BASE_URL: import.meta.env.BASE_URL
    // Or if you are in create-react-app:
    // BASE_URL: process.env.PUBLIC_URL,
    // Or if you have a custom build setup:
    // BASE_URL: "/",
});

// Let's say we have this variable that isn't known at build time:
declare const HOME_ICON: string | undefined;

getIconUrl(HOME_ICON); // The return type is `string | undefined`
// If HOME_ICON is "https://example.net/my-icon.svg":   "https://example.net/my-icon.svg"
// If HOME_ICON is "Home" or "home":                    "https://my-app.com/mui-icons-material/Home.svg"

// Implementing fallback:

// iconUrl is of type `string`
const iconUrl = getIconUrl(HOME_ICON) ?? getIconUrlByName("Home");
```

## Usage in `onyxia-ui`

`src/lazy-icons`

```tsx
export const { getIconUrl, getIconUrlByName } = createGetIconUrl({
    BASE_URL: import.meta.env.BASE_URL
});
```

In a component:

```tsx
import { Icon } from "onyxia-ui/Icon";
// Absolute import using ts-config-paths and baseUrl: "./src"
import { getIconUrl, getIconUrlByName } from "lazy-icons";

declare const SOME_ICON: string;

<Icon icon={getIconUrl(SOME_ICON)} />;

declare const MAYBE_SOME_ICON: string | undefined;

<Icon icon={getIconUrl(MAYBE_SOME_ICON) ?? getIconUrlByName("Home")} />;
```
