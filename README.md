# BiteTrack UI 🍔

**Transform your food business from spreadsheet chaos to structured success**

BiteTrack UI is a modern, responsive React frontend application that provides an intuitive interface for the [BiteTrack RESTful API](https://github.com/fcortesbio/BiteTrack). Built with React 18, TypeScript, and Tailwind CSS, it empowers small food businesses to manage inventory, sales, customers, and staff through a professional web interface.

![BiteTrack](https://img.shields.io/badge/BiteTrack-Frontend-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 Overview

### The Problem
Small food businesses struggle with:
- 📊 Messy spreadsheets that break and get lost
- 🤔 No real-time inventory tracking  
- 📱 Manual sales recording prone to errors
- 👥 Unstructured customer data
- 🔒 No secure multi-user access control

### The Solution
BiteTrack UI provides:
- ✅ **Intuitive Dashboard** - Real-time business metrics at a glance
- ✅ **Role-Based Access** - Secure multi-user interface with proper permissions
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Real-Time Updates** - Live inventory and sales tracking
- ✅ **Professional UX** - Clean, modern interface built for efficiency
- ✅ **Secure Authentication** - JWT-based login with account activation flow

## 🚀 Key Features

### 🔐 **Authentication & User Management**
- **Multi-Role System**: Seller, Admin, and SuperAdmin access levels
- **Secure Onboarding**: Two-step account activation process
- **Session Management**: Persistent login with automatic token handling
- **Password Security**: Secure password requirements and validation

### 📊 **Business Management Interface**
- **Sales Dashboard**: Process transactions, track payments, view analytics
- **Inventory Management**: Real-time stock tracking, product catalog
- **Customer Relations**: Contact management, transaction history
- **Staff Management**: Seller account creation and role management (Admin+)
- **Analytics**: Business insights and performance metrics

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach, works on all devices
- **Clean Interface**: Professional design with Tailwind CSS
- **Interactive Components**: Loading states, error handling, form validation
- **Accessibility**: Built following WCAG guidelines

## 🛠️ Technology Stack

### **Frontend Framework**
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development with full IDE support
- **Vite 7.1.5** - Lightning-fast development and build tool

### **Styling & UI**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS processing and optimization
- **Lucide React 0.344.0** - Beautiful, customizable icon library

### **State Management & API**
- **React Context** - Global authentication and state management
- **Custom Hooks** - Reusable API logic with error handling
- **Supabase Client** - Backend integration and real-time features

### **Development Tools**
- **ESLint 9.9.1** - Code quality and consistency
- **TypeScript ESLint 8.3.0** - TypeScript-aware linting
- **Autoprefixer 10.4.18** - Automatic CSS vendor prefixing

### **Vite Development Experience**
- **⚡ Lightning Fast HMR** - Instant updates without page reload
- **🛠️ Built-in TypeScript** - No extra configuration needed
- **📱 Modern ESM** - Native ES modules support
- **🚀 Optimized Build** - Rollup-powered production builds
- **🔧 Rich Plugin Ecosystem** - React, PostCSS, and more

## 📋 Prerequisites

Before setting up BiteTrack UI, ensure you have:

### **Required Software**
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control

### **Backend Dependency**
- **BiteTrack API** running on `http://localhost:3000`
  - Follow the [BiteTrack API setup guide](https://github.com/fcortesbio/BiteTrack#-quick-start)
  - Ensure MongoDB is running and SuperAdmin account is created

## 🚀 Quick Start

### **1. Clone the Repository**

```bash
git clone <your-repository-url>
cd vite-bitetrack-ui
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. API Configuration**

Configure the API connection:

```bash
# Copy the API configuration template
cp src/config/api.ts.example src/config/api.ts
```

Edit `src/config/api.ts` and update the `BASE_URL` to point to your BiteTrack API server:

```typescript
export const API_CONFIG = {
  // Update this URL to match your BiteTrack API server
  BASE_URL: 'http://localhost:3000/bitetrack',  // <- Change this
  TIMEOUT: 10000,
} as const;
```

### **4. Start Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### **5. Build for Production (Optional)**

To create an optimized production build:

```bash
npm run build
```

This creates a `dist/` directory with optimized, minified files ready for deployment.

### **6. Preview Production Build (Optional)**

To preview the production build locally before deploying:

```bash
npm run preview
```

This serves the built files from `dist/` at `http://localhost:4173`

### **7. First Login**

1. Navigate to `http://localhost:5173`
2. Enter the email of your SuperAdmin account (created during API setup)
3. Complete the login process
4. Start managing your food business! 🎉

## 📁 Project Structure

```
vite-bitetrack-ui/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # React components
│   │   ├── 📁 auth/          # Authentication components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── ActivationPage.tsx
│   │   ├── 📁 dashboard/     # Dashboard components
│   │   ├── 📁 sales/         # Sales management
│   │   ├── 📁 customers/     # Customer management
│   │   ├── 📁 products/      # Product/inventory management
│   │   ├── 📁 sellers/       # Staff management (Admin+)
│   │   ├── 📁 Layout/        # Layout components
│   │   └── 📁 ui/            # Reusable UI components
│   ├── 📁 context/           # React contexts
│   │   └── AuthContext.tsx   # Authentication state
│   ├── 📁 hooks/             # Custom React hooks
│   │   └── useApiMutation.ts # API interaction hooks
│   ├── 📁 services/          # API services
│   │   └── api.ts            # BiteTrack API client
│   ├── 📁 types/             # TypeScript definitions
│   │   └── api.ts            # API response types
│   ├── 📁 config/            # Configuration
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles
├── 📄 src/config/api.ts.example  # API configuration template
├── 📄 package.json           # Dependencies and scripts
├── 📄 tailwind.config.js     # Tailwind configuration
├── 📄 tsconfig.json          # TypeScript config
├── 📄 vite.config.ts         # Vite configuration
└── 📄 README.md              # This file
```

## 🔧 Available Scripts

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start development server with hot reload at `localhost:5173` | **Development** - Daily coding with instant updates |
| `npm run build` | Build optimized production bundle to `dist/` | **Production** - Create deployable files |
| `npm run preview` | Preview production build locally at `localhost:4173` | **Testing** - Verify production build before deployment |
| `npm run lint` | Run ESLint for code quality checks | **Quality** - Check code standards and catch errors |

## 🔄 Development Workflow with Vite

### **Daily Development**
```bash
# Start coding with hot reload
npm run dev
# Edit files and see instant changes at localhost:5173
```

### **Pre-Deployment Testing**
```bash
# Build and test production version
npm run build
npm run preview
# Test the optimized build at localhost:4173
```

### **Quality Checks**
```bash
# Check code quality before committing
npm run lint
npm run build  # Ensure production build works
```

**⚡ Vite Advantages:**
- **Instant Server Start** - No bundling during development
- **Fast HMR** - Changes reflect immediately without page reload
- **Optimized Builds** - Production builds are highly optimized
- **Modern Tooling** - Built-in TypeScript, PostCSS, and more

## 🔒 Authentication Flow

### **User Roles & Permissions**

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Seller** | Basic Operations | Products, customers, sales, own profile |
| **Admin** | Management Access | All Seller permissions + create new accounts |
| **SuperAdmin** | Full Control | All Admin permissions + role management + password recovery |

### **Authentication Process**

1. **Landing Page** 🏠
   - User enters email address
   - System checks account status via `/auth/seller-status`

2. **Account Status Check** 🔍
   - **Active Account** → Redirect to Login
   - **Pending Account** → Redirect to Activation
   - **No Account** → Show contact admin message

3. **Account Activation** ⚡ (for new accounts)
   - Enter date of birth and last name for verification
   - Set secure password
   - Account activated and ready for use

4. **Login** 🔑
   - Password authentication
   - JWT token stored securely
   - Redirect to role-appropriate dashboard

5. **Dashboard Access** 📊
   - Role-based feature availability
   - Persistent session management

## 🏗️ Production Build & Deployment

### **Build for Production**

```bash
# Install dependencies (use ci for production)
npm ci

# Create optimized production build
npm run build

# Build output will be in dist/ directory
```

**What happens during build:**
- ⚡ **Lightning fast** - Vite's optimized build process
- 📦 **Code splitting** - Automatic chunk optimization for faster loading
- 🗜️ **Minification** - Compressed JavaScript, CSS, and HTML
- 🎯 **Tree shaking** - Removes unused code from bundle
- 🖼️ **Asset optimization** - Images and fonts are optimized
- 📱 **Modern output** - ES modules for modern browsers

**Verify your build:**
```bash
# Preview the production build locally
npm run preview

# Check build output size
ls -la dist/
```

### **Deployment Options**

#### **Option 1: Static Hosting (Recommended)**

Deploy to services like Netlify, Vercel, or AWS S3:

```bash
# Build the project
npm run build

# Preview before deploying (optional but recommended)
npm run preview
# Test your app at http://localhost:4173

# Deploy dist/ folder to your hosting service
# Examples:
# - Netlify: drag dist/ folder to Netlify dashboard
# - Vercel: vercel --prod
# - AWS S3: aws s3 sync dist/ s3://your-bucket-name
```

#### **Option 2: Docker Deployment**

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
# Build Docker image
docker build -t bitetrack-ui:latest .

# Run container
docker run -d -p 80:80 --name bitetrack-ui bitetrack-ui:latest
```

#### **Option 3: Static File Server**

For custom server deployment:

```bash
# Option 3a: Use Vite's built-in preview (recommended for testing)
npm run build
npm run preview  # Serves at http://localhost:4173

# Option 3b: Use external static file server
# Install serve globally
npm install -g serve

# Build and serve
npm run build
serve -s dist -l 3001  # Serves at http://localhost:3001
```

**Why use `npm run preview`?**
- ✅ **No extra dependencies** - Uses Vite's built-in server
- ✅ **Production-like environment** - Mimics real deployment
- ✅ **Fast setup** - No global package installation needed

### **API Configuration for Production**

For production deployment, update your `src/config/api.ts` file:

```typescript
export const API_CONFIG = {
  // Production API endpoint
  BASE_URL: 'https://your-api-domain.com/bitetrack',
  TIMEOUT: 10000,
} as const;
```

### **Build Optimization**

The production build automatically includes:
- ✅ **Code Splitting** - Automatic bundle optimization
- ✅ **Tree Shaking** - Remove unused code
- ✅ **Asset Optimization** - Compressed images and fonts
- ✅ **CSS Purging** - Remove unused Tailwind classes
- ✅ **Minification** - Compressed JavaScript and CSS

## 🔧 API Integration

### **Backend Dependency**

BiteTrack UI requires the [BiteTrack RESTful API](https://github.com/fcortesbio/BiteTrack) to be running.

**API Base URL**: `http://localhost:3000/bitetrack`

### **Key API Endpoints Used**

| Endpoint | Purpose | Component |
|----------|---------|-----------|
| `POST /auth/login` | User authentication | LoginPage |
| `GET /auth/seller-status` | Check account status | LandingPage |
| `POST /auth/activate` | Account activation | ActivationPage |
| `GET /sellers` | Seller management | SellersView |
| `GET /customers` | Customer data | CustomersView |
| `GET /products` | Product catalog | ProductsView |
| `GET /sales` | Sales data | SalesView |
| `GET /health` | API health check | App initialization |

### **API Client Configuration**

The API client (`src/services/api.ts`) automatically handles:
- JWT token attachment
- Request/response interceptors
- Error handling and formatting
- Loading states

## 🎨 UI Components & Design System

### **Component Architecture**

- **Atomic Design**: Button, Input, Modal components
- **Feature Components**: Dashboard, Sales, Customer views
- **Layout Components**: Sidebar, Header, Navigation
- **Context Providers**: Authentication, Theme management

### **Design Tokens**

```css
/* Primary Colors */
--color-primary: #3B82F6;      /* Blue-500 */
--color-secondary: #10B981;     /* Green-500 */
--color-accent: #F59E0B;        /* Yellow-500 */

/* Status Colors */
--color-success: #10B981;       /* Green-500 */
--color-warning: #F59E0B;       /* Yellow-500 */
--color-error: #EF4444;         /* Red-500 */
--color-info: #3B82F6;          /* Blue-500 */

/* Neutrals */
--color-gray-50: #F9FAFB;
--color-gray-900: #111827;
```

### **Responsive Breakpoints**

```css
/* Tailwind breakpoints used */
sm: 640px    /* Small devices (tablets) */
md: 768px    /* Medium devices (small laptops) */
lg: 1024px   /* Large devices (laptops) */
xl: 1280px   /* Extra large devices (desktops) */
2xl: 1536px  /* 2X large devices (large desktops) */
```

## 🧪 Development Guidelines

### **Code Standards**
- ✅ **TypeScript** for all components
- ✅ **Functional Components** with hooks
- ✅ **ESLint** configuration enforced
- ✅ **Consistent naming** conventions
- ✅ **Error boundaries** for production stability

### **Component Patterns**
```tsx
// Example component structure
interface ComponentProps {
  // Props with TypeScript types
}

export function Component({ prop }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState();
  const { data, isLoading } = useApiMutation();

  // Event handlers
  const handleSubmit = () => {
    // Logic here
  };

  // Early returns for loading/error states
  if (isLoading) return <LoadingSpinner />;

  // Main component render
  return (
    <div className="responsive-classes">
      {/* Component content */}
    </div>
  );
}
```

### **State Management Strategy**
- **Local State**: Component-specific UI state
- **Context**: Authentication, global app state  
- **Custom Hooks**: API interactions, shared logic
- **Props**: Parent-child communication

## 🔍 Troubleshooting

### **Common Issues**

#### **API Connection Failed**
```bash
# Check if BiteTrack API is running
curl http://localhost:3000/bitetrack/health

# Verify API configuration
cat src/config/api.ts
```

#### **Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### **Authentication Issues**
- Verify SuperAdmin account exists in MongoDB
- Check JWT token in browser localStorage
- Confirm API URL in `src/config/api.ts` matches your BiteTrack API server

#### **Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run dev

# Check for unused CSS classes
npm run build
```

### **Development Tools**

- **React Developer Tools**: Browser extension for debugging
- **Redux DevTools**: If using Redux (future enhancement)
- **Network Tab**: Monitor API requests in browser DevTools
- **Vite HMR**: Hot module replacement for instant updates

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m 'Add amazing feature'`
7. Push: `git push origin feature/amazing-feature`
8. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and patterns
- Add TypeScript types for new features
- Include tests for new components
- Update documentation as needed
- Ensure responsive design works
- Test with the actual BiteTrack API

## 📞 Support & Documentation

### **Getting Help**
- 📖 **API Documentation**: [BiteTrack API Docs](https://github.com/fcortesbio/BiteTrack/blob/main/docs/API.md)
- 📮 **Postman Collection**: [Import API endpoints](https://github.com/fcortesbio/BiteTrack/blob/main/docs/BiteTrack.postman_collection.json)
- 🐛 **Issues**: [Report bugs or request features](https://github.com/fcortesbio/BiteTrack/issues)
- 💬 **Discussions**: [Community discussions and Q&A](https://github.com/fcortesbio/BiteTrack/discussions)

### **Related Projects**
- 🔗 **Backend API**: [BiteTrack RESTful API](https://github.com/fcortesbio/BiteTrack)
- 📱 **Mobile App**: Coming soon!
- 📊 **Analytics Dashboard**: Coming soon!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Vite](https://vitejs.dev/)

---

**Made with ❤️ for small food businesses everywhere**

*Transform your food business from spreadsheet chaos to structured success with BiteTrack UI!*