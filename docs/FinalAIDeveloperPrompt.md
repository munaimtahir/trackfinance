# Final AI Developer Prompt – Family Bill Tracker

You are an AI developer working inside this GitHub repository.

## Objective

Implement the **Family Bill Tracker** mobile app as defined in:

- `docs/Goals.md`
- `docs/Architecture.md`
- `docs/DataModel.md`
- `docs/Tests.md`
- `docs/QA-Checklist.md`

Target: **Android-first Expo React Native app** using **TypeScript** and **Firebase**.

## Constraints & Expectations

- Use **TypeScript** for app code.
- Use **Expo** tooling; assume Android physical device via Expo Go for testing.
- Implement authentication via Firebase Auth.
- Use Firestore for data, Storage for images, and FCM for notifications.
- Maintain a clean, simple UI suitable for a non-technical father.
- Keep secrets out of the repo; use config/env placeholders.
- Add or update tests according to `docs/Tests.md`.
- Configure a basic GitHub Actions CI workflow for lint + tests.

## High-level tasks

1. **Scaffold Expo + TypeScript project**
   - Initialize a React Native app under this repo (using Expo).
   - Set up directory structure:
     - `app/` for screens/components/hooks.
     - `services/` (or similar) for Firebase wrappers.
   - Configure TypeScript, ESLint, Jest.

2. **Firebase integration**
   - Create a `services/firebase` module that loads config from environment.
   - Implement helper functions for:
     - Authentication
     - CRUD operations for `bills`
     - Device token registration for notifications

3. **Implement flows**
   - Father flow to capture and create a new bill entry with image.
   - Bills list with Pending/Paid tabs.
   - Bill detail view.
   - Mark-as-paid action with optional receipt screenshot & note.

4. **Notifications**
   - Integrate Expo Notifications with FCM.
   - Store device tokens in `users` collection.
   - Ensure notifications fire on:
     - New bill creation.
     - Bill marked paid.

5. **Testing & CI**
   - Add tests covering core flows.
   - Create GitHub Actions workflow in `.github/workflows/ci.yml`.

6. **Polish**
   - Ensure basic error handling and loading states.
   - Make the UI readable and accessible.

## Workflow

- Work in a feature branch (e.g., `feature/mvp-implementation`).
- Commit changes in logical steps with descriptive messages.
- Open a Pull Request summarizing:
  - Implemented features.
  - Any deviations from docs.
  - How to run the app and tests.

When you are done, the human owner should be able to:

- Clone the repo.
- Add Firebase config.
- Run the app on Android via Expo.
- Capture a bill as father, and mark it paid as child.
