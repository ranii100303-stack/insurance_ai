# AI-Powered Insurance Claims Dashboard

## Overview

This is an AI-powered vehicle insurance claims assessment platform built as a modern SaaS dashboard application. The system enables insurance adjusters to review submitted claims, visualize damage photos, and receive AI-driven recommendations for claim payouts. The platform features a multi-agent workflow that automates claim intake, cost estimation, fraud detection, and triage processes.

The application provides two main views: a dashboard listing all active claims and a detailed claim view where AI agents progressively analyze each claim to generate payout recommendations with confidence scores and fraud risk assessments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety and component development
- Vite as the build tool and development server with hot module replacement
- Wouter for lightweight client-side routing (dashboard and claim detail routes)

**Component Strategy:**
- shadcn/ui component library using Radix UI primitives for accessible, customizable components
- Tailwind CSS with custom design tokens for consistent styling following Linear/Modern SaaS patterns
- Component aliases configured (`@/components`, `@/lib`, `@/hooks`) for clean imports
- Design system documented in `design_guidelines.md` specifying Inter font, spacing scales, and card-based layouts

**State Management:**
- TanStack Query (React Query) for server state management and data fetching
- Local React state for UI-specific state (assessment progress, visible agent messages)
- Claims data currently maintained in App.tsx state, designed to be replaced with API calls

**Styling Approach:**
- Custom CSS variables defined for light/dark theme support
- Elevation and shadow system using custom CSS classes (`hover-elevate`, `active-elevate-2`)
- Responsive design with mobile-first breakpoints, single-column mobile layouts transitioning to multi-column desktop layouts

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API routing and middleware
- Dual entry points: development mode with Vite integration (`index-dev.ts`) and production mode with static file serving (`index-prod.ts`)
- Custom logging middleware tracking request duration and response details

**Development vs Production:**
- Development: Vite middleware integration with HMR for rapid development, dynamic HTML template injection
- Production: Pre-built static assets served from `dist/public` directory with fallback to index.html for client-side routing

**API Structure:**
- Routes registered through `registerRoutes` function in `server/routes.ts`
- RESTful API pattern with `/api` prefix for all application endpoints
- Storage abstraction layer (`IStorage` interface) enabling easy swapping between in-memory and database implementations

**Data Layer:**
- Currently implements `MemStorage` using in-memory Maps for rapid prototyping
- Designed to be replaced with database-backed storage (Drizzle ORM configured for PostgreSQL)
- User schema defined as starting point, ready to be extended with claim-specific schemas

### External Dependencies

**UI Component Libraries:**
- Radix UI primitives (@radix-ui/*) for accessible headless components
- Lucide React for consistent iconography
- Embla Carousel for image galleries
- CMDK for command palette functionality

**Data & Forms:**
- Zod for runtime type validation and schema definition
- React Hook Form with Zod resolvers for form validation
- Drizzle ORM and Drizzle-Zod for database ORM and schema validation

**Database:**
- PostgreSQL configured via Neon serverless driver (@neondatabase/serverless)
- Drizzle Kit for schema migrations and database management
- Connection managed through `DATABASE_URL` environment variable

**Utilities:**
- date-fns for date manipulation and formatting
- clsx and tailwind-merge for conditional CSS class composition
- class-variance-authority for type-safe component variant handling

**Development Tools:**
- Replit-specific plugins for development banner, error overlay, and cartographer integration
- TypeScript with strict mode and path aliases for improved DX
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Design System:**
- Google Fonts CDN for Inter (primary), Roboto Mono (monospace), and supporting typefaces
- Custom favicon and metadata for professional branding
- Comprehensive theme system supporting light/dark modes through CSS variables