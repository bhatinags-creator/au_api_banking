# Overview

This is a REST API Banking Portal built with a modern full-stack architecture. The application provides a banking API interface with a React frontend and Express backend, designed for developers to explore and interact with banking APIs. The project features a clean, professional UI with shadcn/ui components and implements a robust database layer using Drizzle ORM with PostgreSQL.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with a custom design system including CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful API design with `/api` prefix for all endpoints
- **Development**: Hot reload using tsx for development server
- **Production**: Bundled using esbuild for optimal performance

## Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless database
- **Schema**: Centralized schema definition in `shared/schema.ts` for type sharing
- **Migrations**: Drizzle Kit for database migrations management
- **Storage Interface**: Abstracted storage layer with both memory and database implementations

## Development Environment
- **Monorepo Structure**: Client and server code in separate directories with shared types
- **Path Aliases**: Configured for clean imports (@/ for client, @shared for shared code)
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Error Handling**: Runtime error overlay for development debugging

## Authentication & Session Management
- **Session Storage**: PostgreSQL session store using connect-pg-simple
- **User Model**: Basic user schema with username/password authentication
- **Storage Abstraction**: Interface-based design allowing for different storage backends

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database service (@neondatabase/serverless)
- **Connection**: Environment-based DATABASE_URL configuration

## UI Component Libraries
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility
- **Lucide React**: Modern icon library for consistent iconography
- **Embla Carousel**: Carousel component for interactive content display

## Development Tools
- **Replit Integration**: Custom Replit plugins for development environment
- **Vite Plugins**: Runtime error modal and cartographer for enhanced development

## Utility Libraries
- **Class Variance Authority**: Type-safe variant API for component styling
- **clsx & tailwind-merge**: Utility functions for conditional CSS classes
- **date-fns**: Modern date manipulation library
- **nanoid**: URL-safe unique ID generator

## Form & Validation
- **Zod**: TypeScript-first schema validation library
- **Drizzle-Zod**: Integration between Drizzle ORM and Zod for schema validation

## Build & Deployment
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer