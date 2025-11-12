# Shutokun-re Project Context

This document provides essential context for the Shutokun-re project to assist the Gemini agent.

## Project Overview

- **Project Name:** Shutokun-re
- **Description:** A mobile application for Japanese language learning, likely focused on vocabulary, quizzes, and study modes.
- **Platform:** Cross-platform mobile application built with React Native and Expo.

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Backend:** AWS Amplify (GraphQL API, Cognito Auth)
- **Routing:** Expo Router (file-based routing)
- **Local Database:** SQLite (`assets/db/core-data.db`), accessed via `db/database.ts`.
- **Styling:** Custom theming system located in `constants/theme.ts` and `hooks/use-theme-color.ts`.
- **Package Manager:** npm

## Key Directories

- `app/`: Contains all screens and navigation logic.
- `amplify/`: AWS Amplify backend configuration.
- `components/`: Reusable UI components.
- `assets/`: Static assets like images and the SQLite database.
- `db/`: Contains database access logic.
- `src/`: Auto-generated AWS Amplify API files and GraphQL definitions.

## Development Workflow

- **Linting:** Run `npm run lint` (assuming this script exists in `package.json`). The configuration is in `eslint.config.js`.
- **Running the app:** Use `npx expo start` to run the development server.
- **Backend:** The backend is managed by the Amplify CLI. Do not edit files in `amplify/backend/` directly unless you are familiar with Amplify's workflow.
