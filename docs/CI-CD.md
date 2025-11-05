# CI / CD

## Continuous Integration

- Use GitHub Actions workflow (e.g. `.github/workflows/ci.yml`) that:
  - Installs dependencies.
  - Runs TypeScript type-check.
  - Runs ESLint.
  - Runs Jest tests.

## Build

- Optionally add a job that:
  - Runs an Expo build check or `expo doctor` to ensure project health.

## Delivery

- Final APK build can be produced locally or through Expo's build service.
- CI does not need to publish builds at MVP stage, but may be extended later.
