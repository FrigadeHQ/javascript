# Frigade React SDK V2

### 🚨🚧 This package is currently in beta 🚧🚨

If you're looking for the full / stable version of Frigade that we all know and love, head over to our main [React SDK](https://github.com/FrigadeHQ/javascript/tree/main/packages/react).

We're building our new version in public so that you can have a look around if you'd like, contribute ideas, and test out how our new features will integrate into your existing Frigade setup.

If you have any questions about V2 not covered in these docs, don't hesitate to [reach out](mailto:hello@frigade.com).

&nbsp;

# Quickstart

While you're testing out the V2 beta, you'll likely still want to run V1 alongside it to cover anything V2 doesn't support yet.

In order to run both versions of the Frigade React SDK at the same time, add V2 to your package.json with an alias:

```json
"dependencies": [
  "@frigade/react": "1.38.17",
  "@frigade/react/v2": "npm:@frigade/react@2.0.0-alpha.8",
]
```

Next, add the V2 `<Provider>` component to your app above the V1 `<FrigadeProvider>`:

```ts
import { FrigadeProvider } from '@frigade/react'
import * as Frigade from '@frigade/react/v2'

const FRIGADE_API_KEY = 'api_public_abcd1234'

export const App = () => {
  const userId = '...'

  return (
    <Frigade.Provider apiKey={FRIGADE_API_KEY} config={{ userId }}>
      <FrigadeProvider publicApiKey={FRIGADE_API_KEY} userId={userId}>
        {/* ... */}
      </FrigadeProvider>
    </Frigade.Provider>
  )
}
```

That's pretty much it. You can now use V2 components:

```ts
import * as Frigade from '@frigade/react/v2'

export const DemoComponent = () => {
  return <Frigade.Tour flowId="flow_abcd1234" />
}
```

&nbsp;

# Components

### Provider

This is the base context provider for Frigade. It holds your configuration and theme.

You should place this as high in your component tree as possible.

```tsx
<Frigade.Provider
  apiKey="Your public API key"
  userId="External user id"
  navigate={(primaryButtonUri: string, primaryButtonUriTarget: string) => {
    /*
      Called in default onPrimary and onSecondary event handlers
      when a Flow/Step has a primaryButtonUri or secondaryButtonUri.

      Override this function to add custom routing behavior for URIs in Flows.
    */
  }}
  // See "Appendix: Default theme" below for full theme spec
  theme={{
    colors: {
      primary: {
        foreground: '#f00',
      },
    },
  }}
>
  {/* ... */}
</Frigade.Provider>
```

### Tour

By popular demand, the first Component we ported to V2!

This one has a doozy of a type def so let's just link to that and explain it briefly:

https://github.com/FrigadeHQ/javascript/blob/main/packages/reactv2/src/components/Tour/index.tsx

TL;DR:

```tsx
<Frigade.Tour
  css={/* See "Appendix: CSS prop" */}

  // The Flow ID of the Tour in Frigade
  flowId="flow_1234abcd"

  // Called when the flow state changes to "complete"
  onComplete={(flow: Flow) => boolean | void}

  // Called when the user clicks the Dismiss button
  onDismiss={(flow: Flow, event?: MouseEvent<unknown>) => boolean | void}

  // Called when the user clicks the Primary button
  onPrimary={(step: FlowStep, event?: MouseEvent<unknown>) => boolean | void}

  // Called when the user clicks the Secondary button
  onSecondary={(step: FlowStep, event?: MouseEvent<unknown>) => boolean | void}

  // Dim the rest of the screen around the element that the current Tour step is attached to
  spotlight={true}

  /*

  Since we use Radix, Tour extends Radix.Popover's props as well. We pass the following props directly through to Radix:

  Passed to Popover.Root: Pick<Popover.PopoverProps, 'defaultOpen' | 'modal' | 'onOpenChange' | 'open'>
  Passed to Popover.Content: Omit<Popover.PopoverContentProps, 'align' | 'asChild'>

  One important note is that we add "before" and "after" as align options, in addition to the stock Radix options of "start", "center", and "end":

  align={Popover.PopoverContentProps['align'] | 'before' | 'after'}

  For the full reference, see: https://www.radix-ui.com/primitives/docs/components/popover

  */
/>
```

&nbsp;

# Appendix

### CSS prop / style overrides

We use [Emotion's css prop](https://emotion.sh/docs/css-prop#use-the-css-prop) under the hood on our components. You can pass a `css` object in at the top level of any of our components to create scoped styles for that specific instance of that component.

We also assign stable class names to each internal part of each component, to make style overrides as easy as:

```tsx
<Frigade.Tour
  css={{
    '.fr-tooltip-content .fr-tooltip-close': {
      backgroundColor: 'pink',
    },
    '.fr-button-primary': {
      backgroundColor: 'fuchsia',
    },
  }}
/>
```

To find the stable class names for any given component, you can either:

1. Inspect the component in your browser's dev tools and look for classes prefixed with `fr-`
2. [Read the source](https://github.com/FrigadeHQ/javascript/tree/main/packages/reactv2/src/components) for the component and use the value of the `part` prop (class name will always be `fr-${part}`)

&nbsp;

### Default theme

Frigade components are built on our internal design system and come pre-wired with a full set of themeable design tokens.

The object passed to the `theme` prop in `Provider` will be merged with our defaults, so you only need to override the tokens that you want to change.

See the **CSS Variables** appendix below for the default values of each `--fr` CSS property.

<details>
<summary>View full theme object</summary>

```json
{
  "borders": { "md": "var(--fr-borders-md)" },
  "borderWidths": {
    "0": "var(--fr-borderWidths-0)",
    "md": "var(--fr-borderWidths-md)"
  },
  "colors": {
    "black": "var(--fr-colors-black)",
    "gray100": "var(--fr-colors-gray100)",
    "gray200": "var(--fr-colors-gray200)",
    "gray300": "var(--fr-colors-gray300)",
    "gray400": "var(--fr-colors-gray400)",
    "gray500": "var(--fr-colors-gray500)",
    "gray600": "var(--fr-colors-gray600)",
    "gray700": "var(--fr-colors-gray700)",
    "gray800": "var(--fr-colors-gray800)",
    "gray900": "var(--fr-colors-gray900)",
    "white": "var(--fr-colors-white)",
    "blue400": "var(--fr-colors-blue400)",
    "blue500": "var(--fr-colors-blue500)",
    "blue800": "var(--fr-colors-blue800)",
    "blue900": "var(--fr-colors-blue900)",
    "green400": "var(--fr-colors-green400)",
    "green500": "var(--fr-colors-green500)",
    "green800": "var(--fr-colors-green800)",
    "transparent": "var(--fr-colors-transparent)",
    "inherit": "var(--fr-colors-inherit)",
    "red500": "var(--fr-colors-red500)",
    "neutral": {
      "background": "var(--fr-colors-neutral-background)",
      "border": "var(--fr-colors-neutral-border)",
      "foreground": "var(--fr-colors-neutral-foreground)",
      "surface": "var(--fr-colors-neutral-surface)",
      "active": {
        "background": "var(--fr-colors-neutral-active-background)",
        "border": "var(--fr-colors-neutral-active-border)",
        "foreground": "var(--fr-colors-neutral-active-foreground)",
        "surface": "var(--fr-colors-neutral-active-surface)"
      },
      "focus": {
        "background": "var(--fr-colors-neutral-focus-background)",
        "border": "var(--fr-colors-neutral-focus-border)",
        "foreground": "var(--fr-colors-neutral-focus-foreground)",
        "surface": "var(--fr-colors-neutral-focus-surface)"
      },
      "hover": {
        "background": "var(--fr-colors-neutral-hover-background)",
        "border": "var(--fr-colors-neutral-hover-border)",
        "foreground": "var(--fr-colors-neutral-hover-foreground)",
        "surface": "var(--fr-colors-neutral-hover-surface)"
      }
    },
    "primary": {
      "background": "var(--fr-colors-primary-background)",
      "border": "var(--fr-colors-primary-border)",
      "foreground": "var(--fr-colors-primary-foreground)",
      "surface": "var(--fr-colors-primary-surface)",
      "active": {
        "background": "var(--fr-colors-primary-active-background)",
        "border": "var(--fr-colors-primary-active-border)",
        "foreground": "var(--fr-colors-primary-active-foreground)",
        "surface": "var(--fr-colors-primary-active-surface)"
      },
      "focus": {
        "background": "var(--fr-colors-primary-focus-background)",
        "border": "var(--fr-colors-primary-focus-border)",
        "foreground": "var(--fr-colors-primary-focus-foreground)",
        "surface": "var(--fr-colors-primary-focus-surface)"
      },
      "hover": {
        "background": "var(--fr-colors-primary-hover-background)",
        "border": "var(--fr-colors-primary-hover-border)",
        "foreground": "var(--fr-colors-primary-hover-foreground)",
        "surface": "var(--fr-colors-primary-hover-surface)"
      }
    },
    "secondary": {
      "background": "var(--fr-colors-secondary-background)",
      "border": "var(--fr-colors-secondary-border)",
      "foreground": "var(--fr-colors-secondary-foreground)",
      "surface": "var(--fr-colors-secondary-surface)",
      "active": {
        "background": "var(--fr-colors-secondary-active-background)",
        "border": "var(--fr-colors-secondary-active-border)",
        "foreground": "var(--fr-colors-secondary-active-foreground)",
        "surface": "var(--fr-colors-secondary-active-surface)"
      },
      "focus": {
        "background": "var(--fr-colors-secondary-focus-background)",
        "border": "var(--fr-colors-secondary-focus-border)",
        "foreground": "var(--fr-colors-secondary-focus-foreground)",
        "surface": "var(--fr-colors-secondary-focus-surface)"
      },
      "hover": {
        "background": "var(--fr-colors-secondary-hover-background)",
        "border": "var(--fr-colors-secondary-hover-border)",
        "foreground": "var(--fr-colors-secondary-hover-foreground)",
        "surface": "var(--fr-colors-secondary-hover-surface)"
      }
    }
  },
  "fontFamilies": { "default": "var(--fr-fontFamilies-default)" },
  "fontSizes": {
    "xs": "var(--fr-fontSizes-xs)",
    "sm": "var(--fr-fontSizes-sm)",
    "md": "var(--fr-fontSizes-md)",
    "lg": "var(--fr-fontSizes-lg)",
    "xl": "var(--fr-fontSizes-xl)",
    "2xl": "var(--fr-fontSizes-2xl)",
    "3xl": "var(--fr-fontSizes-3xl)",
    "4xl": "var(--fr-fontSizes-4xl)",
    "5xl": "var(--fr-fontSizes-5xl)"
  },
  "fontWeights": {
    "thin": "var(--fr-fontWeights-thin)",
    "extralight": "var(--fr-fontWeights-extralight)",
    "light": "var(--fr-fontWeights-light)",
    "regular": "var(--fr-fontWeights-regular)",
    "medium": "var(--fr-fontWeights-medium)",
    "demibold": "var(--fr-fontWeights-demibold)",
    "bold": "var(--fr-fontWeights-bold)",
    "extrabold": "var(--fr-fontWeights-extrabold)",
    "black": "var(--fr-fontWeights-black)"
  },
  "letterSpacings": { "md": "var(--fr-letterSpacings-md)" },
  "lineHeights": {
    "xs": "var(--fr-lineHeights-xs)",
    "sm": "var(--fr-lineHeights-sm)",
    "md": "var(--fr-lineHeights-md)",
    "lg": "var(--fr-lineHeights-lg)",
    "xl": "var(--fr-lineHeights-xl)",
    "2xl": "var(--fr-lineHeights-2xl)",
    "3xl": "var(--fr-lineHeights-3xl)",
    "4xl": "var(--fr-lineHeights-4xl)"
  },
  "radii": {
    "md": "var(--fr-radii-md)",
    "lg": "var(--fr-radii-lg)",
    "round": "var(--fr-radii-round)"
  },
  "shadows": { "md": "var(--fr-shadows-md)" },
  "space": {
    "0": "var(--fr-space-0)",
    "1": "var(--fr-space-1)",
    "2": "var(--fr-space-2)",
    "3": "var(--fr-space-3)",
    "4": "var(--fr-space-4)",
    "5": "var(--fr-space-5)",
    "6": "var(--fr-space-6)",
    "7": "var(--fr-space-7)",
    "8": "var(--fr-space-8)",
    "9": "var(--fr-space-9)",
    "10": "var(--fr-space-10)",
    "11": "var(--fr-space-11)",
    "12": "var(--fr-space-12)",
    "13": "var(--fr-space-13)",
    "14": "var(--fr-space-14)",
    "15": "var(--fr-space-15)",
    "16": "var(--fr-space-16)",
    "17": "var(--fr-space-17)",
    "18": "var(--fr-space-18)",
    "19": "var(--fr-space-19)",
    "20": "var(--fr-space-20)",
    "-20": "var(--fr-space--20)",
    "-19": "var(--fr-space--19)",
    "-18": "var(--fr-space--18)",
    "-17": "var(--fr-space--17)",
    "-16": "var(--fr-space--16)",
    "-15": "var(--fr-space--15)",
    "-14": "var(--fr-space--14)",
    "-13": "var(--fr-space--13)",
    "-12": "var(--fr-space--12)",
    "-11": "var(--fr-space--11)",
    "-10": "var(--fr-space--10)",
    "-9": "var(--fr-space--9)",
    "-8": "var(--fr-space--8)",
    "-7": "var(--fr-space--7)",
    "-6": "var(--fr-space--6)",
    "-5": "var(--fr-space--5)",
    "-4": "var(--fr-space--4)",
    "-3": "var(--fr-space--3)",
    "-2": "var(--fr-space--2)",
    "-1": "var(--fr-space--1)",
    "-0.5": "var(--fr-space--0.5)",
    "0.5": "var(--fr-space-0.5)",
    "auto": "var(--fr-space-auto)"
  }
}
```

</details>

&nbsp;

### CSS Variables

Our theme runs on a set of [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) that map 1:1 to the properties in the theme. For any part of the theme, you can override the related CSS var and any themed value in that CSS scope will be changed accordingly.

This is especially useful in conjunction with the `css` prop, as it allows you to create temporary sub-themes that apply only to one Component, e.g.:

```tsx
<Frigade.Tour
  css={{
    // Change primary elements (i.e. buttons) in this Tour to be black
    '--fr-color-primary-surface': 'var(--fr-colors-black)',
  }}
/>
```

<details>
<summary>View full list of CSS properties</summary>

```css
--fr-borders-md: 1px solid;
--fr-borderWidths-0: 0;
--fr-borderWidths-md: 1px;
--fr-colors-black: #000000;
--fr-colors-gray100: #14161a;
--fr-colors-gray200: #181b20;
--fr-colors-gray300: #1f2329;
--fr-colors-gray400: #2e343d;
--fr-colors-gray500: #4c5766;
--fr-colors-gray600: #5a6472;
--fr-colors-gray700: #c5cbd3;
--fr-colors-gray800: #e2e5e9;
--fr-colors-gray900: #f1f2f4;
--fr-colors-white: #ffffff;
--fr-colors-blue400: #015ac6;
--fr-colors-blue500: #0171f8;
--fr-colors-blue800: #dbecff;
--fr-colors-blue900: #f5f9ff;
--fr-colors-green400: #009e37;
--fr-colors-green500: #00d149;
--fr-colors-green800: #dbffe8;
--fr-colors-transparent: #ffffff00;
--fr-colors-inherit: inherit;
--fr-colors-red500: #c00000;
--fr-colors-neutral-background: var(--fr-colors-white);
--fr-colors-neutral-border: var(--fr-colors-gray500);
--fr-colors-neutral-foreground: var(--fr-colors-black);
--fr-colors-neutral-surface: var(--fr-colors-gray700);
--fr-colors-neutral-active-background: var(--fr-colors-white);
--fr-colors-neutral-active-border: var(--fr-colors-gray900);
--fr-colors-neutral-active-foreground: var(--fr-colors-black);
--fr-colors-neutral-active-surface: var(--fr-colors-gray700);
--fr-colors-neutral-focus-background: var(--fr-colors-white);
--fr-colors-neutral-focus-border: var(--fr-colors-gray900);
--fr-colors-neutral-focus-foreground: var(--fr-colors-black);
--fr-colors-neutral-focus-surface: var(--fr-colors-gray700);
--fr-colors-neutral-hover-background: var(--fr-colors-white);
--fr-colors-neutral-hover-border: var(--fr-colors-gray900);
--fr-colors-neutral-hover-foreground: var(--fr-colors-black);
--fr-colors-neutral-hover-surface: var(--fr-colors-gray700);
--fr-colors-primary-background: var(--fr-colors-blue500);
--fr-colors-primary-border: var(--fr-colors-blue500);
--fr-colors-primary-foreground: var(--fr-colors-white);
--fr-colors-primary-surface: var(--fr-colors-blue500);
--fr-colors-primary-active-background: var(--fr-colors-blue400);
--fr-colors-primary-active-border: var(--fr-colors-blue400);
--fr-colors-primary-active-foreground: var(--fr-colors-white);
--fr-colors-primary-active-surface: var(--fr-colors-blue400);
--fr-colors-primary-focus-background: var(--fr-colors-blue500);
--fr-colors-primary-focus-border: var(--fr-colors-blue500);
--fr-colors-primary-focus-foreground: var(--fr-colors-white);
--fr-colors-primary-focus-surface: var(--fr-colors-blue500);
--fr-colors-primary-hover-background: var(--fr-colors-blue400);
--fr-colors-primary-hover-border: var(--fr-colors-blue400);
--fr-colors-primary-hover-foreground: var(--fr-colors-white);
--fr-colors-primary-hover-surface: var(--fr-colors-blue400);
--fr-colors-secondary-background: var(--fr-colors-gray900);
--fr-colors-secondary-border: var(--fr-colors-gray900);
--fr-colors-secondary-foreground: var(--fr-colors-black);
--fr-colors-secondary-surface: var(--fr-colors-gray900);
--fr-colors-secondary-active-background: var(--fr-colors-gray800);
--fr-colors-secondary-active-border: var(--fr-colors-gray800);
--fr-colors-secondary-active-foreground: var(--fr-colors-black);
--fr-colors-secondary-active-surface: var(--fr-colors-gray800);
--fr-colors-secondary-focus-background: var(--fr-colors-gray900);
--fr-colors-secondary-focus-border: var(--fr-colors-gray900);
--fr-colors-secondary-focus-foreground: var(--fr-colors-black);
--fr-colors-secondary-focus-surface: var(--fr-colors-gray900);
--fr-colors-secondary-hover-background: var(--fr-colors-gray800);
--fr-colors-secondary-hover-border: var(--fr-colors-gray800);
--fr-colors-secondary-hover-foreground: var(--fr-colors-black);
--fr-colors-secondary-hover-surface: var(--fr-colors-gray800);
--fr-fontFamilies-default: TT Interphases Pro, sans-serif;
--fr-fontSizes-xs: 12px;
--fr-fontSizes-sm: 14px;
--fr-fontSizes-md: 16px;
--fr-fontSizes-lg: 18px;
--fr-fontSizes-xl: 20px;
--fr-fontSizes-2xl: 24px;
--fr-fontSizes-3xl: 30px;
--fr-fontSizes-4xl: 36px;
--fr-fontSizes-5xl: 48px;
--fr-fontWeights-thin: 100;
--fr-fontWeights-extralight: 200;
--fr-fontWeights-light: 300;
--fr-fontWeights-regular: 400;
--fr-fontWeights-medium: 500;
--fr-fontWeights-demibold: 600;
--fr-fontWeights-bold: 700;
--fr-fontWeights-extrabold: 800;
--fr-fontWeights-black: 900;
--fr-letterSpacings-md: 0.02em;
--fr-lineHeights-xs: 18px;
--fr-lineHeights-sm: 22px;
--fr-lineHeights-md: 24px;
--fr-lineHeights-lg: 26px;
--fr-lineHeights-xl: 30px;
--fr-lineHeights-2xl: 38px;
--fr-lineHeights-3xl: 46px;
--fr-lineHeights-4xl: 60px;
--fr-radii-md: 10px;
--fr-radii-lg: 20px;
--fr-radii-round: 50%;
--fr-shadows-md: 0px 4px 20px rgba(0, 0, 0, 0.1);
--fr-space-0: 0px;
--fr-space-1: 4px;
--fr-space-2: 8px;
--fr-space-3: 12px;
--fr-space-4: 16px;
--fr-space-5: 20px;
--fr-space-6: 24px;
--fr-space-7: 28px;
--fr-space-8: 32px;
--fr-space-9: 36px;
--fr-space-10: 40px;
--fr-space-11: 44px;
--fr-space-12: 48px;
--fr-space-13: 52px;
--fr-space-14: 56px;
--fr-space-15: 60px;
--fr-space-16: 64px;
--fr-space-17: 68px;
--fr-space-18: 72px;
--fr-space-19: 76px;
--fr-space-20: 80px;
--fr-space--20: -80px;
--fr-space--19: -76px;
--fr-space--18: -72px;
--fr-space--17: -68px;
--fr-space--16: -64px;
--fr-space--15: -60px;
--fr-space--14: -56px;
--fr-space--13: -52px;
--fr-space--12: -48px;
--fr-space--11: -44px;
--fr-space--10: -40px;
--fr-space--9: -36px;
--fr-space--8: -32px;
--fr-space--7: -28px;
--fr-space--6: -24px;
--fr-space--5: -20px;
--fr-space--4: -16px;
--fr-space--3: -12px;
--fr-space--2: -8px;
--fr-space--1: -4px;
--fr-space--0.5: -2px;
--fr-space-0.5: 2px;
--fr-space-auto: auto;
```

</details>
