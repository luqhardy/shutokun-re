# Components Directory Context

This directory contains reusable React components used throughout the Shutokun-re application.

## Conventions

- **Theming:** Components are designed to be theme-aware. They use the `useThemeColor` hook from `hooks/use-theme-color.ts` to adapt to the current color scheme (light/dark). When creating new components, use this hook for colors instead of hardcoding them.
- **Platform-Specific Code:** For components that need different implementations on iOS, Android, or Web, use platform-specific file extensions (e.g., `component.ios.tsx`, `component.android.tsx`, `component.web.tsx`). An example of this is `IconSymbol.ios.tsx` vs `IconSymbol.tsx`.

## Key Components

- **`ThemedText.tsx` & `ThemedView.tsx`:** Base components that should be used instead of the default React Native `Text` and `View` to ensure theme compatibility.
- **`ParallaxScrollView.tsx`:** A specialized scroll view for creating parallax scrolling effects, often used in screen headers.
- **`ui/` subdirectory:** Contains more atomic, general-purpose UI elements.
    - `Collapsible.tsx`: A component for creating collapsible/expandable sections.
    - `IconSymbol.tsx`: A component for displaying icons, likely SFSymbols on iOS.
