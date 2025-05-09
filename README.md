# JesJam Mobile
A mobile app for BACII exam prep.

## Project Structure

JesJam Mobile is a monorepo project built with Nx, consisting of a React Native mobile application and a Laravel backend API.

```
jesjam-mobile/
├── apps/
│   ├── mobile/                 # React Native with Expo app
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── screens/        # Screen components
│   │   │   ├── navigation/     # Navigation configuration
│   │   │   ├── services/       # API and service integrations
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── constants/      # App-wide constants
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   └── App.tsx         # Main app component
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── .env.*              # Environment variables
│   │   ├── app.json            # Expo configuration
│   │   ├── package.json        # App-specific dependencies
│   │   ├── tsconfig.json       # TypeScript configuration
│   │   └── project.json        # Nx project configuration
│   │
│   └── api/                    # Laravel API
│       ├── app/
│       │   ├── Http/           # HTTP controllers, middleware, requests
│       │   ├── Models/         # Eloquent data models
│       │   └── Providers/      # Service providers
│       ├── database/           # Migrations, seeders, factories
│       ├── routes/             # API routes
│       ├── config/             # Configuration files
│       ├── tests/              # Unit and feature tests
│       ├── composer.json       # PHP dependencies
│       └── package.json        # Node dependencies for assets
│
├── libs/                       # Shared code/tools
│   ├── models/                 # Shared model contracts or DTOs
│   ├── utils/                  # General utilities/helpers
│   └── constants/              # Shared app-wide constants
│
├── tools/                      # Custom scripts and tools for the monorepo
│
├── nx.json                     # Nx workspace configuration
├── package.json                # Root dependencies and workspace scripts
├── .gitignore                  # Git ignore patterns
└── README.md                   # Project documentation
```

## Technology Stack

### Monorepo Management
- **Nx**: Workspace and build system for managing the monorepo architecture

### Mobile Application (React Native with Expo)
- **React Native**: Cross-platform mobile framework
- **Expo**: Toolchain and platform for React Native development
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library for React Native apps
- **Formik**: Form management library
- **Yup**: Schema validation library
- **ESLinst**: Code style library
- **React Native Dotenv**: Environment variable management

### Backend API (Laravel)
- **Laravel**: PHP web application framework
- **Laravel Sanctum**: Authentication system
- **Pest PHP**: Testing framework
- **Laravel Pint**: PHP code style fixer

## Dependencies

### Root Dependencies
```json
{
  "dependencies": {
    "@nrwl/nx": "latest",
    "@nx/devkit": "^20.8.1",
    "nx": "^20.8.1"
  },
  "devDependencies": {
    "@types/node": "^22.15.3"
  }
}
```

### Mobile App Dependencies
```json
{
  "dependencies": {
    "@react-navigation/native": "^7.1.8",
    "@react-navigation/native-stack": "^7.3.12",
    "expo": "~53.0.9",
    "expo-status-bar": "~2.2.3",
    "formik": "^2.4.6",
    "react": "19.0.0",
    "react-native": "0.79.2",
    "react-native-safe-area-context": "^5.4.0",
    "react-native-screens": "^4.10.0",
    "yup": "^1.6.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "^19.1.3",
    "@types/react-native": "^0.72.8",
    "@typescript-eslint/eslint-plugin": "^8.32.0",
    "@typescript-eslint/parser": "^8.32.0",
    "eslint": "^9.26.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-native": "^5.0.0",
    "react-native-dotenv": "^3.4.11",
    "typescript": "^5.8.3"
  }
}
```

### Laravel API Dependencies
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^12.0",
    "laravel/sanctum": "^4.0",
    "laravel/tinker": "^2.10.1"
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pail": "^1.2.2",
    "laravel/pint": "^1.13",
    "laravel/sail": "^1.41",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.6",
    "pestphp/pest": "^3.8",
    "pestphp/pest-plugin-laravel": "^3.2"
  }
}
```

## Environment Configuration

### Mobile App
The React Native application uses environment-specific configuration with the following setup:

- `.env.development`: Local development environment configuration
- `.env.staging`: Staging environment configuration
- `.env.production`: Production environment configuration

Environment variables are accessed through the `@env` module, with type definitions in `src/types/env.d.ts`.

### Laravel API
The Laravel backend uses the standard Laravel environment configuration:

- `.env`: Main environment configuration file
- `.env.example`: Template with example configuration
- `.env.testing`: Test environment configuration

## Scripts

### Root Scripts
```
npm run start:mobile  # Start the React Native app
npm run android       # Start on Android
npm run ios           # Start on iOS
npm run web           # Start on web
npm run build:android # Build Android app
npm run build:ios     # Build iOS app
npm run serve:api     # Start the Laravel API server
npm run test:api      # Run API tests
npm run test:mobile   # Run mobile app tests
```

### Mobile App Scripts
```
npm run start         # Start Expo development server
npm run android       # Start on Android
npm run ios           # Start on iOS
npm run web           # Start on web
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
```

### Laravel API Scripts
```
composer run dev      # Start development server with logs and queue
composer run test     # Run tests
```

## Development Workflow

1. **Setup**: Clone the repository and install dependencies
   ```
   git clone <repository-url>
   npm install
   ```

2. **Running the applications**:
   - For mobile: `npm run start:mobile`
   - For API: `npm run serve:api`

3. **Development process**:
   - Make changes in respective application directories
   - Use shared libraries in `libs/` for code that should be shared
   - Run linting and tests before committing changes

4. **Building for production**:
   - Mobile app: `npm run build:android` or `npm run build:ios`
   - API: Follow standard Laravel deployment practices


### License

Copyright 2025 Pun VireakRoth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.