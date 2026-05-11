# RefNet UI - Project Structure

## Overview
RefNet is a job referral network application built with React, TypeScript, and Vite. This document outlines the project structure and key components.

## Folder Structure

```
src/
├── components/              # Reusable UI components
│   ├── Button.tsx          # Custom button component
│   ├── Card.tsx            # Card component
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Navigation.tsx      # Navigation bar
│   ├── ProtectedRoute.tsx  # Authentication guard
│   ├── Loading.tsx         # Loading spinner
│   ├── ErrorBoundary.tsx   # Error boundary component
│   └── index.ts            # Component exports
├── pages/                  # Page components
│   ├── LandingPage.tsx     # Home page
│   ├── LoginPage.tsx       # Login page
│   ├── SignUpPage.tsx      # Sign up page
│   ├── Dashboard.tsx       # User dashboard
│   ├── Profile.tsx         # User profile
│   ├── JobListings.tsx     # Browse jobs
│   ├── JobDetails.tsx      # Individual job details
│   ├── Chat.tsx            # Messaging interface
│   ├── SettingsPage.tsx    # User settings
│   ├── AboutPage.tsx       # About page
│   ├── ContactPage.tsx     # Contact page
│   └── OnboardingPage.tsx  # User onboarding
├── router/                 # Routing configuration
│   ├── components/
│   │   └── StaticWrapper.tsx  # Route wrapper
│   ├── index.tsx           # Router setup
│   └── routes.ts           # Route definitions
├── store/                  # State management
│   └── useAuthStore.ts     # Authentication state
├── services/               # API services
│   ├── api.ts              # Axios configuration
│   └── authService.ts      # Authentication API
├── styles/                 # Global styles
├── assets/                 # Static assets
├── utils/                  # Utility functions
├── App.tsx                 # Main app component
├── main.tsx               # App entry point
└── vite-env.d.ts          # Vite type definitions
```

## Key Features

### Navigation System
- **Responsive Navigation Bar**: Fixed header with page navigation
- **Active State**: Highlights current page
- **Mobile Responsive**: Adapts to smaller screens
- **Protected Routes**: Authentication required for certain pages

### Authentication
- **Zustand State Management**: Global auth state
- **Protected Routes**: Guards authenticated pages
- **Mock Implementation**: Ready for real API integration

### UI Components
- **Button Component**: Multiple variants (primary, secondary, outline, ghost)
- **Card Component**: Flexible container with shadows and padding
- **Loading Component**: Consistent loading states
- **Error Boundary**: Graceful error handling

### Routing
- **React Router**: Client-side routing
- **Dynamic Routes**: Support for parameters (e.g., /jobs/:id)
- **Layout Integration**: Automatic navigation handling

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Development Workflow

1. **Adding New Pages**:
   - Create component in `src/pages/`
   - Add route configuration in `src/router/routes.ts`
   - Update navigation if needed

2. **Creating Components**:
   - Add to `src/components/`
   - Export in `src/components/index.ts`
   - Include styles alongside component

3. **State Management**:
   - Use Zustand stores in `src/store/`
   - Follow existing patterns for consistency

4. **API Integration**:
   - Configure in `src/services/api.ts`
   - Create service files for different endpoints

## Routes

| Path | Component | Protected | Navigation |
|------|------------|-----------|------------|
| `/` | LandingPage | No | Yes |
| `/login` | LoginPage | No | No |
| `/signup` | SignUpPage | No | No |
| `/dashboard` | Dashboard | Yes | Yes |
| `/profile` | Profile | Yes | Yes |
| `/jobs` | JobListings | Yes | Yes |
| `/jobs/:id` | JobDetails | Yes | Yes |
| `/chat` | Chat | Yes | Yes |
| `/settings` | SettingsPage | Yes | Yes |
| `/about` | AboutPage | No | Yes |
| `/contact` | ContactPage | No | Yes |
| `/onboarding` | OnboardingPage | Yes | No |

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Client-side routing
- **Zustand**: State management
- **Axios**: HTTP client
- **CSS**: Styling (no framework for flexibility)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:5173`

The application will open with full navigation functionality, allowing you to traverse between all pages using the navigation bar.
