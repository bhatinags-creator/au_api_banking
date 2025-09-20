# Overview

This is the AU Bank Developer Portal (Internal Users) built with a modern full-stack architecture. The application provides internal banking API interfaces with a React frontend and Express backend, designed specifically for AU Bank's internal development teams and employees. The project features a clean, professional UI with shadcn/ui components and implements a robust database layer using Drizzle ORM with PostgreSQL.

**Current Status**: Comprehensive API catalog with 26 production-ready APIs across 9 categories including Payments and Loans, with complete documentation and deployment scripts ready for production use.

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

# Recent Changes

## December 2024 - Loan API Implementation
- **Completed**: Comprehensive loan API implementation with 12 APIs across 3 service categories:
  - **Collateral Management Services** (4 APIs): Dedupe, Enquiry, Linkage Modification, and Modification
  - **Disbursement Services** (3 APIs): EMI calculation, loan disbursement, and schedule generation
  - **Loan Management Services** (5 APIs): Deduction details, stage tracking, account statements, closure details, and disbursement details
- **Scripts Created**: Individual TypeScript seed scripts and consolidated SQL deployment scripts
- **Production Ready**: Updated production-api-endpoints-insert.sql with all 26 APIs (14 Payment + 12 Loan)
- **Database Status**: Application running with 9 categories and 62 APIs total
- **Performance**: Cache optimization implemented with sub-second response times for cached data

# Project Architecture

## API Implementation Status
- **Total APIs**: 26 production-ready APIs
- **Categories**: 9 comprehensive banking service categories
- **Payment APIs**: 14 APIs (BBPS, E-NACH, UPI Payout services)
- **Loan APIs**: 12 APIs (Collateral, Disbursement, Management services)
- **Documentation**: Complete field-level validation specs with business rules and production examples