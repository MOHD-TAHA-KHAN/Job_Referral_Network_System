# RefNet Frontend Requirements

## 📋 Frontend Dependencies

This document outlines all requirements for setting up the RefNet frontend application.

### 🔧 Prerequisites

#### **Required Software:**
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

#### **Development Tools (Recommended):**
- **VS Code**: With React and TypeScript extensions
- **React Developer Tools**: Browser extension
- **TypeScript**: For type safety

---

## 📦 Package Dependencies

### **Core Dependencies:**
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router": "^7.8.2",
    "zustand": "^5.0.13",
    "axios": "^1.16.0",
    "motion": "^12.23.12"
  }
}
```

#### **Dependency Details:**
- **react**: Core React library for building UI components
- **react-dom**: React DOM renderer for web browsers
- **react-router**: Client-side routing for navigation
- **zustand**: Lightweight state management
- **axios**: HTTP client for API communication
- **motion**: Animation library for smooth transitions

### **Development Dependencies:**
```json
{
  "devDependencies": {
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@types/node": "^25.6.2",
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4",
    "typescript": "~5.8.3",
    "eslint": "^9.39.1",
    "@eslint/js": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "typescript-eslint": "^8.39.1",
    "globals": "^16.5.0"
  }
}
```

#### **Development Tools Details:**
- **@types/react**: TypeScript definitions for React
- **@types/react-dom**: TypeScript definitions for React DOM
- **@types/node**: TypeScript definitions for Node.js
- **@vitejs/plugin-react**: Vite plugin for React support
- **vite**: Fast build tool and development server
- **typescript**: TypeScript compiler
- **eslint**: Code linting and formatting
- **globals**: ESLint globals configuration

---

## 🔧 Installation Commands

### **Quick Setup:**
```bash
# Navigate to client directory
cd client

# Install all dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### **Package Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## 🌍 Environment Configuration

### **Required Environment Variables:**
```bash
# Backend API Configuration
VITE_API_URL=http://localhost:5000/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Application Configuration
VITE_APP_NAME=RefNet
VITE_APP_VERSION=1.0.0
```

### **Setup Steps:**
```bash
# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Use your actual backend URL and Google OAuth credentials
```

---

## 🎨 UI Components & Styling

### **Component Structure:**
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navigation.tsx   # Navigation component
│   ├── Button.tsx       # Custom button component
│   ├── Card.tsx         # Card component
│   └── ...
├── pages/              # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   └── ...
├── services/           # API services
│   ├── api.ts
│   ├── authService.ts
│   ├── jobService.ts
│   └── ...
├── store/              # State management
│   └── useAuthStore.ts
├── styles/             # CSS files
│   ├── design-system.css
│   ├── responsive.css
│   └── ...
└── assets/             # Static assets
    ├── images/
    └── styles/
```

### **Styling Dependencies:**
- **CSS Modules**: Component-scoped styling
- **CSS Variables**: Design system tokens
- **Responsive Design**: Mobile-first approach
- **Custom Fonts**: Inter font family

---

## 🔌 API Integration

### **Service Layer:**
- **api.ts**: Base API configuration with axios
- **authService.ts**: Authentication endpoints
- **jobService.ts**: Job listings and details
- **profileService.ts**: User profile management
- **referralService.ts**: Referral system

### **API Endpoints Used:**
```typescript
// Authentication
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
POST /api/auth/logout

// Jobs
GET  /api/jobs
GET  /api/jobs/:id

// Profile
GET  /api/profile
PATCH /api/profile

// Referrals
GET  /api/referrals/my-referrals
POST /api/referrals
```

---

## 🔐 Authentication Flow

### **State Management:**
- **Zustand Store**: Lightweight state management
- **Token Storage**: localStorage for persistence
- **Protected Routes**: Authentication guards
- **Auto-refresh**: Token refresh mechanism

### **OAuth Integration:**
- **Google OAuth**: Complete flow implementation
- **Callback Handling**: OAuth callback processing
- **Error Handling**: OAuth error management

---

## 📱 Browser Compatibility

### **Supported Browsers:**
- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+

### **Required Features:**
- **ES6+**: Modern JavaScript features
- **CSS Grid**: Layout system
- **CSS Flexbox**: Flexible layouts
- **Fetch API**: HTTP requests
- **Local Storage**: Data persistence

---

## 🚀 Development Workflow

### **Local Development:**
```bash
# Start backend server (required)
cd ../server
npm run dev

# Start frontend server
cd client
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### **Code Quality:**
```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix

# TypeScript checking
npx tsc --noEmit
```

---

## 🐛 Troubleshooting

### **Common Issues:**

#### **1. Port Already in Use:**
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

#### **2. Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **3. Environment Variables:**
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables
node -e "console.log(import.meta.env.VITE_API_URL)"
```

#### **4. Build Errors:**
```bash
# Clear build cache
rm -rf dist

# Rebuild
npm run build
```

---

## 📊 Performance Optimization

### **Build Optimization:**
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Bundle size monitoring

### **Development Performance:**
- **Hot Module Replacement**: Fast development cycles
- **Source Maps**: Debugging support
- **Fast Refresh**: Component state preservation

---

## 🔧 Configuration Files

### **Vite Configuration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### **TypeScript Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 📚 Additional Resources

### **Documentation:**
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### **Tools:**
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Vite DevTools](https://github.com/vitejs/vite-plugin-react-devtools)

---

**Last Updated**: May 11, 2026  
**Version**: 1.0.0  
**Framework**: React 19 + TypeScript + Vite
