# CI / CD

## Continuous Integration

The project uses GitHub Actions workflow (`.github/workflows/ci.yml`) with two jobs:

### 1. Build and Test Job
Runs on every push and pull request:
- Installs dependencies with `npm install --legacy-peer-deps`
- Runs TypeScript type-check: `npm run type-check`
- Runs ESLint: `npm run lint`
- Runs Jest tests: `npm test`

### 2. Android Health Check Job
Validates Android/Expo project configuration:
- Runs `expo-doctor` to check project health
- Runs `expo install --check` to verify package versions match SDK

## Local Health Checks

Before pushing code, run these commands locally:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Tests
npm test

# Expo health check
npm run doctor

# Package version check
npm run android:check
```

## Build

### Development Builds

For local Android builds:
```bash
npx expo prebuild --platform android
npx expo run:android
```

### EAS Build (Production)

For production builds using Expo Application Services (EAS):

1. Install EAS CLI globally:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure your project:
   ```bash
   eas build:configure
   ```

4. Build for Android:
   ```bash
   eas build --platform android
   ```

Note: EAS builds require:
- Valid Firebase configuration in environment variables
- Expo account with appropriate permissions
- Android keystore for production builds

### CI/CD Build Automation (Optional)

To add EAS builds to CI/CD, create a new workflow `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  workflow_dispatch:  # Manual trigger only

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Build Android APK
        run: eas build --platform android --non-interactive
```

Required secrets:
- `EXPO_TOKEN`: Expo access token (get from https://expo.dev/accounts/[username]/settings/access-tokens)

## Delivery

- Final APK build can be produced locally or through Expo's build service
- CI does not publish builds at MVP stage, but may be extended later
- For production releases, use EAS Build with proper signing keys
