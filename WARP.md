# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

BiteTrack WebGUI is a React TypeScript web application for a sales management system. It provides authentication, customer management, product inventory, and sales tracking capabilities with role-based access control.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (Vite with HMR)
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint on all TypeScript/TSX files
- `npm run preview` - Preview production build locally

### Development Workflow
- Use `npm run dev` to start the development server
- The app runs on the default Vite port (typically 5173)
- Hot module replacement is enabled for fast development

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend API**: Supabase integration
- **State Management**: React Context (AuthContext)

### Project Structure
```
src/
├── components/           # Organized by feature domains
│   ├── auth/            # Authentication components
│   ├── customers/       # Customer management
│   ├── dashboard/       # Main dashboard
│   ├── products/        # Product inventory
│   ├── sales/           # Sales management  
│   ├── sellers/         # Seller management (admin only)
│   ├── ui/              # Reusable UI components
│   └── Layout/          # Layout components (Sidebar)
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── types/               # TypeScript type definitions
└── config/              # Configuration files
```

### Key Architectural Patterns

#### Authentication Flow
- Multi-step auth: Landing → Status Check → Login/Activation
- Token-based authentication with localStorage persistence
- Role-based access control (user/admin/superadmin)

#### API Integration
- Centralized `apiService` class with request/response handling
- Custom `useApiMutation` hook for async operations
- Idempotent requests with unique request IDs
- Automatic timeout handling (10s default)

#### State Management
- `AuthContext` for global authentication state
- Local component state for UI interactions
- No external state management library - uses React patterns

#### Component Architecture
- Feature-based component organization
- Reusable UI components in `ui/` directory
- Props interfaces for type safety
- Custom hooks for API interactions

### API Configuration
- Base URL: `http://localhost:3000/bitetrack` (configured in `src/config/api.ts`)
- JWT token authentication via Authorization headers
- RESTful endpoints for CRUD operations
- Supabase client integration

### Key Features by Role
- **All Users**: Dashboard, sales creation, customer/product management
- **Admin/SuperAdmin**: Seller management, pending seller creation
- **Authentication**: Email-based login with account activation flow

### Development Notes
- Uses modern React patterns (functional components, hooks)
- TypeScript strict mode enabled
- ESLint configuration includes React-specific rules
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography

### Backend Dependencies
- Expects BiteTrack API server running on localhost:3000
- Supabase integration for additional data services
- API endpoints follow RESTful conventions

### Testing Considerations
- No test framework currently configured
- Consider adding Jest + React Testing Library for unit tests
- API service methods are well-structured for testing
