# App Directory Context

This directory contains the application's user-facing screens and navigation structure, managed by Expo Router.

## Routing

- **Framework:** Expo Router (file-based routing).
- **Layouts:**
    - `app/_layout.tsx`: The root layout for the entire application.
    - `app/(tabs)/_layout.tsx`: The layout for the main tab navigator.
- **Tabs:** The main navigation is a tab bar with the following screens:
    - `index.tsx`: The home screen.
    - `bunsekikun.tsx`: Likely an analysis or statistics screen.
    - `custom-mode.tsx`: A customizable study or quiz mode.
    - `jlpt-study.tsx`: A study mode focused on the Japanese Language Proficiency Test (JLPT).
    - `kana-quiz.tsx`: A quiz for Japanese Kana (Hiragana/Katakana).
    - `vocab-editor.tsx`: A screen for creating or editing vocabulary lists.
- **Modals:**
    - `signin-modal.tsx`: A modal screen for user authentication.
- **Other Special Files:**
    - `srsWindow.tsx`: Potentially a screen related to a Spaced Repetition System (SRS).
