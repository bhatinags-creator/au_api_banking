# AU Bank Internal Developer Portal - Comprehensive Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Structure](#database-structure)
6. [API Architecture](#api-architecture)
7. [Authentication & Security](#authentication--security)
8. [Development Environment](#development-environment)
9. [Deployment Guide](#deployment-guide)
10. [Critical Information](#critical-information)

---

## Application Overview

The **AU Bank Internal Developer Portal** is a comprehensive, production-ready platform designed specifically for AU Bank's internal development teams and employees. It provides:

- **32 Banking APIs** across 9 categories with complete documentation
- **Interactive API Testing Playground** (Sandbox environment)
- **Admin Management Panel** with full CRUD operations
- **Enterprise-grade Authentication** with role-based access
- **Comprehensive Analytics** and usage tracking
- **Hierarchical API Organization** (Categories → APIs → Documentation & Sandbox)

### Key Features
- 🏦 **Banking API Portfolio**: Authentication, Digital Payments, Customer Services, Loans, Cards, etc.
- 🎮 **Interactive Sandbox**: Real-time API testing with live examples
- 👨‍💼 **Admin Panel**: Complete management of categories, APIs, and users
- 🔐 **Enterprise Security**: Session management, audit logs, rate limiting
- 📊 **Analytics Dashboard**: API usage tracking and performance metrics
- 🎨 **AU Bank Branding**: Official purple theme (#603078)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    AU BANK DEVELOPER PORTAL                     │
│                      (Frontend - React)                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/REST API
                      │ Port 5000
┌─────────────────────▼───────────────────────────────────────────┐
│                   EXPRESS.JS SERVER                             │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │ Authentication│ │   API Routes │ │   Admin Management      │  │
│  │   & Sessions  │ │   & Sandbox  │ │   & Analytics          │  │
│  └──────────────┘ └──────────────┘ └─────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Database Queries
                      │ PostgreSQL Connection
┌─────────────────────▼───────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Tables: users, developers, api_endpoints, sessions,     │   │
│  │         audit_logs, api_usage, corporate_registrations  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

          ┌─────────────────────────────────────────┐
          │           EXTERNAL SYSTEMS              │
          │  ┌─────────────────────────────────────┐ │
          │  │   Replit Deployment Platform        │ │
          │  │   - Auto-scaling                    │ │
          │  │   - SSL/TLS termination             │ │
          │  │   - Load balancing                  │ │
          │  └─────────────────────────────────────┘ │
          └─────────────────────────────────────────┘
```

---

## Technology Stack

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v20.19.3 | JavaScript runtime environment |
| **Express.js** | v4.21.2 | Web application framework |
| **TypeScript** | v5.6.3 | Type-safe JavaScript |
| **Drizzle ORM** | v0.39.1 | Database ORM with type safety |
| **PostgreSQL** | Latest | Primary database (Neon serverless) |
| **Zod** | v3.24.2 | Schema validation |
| **Passport.js** | v0.7.0 | Authentication middleware |
| **Express Session** | v1.18.1 | Session management |
| **Bcrypt** | v6.0.0 | Password hashing |
| **Helmet** | v8.1.0 | Security middleware |
| **CORS** | v2.8.5 | Cross-origin resource sharing |

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | v18.3.1 | UI library |
| **TypeScript** | v5.6.3 | Type-safe JavaScript |
| **Vite** | v5.4.19 | Build tool and dev server |
| **TanStack Query** | v5.60.5 | Server state management |
| **Wouter** | v3.3.5 | Lightweight routing |
| **Tailwind CSS** | v3.4.17 | Utility-first CSS framework |
| **Radix UI** | v1.x | Accessible component primitives |
| **Shadcn/UI** | Latest | Pre-built component library |
| **React Hook Form** | v7.55.0 | Form handling |
| **Framer Motion** | v11.13.1 | Animation library |
| **Lucide React** | v0.453.0 | Icon library |
| **Recharts** | v2.15.2 | Chart and analytics library |

### Development & Build Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESBuild** | v0.25.0 | Fast JavaScript bundler |
| **PostCSS** | v8.4.47 | CSS processing |
| **Autoprefixer** | v10.4.20 | CSS vendor prefixing |
| **TSX** | v4.19.1 | TypeScript execution |
| **Drizzle Kit** | v0.30.4 | Database migrations |

### Replit Platform Integration
| Technology | Version | Purpose |
|------------|---------|---------|
| **Replit Vite Plugins** | Latest | Development tools integration |
| **Neon PostgreSQL** | Latest | Serverless database hosting |
| **Replit Deployments** | Latest | Auto-scaling deployment |

---

## Project Structure

```
AU-Bank-Developer-Portal/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/                  # Shadcn/UI components library (35+ components)
│   │   │       ├── accordion.tsx    # Collapsible content sections
│   │   │       ├── alert-dialog.tsx # Modal confirmation dialogs
│   │   │       ├── alert.tsx        # Notification alert components
│   │   │       ├── avatar.tsx       # User profile image component
│   │   │       ├── badge.tsx        # Status and category badges
│   │   │       ├── button.tsx       # Interactive button components
│   │   │       ├── card.tsx         # Content container components
│   │   │       ├── checkbox.tsx     # Form checkbox inputs
│   │   │       ├── dialog.tsx       # Modal dialog overlays
│   │   │       ├── dropdown-menu.tsx# Context menu dropdowns
│   │   │       ├── form.tsx         # Form wrapper and field components
│   │   │       ├── input.tsx        # Text input components
│   │   │       ├── label.tsx        # Form field labels
│   │   │       ├── select.tsx       # Dropdown selection component
│   │   │       ├── separator.tsx    # Visual divider elements
│   │   │       ├── sheet.tsx        # Slide-out panel component
│   │   │       ├── sidebar.tsx      # Navigation sidebar component
│   │   │       ├── skeleton.tsx     # Loading placeholder components
│   │   │       ├── table.tsx        # Data table components
│   │   │       ├── tabs.tsx         # Tab navigation components
│   │   │       ├── textarea.tsx     # Multi-line text input
│   │   │       ├── toast.tsx        # Notification toast messages
│   │   │       ├── toaster.tsx      # Toast container component
│   │   │       └── tooltip.tsx      # Hover information tooltips
│   │   ├── hooks/
│   │   │   ├── use-mobile.tsx       # Mobile device detection hook
│   │   │   ├── use-toast.ts         # Toast notification management
│   │   │   ├── useAuth.ts           # User authentication state management
│   │   │   └── useConfigurations.ts # Application configuration hook
│   │   ├── lib/
│   │   │   ├── dynamicValidation.ts # Runtime form validation utilities
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   └── utils.ts             # Common utility functions and helpers
│   │   ├── pages/
│   │   │   ├── admin.tsx            # Administrative panel for managing APIs/users
│   │   │   ├── admin_temp.tsx       # Temporary admin interface backup
│   │   │   ├── analytics.tsx        # API usage analytics and metrics dashboard
│   │   │   ├── api-docs.tsx         # Interactive API documentation viewer
│   │   │   ├── api-explorer.tsx     # API browsing and discovery interface
│   │   │   ├── corporate-registration.tsx # Corporate client registration form
│   │   │   ├── dashboard.tsx        # Main user dashboard with overview
│   │   │   ├── home.tsx             # Landing page and portal introduction
│   │   │   ├── not-found.tsx        # 404 error page component
│   │   │   ├── sandbox.tsx          # Interactive API testing playground
│   │   │   ├── signin.tsx           # User authentication login form
│   │   │   └── signup.tsx           # New user registration form
│   │   ├── App.tsx                  # Main React application router
│   │   ├── index.css                # Global styles with AU Bank branding
│   │   └── main.tsx                 # React application entry point
│   └── index.html                   # HTML template with meta tags
├── server/                          # Backend Express application
│   ├── auth.ts                      # Authentication middleware and authorization
│   ├── db.ts                        # Database connection and configuration
│   ├── index.ts                     # Express server entry point and setup
│   ├── routes.ts                    # API route definitions and handlers (3,000+ lines)
│   ├── session.ts                   # Session management configuration
│   ├── storage.ts                   # Database operations and data access layer
│   └── vite.ts                      # Vite development server integration
├── shared/                          # Shared code between client and server
│   ├── data.ts                      # Centralized API definitions (32 APIs, 1,500+ lines)
│   └── schema.ts                    # Database schema and Zod validation types
├── scripts/                         # Utility and maintenance scripts
│   ├── migrate-documentation.ts    # Documentation migration utilities
│   └── seed-analytics.ts           # Analytics data seeding script
├── temp/                           # Temporary file storage
│   └── uploads/                    # Uploaded document processing directory
├── attached_assets/                # Static assets and documentation uploads
│   ├── Bank Account Verify/        # Account verification API documentation
│   ├── BBPS/                      # Bill payment service documentation
│   ├── CNB Payout/                # Payout service documentation
│   ├── Emandate/                  # E-mandate service documentation
│   ├── Encryption/                # Encryption service documentation
│   ├── generated_images/          # AI-generated portal illustrations
│   ├── UPIPayout/                 # UPI payout service documentation
│   ├── VAM/                       # Virtual account management documentation
│   └── [Various documentation files and images]
├── AWS_DEPLOYMENT_GUIDE.md         # Comprehensive AWS infrastructure setup guide
├── COMPREHENSIVE_DOCUMENTATION.md  # Complete project documentation (900+ lines)
├── DEPLOYMENT_GUIDE.md             # General deployment instructions
├── components.json                 # Shadcn/UI configuration and aliases
├── database_seed_scripts.sql       # Database initialization and seed data
├── drizzle.config.ts              # Database migration and schema configuration
├── package.json                   # Node.js dependencies and scripts
├── postcss.config.js              # PostCSS configuration for Tailwind
├── replit.md                      # Project overview and development notes
├── tailwind.config.ts             # Tailwind CSS configuration and theme
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite build tool configuration
```

### Detailed Folder and File Descriptions

#### `/client` - Frontend React Application
**Purpose**: Complete user interface for the AU Bank Developer Portal

**Key Features**:
- **Modern React Architecture**: Built with React 18, TypeScript, and Vite for optimal performance
- **Component Library**: 35+ Shadcn/UI components for consistent design system
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure user login/logout with session management
- **Multi-page Application**: 12 distinct pages covering all portal functionality

**Directory Structure**:
- **`src/components/ui/`**: Comprehensive UI component library including forms, dialogs, tables, navigation
- **`src/hooks/`**: Custom React hooks for authentication, mobile detection, and configuration management
- **`src/lib/`**: Utility libraries for API calls, validation, and common functions
- **`src/pages/`**: Complete page components for different portal sections (admin, analytics, API docs, sandbox)

#### `/server` - Backend Express API Server
**Purpose**: RESTful API server providing all backend functionality

**Key Features**:
- **Express.js Framework**: Production-ready server with middleware stack
- **Authentication & Authorization**: Role-based access control (admin, developer, manager)
- **Database Integration**: Drizzle ORM with PostgreSQL for data persistence
- **Security**: Rate limiting, CORS, Helmet, session management
- **File Upload**: Document parsing for API documentation (PDF, DOCX, TXT)
- **Audit Logging**: Comprehensive activity tracking for security and compliance

**Core Files**:
- **`routes.ts`**: 3,000+ lines of API endpoint definitions covering all portal functionality
- **`auth.ts`**: Authentication middleware, role-based access control, and API key validation
- **`storage.ts`**: Database abstraction layer with CRUD operations for all entities
- **`session.ts`**: Production-grade session management with PostgreSQL storage

#### `/shared` - Common Code Layer
**Purpose**: Type-safe shared code between frontend and backend

**Key Components**:
- **`schema.ts`**: Complete database schema definitions using Drizzle ORM with Zod validation
- **`data.ts`**: Centralized API definitions (32 banking APIs across 9 categories) - 1,500+ lines

**Benefits**:
- **Type Safety**: Shared TypeScript types ensure frontend/backend compatibility
- **Single Source of Truth**: API definitions and database schemas centrally managed
- **Validation**: Zod schemas provide runtime type checking and validation

#### `/scripts` - Utility and Maintenance Scripts
**Purpose**: Automated tasks for documentation migration and analytics seeding

**Files**:
- **`migrate-documentation.ts`**: Utilities for migrating API documentation from external sources
- **`seed-analytics.ts`**: Script for populating analytics data for testing and development

#### `/attached_assets` - Documentation and Media Storage
**Purpose**: Repository for uploaded documentation, images, and reference materials

**Contents**:
- **API Documentation**: Organized folders for different banking service documentation
- **Generated Images**: AI-generated illustrations for portal branding and documentation
- **Reference Materials**: Banking API specifications, integration guides, and technical documents

#### `/temp` - Temporary File Processing
**Purpose**: Temporary storage for file uploads and document processing

**Usage**:
- **Document Upload**: Temporary storage for PDF, DOCX, and TXT files during API documentation upload
- **Processing Pipeline**: Files are processed, parsed, and then automatically cleaned up

#### **Configuration Files**

**`components.json`** - Shadcn/UI Configuration
- **Component Library Setup**: Defines component paths, styling configuration, and theme customization
- **Import Aliases**: Configures path aliases for clean component imports
- **Tailwind Integration**: Connects Shadcn/UI with Tailwind CSS for consistent styling

**`drizzle.config.ts`** - Database Configuration
- **Schema Management**: Defines database connection and migration settings
- **Development/Production**: Environment-specific database configurations
- **Migration Control**: Handles database schema updates and versioning

**`tailwind.config.ts`** - Styling Configuration
- **AU Bank Theme**: Custom color palette, typography, and component styling
- **Dark Mode**: Complete light/dark theme support
- **Component Extensions**: Custom utilities and component variants

**`tsconfig.json`** - TypeScript Configuration
- **Strict Type Checking**: Enforces type safety across the entire application
- **Path Mapping**: Enables clean imports with @ aliases
- **Modern ES Features**: Configured for latest TypeScript and JavaScript features

**`vite.config.ts`** - Build Tool Configuration
- **Development Server**: Hot reload, proxy configuration, and development optimizations
- **Production Build**: Optimized bundling, code splitting, and asset management
- **Plugin Integration**: React, TypeScript, and Replit-specific plugins

---

## Database Structure

### Core Tables

#### 1. **sessions**
```sql
-- Session storage for production-grade session management
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IDX_session_expire ON sessions(expire);
```

#### 2. **users**
```sql
-- Enhanced user table for internal developers
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'developer', -- developer, admin, manager
  employee_id TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 3. **developers**
```sql
-- Internal developer profiles linked to users
CREATE TABLE developers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT,
  team TEXT,
  projects_assigned JSONB DEFAULT '[]',
  permissions JSONB DEFAULT '{"sandbox": true, "uat": false, "production": false}',
  api_key TEXT NOT NULL UNIQUE,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  last_active_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 4. **api_categories**
```sql
-- API Categories for organization
CREATE TABLE api_categories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code',
  color TEXT NOT NULL DEFAULT '#603078',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 5. **api_endpoints**
```sql
-- Enhanced API endpoints with production features
CREATE TABLE api_endpoints (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id VARCHAR REFERENCES api_categories(id),
  category TEXT NOT NULL, -- Keep for backwards compatibility
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  method TEXT NOT NULL,
  description TEXT NOT NULL,
  summary TEXT,
  parameters JSONB DEFAULT '[]',
  headers JSONB DEFAULT '[]',
  responses JSONB DEFAULT '[]',
  request_example TEXT,
  response_example TEXT,
  documentation TEXT,
  tags JSONB DEFAULT '[]',
  response_schema JSONB DEFAULT '{}',
  rate_limits JSONB DEFAULT '{"sandbox": 100, "uat": 500, "production": 1000}',
  timeout INTEGER DEFAULT 30000,
  requires_auth BOOLEAN NOT NULL DEFAULT true,
  auth_type TEXT DEFAULT 'bearer',
  required_permissions JSONB DEFAULT '["sandbox"]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_internal BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active', -- active, deprecated, draft
  version TEXT NOT NULL DEFAULT 'v1',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 6. **api_usage**
```sql
-- API usage tracking with enhanced metrics
CREATE TABLE api_usage (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id VARCHAR REFERENCES developers(id) NOT NULL,
  application_id VARCHAR REFERENCES applications(id) NOT NULL,
  endpoint_id VARCHAR REFERENCES api_endpoints(id) NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  total_response_time INTEGER NOT NULL DEFAULT 0, -- in milliseconds
  environment TEXT NOT NULL DEFAULT 'sandbox',
  date TIMESTAMP DEFAULT NOW() NOT NULL,
  month TEXT NOT NULL -- YYYY-MM format for easy querying
);
```

#### 7. **audit_logs**
```sql
-- Comprehensive audit logging
CREATE TABLE audit_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  action TEXT NOT NULL, -- login, logout, api_call, config_change, etc.
  resource TEXT, -- what was affected
  resource_id TEXT, -- ID of the affected resource
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 8. **api_tokens**
```sql
-- API keys and tokens management
CREATE TABLE api_tokens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id VARCHAR REFERENCES developers(id) NOT NULL,
  name TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '[]',
  environment TEXT NOT NULL DEFAULT 'sandbox',
  expires_at TIMESTAMP,
  last_used_at TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 9. **applications**
```sql
-- Internal applications and projects
CREATE TABLE applications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id VARCHAR REFERENCES developers(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'internal', -- internal, integration, testing
  environment TEXT NOT NULL DEFAULT 'sandbox', -- sandbox, uat, production
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, archived
  configuration JSONB DEFAULT '{}',
  approved_by VARCHAR REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 10. **corporate_registrations**
```sql
-- Corporate registration for external partnerships
CREATE TABLE corporate_registrations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, rejected
  otp_code TEXT,
  otp_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Database Relationships

```
users (1) ←→ (1) developers
developers (1) ←→ (N) applications
developers (1) ←→ (N) api_tokens
developers (1) ←→ (N) api_usage
api_categories (1) ←→ (N) api_endpoints
api_endpoints (1) ←→ (N) api_usage
applications (1) ←→ (N) api_usage
users (1) ←→ (N) audit_logs
```

---

## API Architecture

### API Categories & Endpoints (32 Total)

#### 1. **Authentication** (3 APIs)
- OAuth 2.0 Token
- API Key Validation  
- Bearer Token Refresh

#### 2. **Digital Payments** (3 APIs)
- UPI Payment Gateway
- NEFT Transfer Service
- RTGS High Value Transfer

#### 3. **Customer** (13 APIs)
- Customer 360 Service
- KYC Verification
- Account Balance Inquiry
- Aadhar Vault - Insert Token
- Aadhar Vault - Get Value
- Aadhar Vault - Get Token
- CIBIL Service
- CIF Creation Service
- CKYC Search
- Customer Dedupe Service
- Customer Image Upload Service
- POSIDEX - Fetch UCIC
- Update Customer Details Service

#### 4. **Loans** (2 APIs)
- Loan Application
- Loan Status Check

#### 5. **Liabilities** (2 APIs)
- Fixed Deposit Creation
- Recurring Deposit Setup

#### 6. **Cards** (2 APIs)
- Credit Card Application
- Debit Card Services

#### 7. **Payments** (2 APIs)
- International Wire Transfer
- Domestic Payment Processing

#### 8. **Trade Services** (2 APIs)
- Letter of Credit
- Bank Guarantee

#### 9. **Corporate API Suite** (3 APIs)
- Corporate Account Opening
- Bulk Payment Processing
- Treasury Management

### API Data Structure

Each API endpoint contains comprehensive configuration:

```typescript
interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  category: string;
  description: string;
  summary: string;
  requiresAuth: boolean;
  authType: string;
  parameters: Parameter[];
  headers: Header[];
  responses: Response[];
  requestExample: string;
  responseExample: string;
  responseSchema: object;
  status: 'active' | 'deprecated' | 'beta';
  tags: string[];
  rateLimits: {
    sandbox: number;
    production: number;
  };
  timeout: number;
  documentation: string;
  sandbox: {
    enabled: boolean;
    testData: any[];
    mockResponse: any;
    rateLimits: object;
  };
}
```

---

## Complete API Reference

This section provides comprehensive documentation for all 32 banking APIs available in the AU Bank Developer Portal, organized by category with detailed specifications, parameters, examples, and sandbox testing capabilities.

### API Overview Statistics

- **Total APIs**: 32 endpoints across 9 categories
- **Authentication**: OAuth 2.0, Bearer tokens, API keys
- **Rate Limiting**: Environment-specific (Sandbox: 100-1000 req/min, Production: 1000-5000 req/min)
- **Response Format**: JSON
- **Error Handling**: Standard HTTP status codes with detailed error messages
- **Sandbox Testing**: All APIs support sandbox environment with mock data

---

### Category 1: Authentication APIs (3 endpoints)
*Essential APIs for secure authentication and authorization including OAuth, JWT tokens, and user management*

#### 1.1 OAuth 2.0 Token Generation
- **Endpoint**: `POST /oauth/token`
- **Purpose**: Generate OAuth access tokens for secure API authentication
- **Authentication**: Basic Auth (client credentials)
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

**Parameters:**
```json
{
  "grant_type": "client_credentials", // Required: OAuth grant type
  "scope": "read write"              // Optional: Access scope
}
```

**Headers:**
```
Authorization: Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=
Content-Type: application/x-www-form-urlencoded
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Sandbox Testing**: Enabled with test credentials

#### 1.2 JWT Token Refresh
- **Endpoint**: `POST /auth/refresh`
- **Purpose**: Refresh expired JWT tokens for session management
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 200/min, Production: 2000/min

**Parameters:**
```json
{
  "refresh_token": "refresh_abc123" // Required: Valid refresh token
}
```

**Response (200):**
```json
{
  "access_token": "new_jwt_token",
  "expires_in": 3600
}
```

#### 1.3 User Profile Management
- **Endpoint**: `GET /auth/profile`
- **Purpose**: Retrieve authenticated user profile and permissions
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 500/min, Production: 5000/min

**Response (200):**
```json
{
  "user_id": "usr_123",
  "username": "john.doe",
  "permissions": ["read", "write"]
}
```

---

### Category 2: Digital Payments APIs (3 endpoints)
*Modern payment processing APIs including UPI, digital wallets, and real-time payment systems*

#### 2.1 UPI Payment Processing
- **Endpoint**: `POST /payments/upi`
- **Purpose**: Process UPI payments with real-time settlement
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

**Parameters:**
```json
{
  "amount": 1000.00,              // Required: Payment amount in INR
  "vpa": "user@paytm",           // Required: Virtual Payment Address
  "reference_id": "TXN123456789" // Required: Unique transaction reference
}
```

**Response (200):**
```json
{
  "transaction_id": "UPI123456",
  "status": "SUCCESS",
  "amount": 1000.00,
  "timestamp": "2024-01-01T10:00:00Z"
}
```

#### 2.2 NEFT Transfer
- **Endpoint**: `POST /payments/neft`
- **Purpose**: Process NEFT transfers with secure fund transfer
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

**Parameters:**
```json
{
  "amount": 50000,                  // Required: Transfer amount
  "beneficiary_account": "1234567890" // Required: Beneficiary account number
}
```

**Response (200):**
```json
{
  "transfer_id": "NEFT123456",
  "status": "INITIATED",
  "amount": 50000
}
```

#### 2.3 RTGS Transfer
- **Endpoint**: `POST /payments/rtgs`
- **Purpose**: Real-time gross settlement for high-value transactions (minimum 2 lakhs)
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 20/min, Production: 200/min

**Parameters:**
```json
{
  "amount": 500000,                 // Required: Transfer amount (minimum 200,000)
  "beneficiary_account": "9876543210" // Required: Beneficiary account
}
```

**Response (200):**
```json
{
  "transfer_id": "RTGS789123",
  "status": "COMPLETED",
  "amount": 500000
}
```

---

### Category 3: Customer APIs (13 endpoints)
*Essential APIs for integrating with core banking services including KYC verification, account validation, and identity checks*

#### 3.1 Customer 360 Service
- **Endpoint**: `GET /customer/360-view`
- **Purpose**: Comprehensive customer profile with banking relationship overview
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

#### 3.2 KYC Verification
- **Endpoint**: `POST /customer/kyc/verify`
- **Purpose**: Complete KYC verification with document validation
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

#### 3.3 Account Balance Inquiry
- **Endpoint**: `GET /customer/balance`
- **Purpose**: Real-time account balance check with transaction history
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 200/min, Production: 2000/min

#### 3.4 Aadhar Vault - Insert Token
- **Endpoint**: `POST /customer/aadhar/insert-token`
- **Purpose**: Securely store Aadhar information with tokenization
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

#### 3.5 Aadhar Vault - Get Value
- **Endpoint**: `GET /customer/aadhar/get-value`
- **Purpose**: Retrieve Aadhar information using secure token
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

#### 3.6 Aadhar Vault - Get Token
- **Endpoint**: `GET /customer/aadhar/get-token`
- **Purpose**: Generate secure token for Aadhar information
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

#### 3.7 CIBIL Service
- **Endpoint**: `POST /customer/cibil/check`
- **Purpose**: Credit score verification and credit history analysis
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

#### 3.8 CIF Creation Service
- **Endpoint**: `POST /customer/cif/create`
- **Purpose**: Customer Information File creation for new customers
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

#### 3.9 CKYC Search
- **Endpoint**: `GET /customer/ckyc/search`
- **Purpose**: Central KYC registry search for existing customer records
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

#### 3.10 Customer Dedupe Service
- **Endpoint**: `POST /customer/dedupe`
- **Purpose**: Duplicate customer detection and consolidation
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

#### 3.11 Customer Image Upload Service
- **Endpoint**: `POST /customer/image/upload`
- **Purpose**: Secure customer photo and document image upload
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 20/min, Production: 200/min

#### 3.12 POSIDEX - Fetch UCIC
- **Endpoint**: `GET /customer/posidex/ucic`
- **Purpose**: Unique Customer Identification Code retrieval
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

#### 3.13 Update Customer Details Service
- **Endpoint**: `PUT /customer/update`
- **Purpose**: Update existing customer information and preferences
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

---

### Category 4: Loans APIs (2 endpoints)
*Comprehensive loan management APIs for personal loans, home loans, and business financing*

#### 4.1 Loan Application
- **Endpoint**: `POST /loans/application`
- **Purpose**: Submit new loan applications with automated approval workflows
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

**Parameters:**
```json
{
  "loan_type": "personal",      // Required: Loan type (personal, home, business)
  "amount": 500000,            // Required: Requested loan amount
  "tenure": 36,                // Required: Loan tenure in months
  "customer_id": "CUST123456"  // Required: Customer identifier
}
```

**Response (200):**
```json
{
  "application_id": "LOAN123456",
  "status": "UNDER_REVIEW",
  "estimated_processing_time": "3-5 business days"
}
```

#### 4.2 Loan Status Check
- **Endpoint**: `GET /loans/status`
- **Purpose**: Real-time loan application status tracking
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

**Parameters:**
```
?application_id=LOAN123456  // Required: Loan application ID
```

**Response (200):**
```json
{
  "application_id": "LOAN123456",
  "status": "APPROVED",
  "approved_amount": 450000,
  "interest_rate": 8.5,
  "next_step": "Visit branch for documentation"
}
```

---

### Category 5: Liabilities APIs (2 endpoints)
*Deposit and liability management APIs for fixed deposits, recurring deposits, and account management*

#### 5.1 Fixed Deposit Creation
- **Endpoint**: `POST /liabilities/fd/create`
- **Purpose**: Create fixed deposit accounts with competitive interest rates
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

#### 5.2 Recurring Deposit Setup
- **Endpoint**: `POST /liabilities/rd/create`
- **Purpose**: Set up recurring deposit accounts with automatic debit
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

---

### Category 6: Cards APIs (2 endpoints)
*Complete card lifecycle management APIs for credit cards and debit cards*

#### 6.1 Credit Card Application
- **Endpoint**: `POST /cards/credit/apply`
- **Purpose**: Credit card application processing with instant approval
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 50/min, Production: 500/min

#### 6.2 Debit Card Services
- **Endpoint**: `POST /cards/debit/services`
- **Purpose**: Debit card activation, PIN generation, and management
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

---

### Category 7: Payments APIs (2 endpoints)
*Enterprise payment processing APIs for domestic and international transfers*

#### 7.1 International Wire Transfer
- **Endpoint**: `POST /payments/wire/international`
- **Purpose**: International wire transfers with SWIFT integration
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 20/min, Production: 200/min

#### 7.2 Domestic Payment Processing
- **Endpoint**: `POST /payments/domestic`
- **Purpose**: Domestic payment processing for business transactions
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 100/min, Production: 1000/min

---

### Category 8: Trade Services APIs (2 endpoints)
*International trade finance APIs including Letters of Credit and Bank Guarantees*

#### 8.1 Letter of Credit
- **Endpoint**: `POST /trade/letter-of-credit`
- **Purpose**: Letter of Credit issuance for international trade
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 10/min, Production: 100/min

#### 8.2 Bank Guarantee
- **Endpoint**: `POST /trade/bank-guarantee`
- **Purpose**: Bank guarantee issuance for business transactions
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 10/min, Production: 100/min

---

### Category 9: Corporate API Suite (3 endpoints)
*Advanced corporate banking APIs for enterprise clients with bulk operations and treasury management*

#### 9.1 Corporate Account Opening
- **Endpoint**: `POST /corporate/account/open`
- **Purpose**: Streamlined corporate account opening with digital onboarding
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 20/min, Production: 200/min

**Parameters:**
```json
{
  "company_name": "Tech Corp Ltd",
  "business_type": "Technology",
  "registration_number": "CIN123456789",
  "authorized_signatory": {
    "name": "John Doe",
    "designation": "Director"
  }
}
```

#### 9.2 Bulk Payment Processing
- **Endpoint**: `POST /corporate/payments/bulk`
- **Purpose**: Process multiple payments in a single batch operation
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 5/min, Production: 50/min
- **Timeout**: 300 seconds (5 minutes)

**Parameters:**
```json
{
  "batch_id": "BATCH123456",
  "payments": [
    {"to_account": "ACC123", "amount": 1000},
    {"to_account": "ACC456", "amount": 2000}
  ]
}
```

**Response (200):**
```json
{
  "batch_id": "BATCH123456",
  "total_amount": 50000.00,
  "successful_payments": 10,
  "failed_payments": 0
}
```

#### 9.3 Treasury Management
- **Endpoint**: `POST /corporate/treasury`
- **Purpose**: Advanced treasury management for corporate liquidity optimization
- **Authentication**: Bearer Token
- **Rate Limits**: Sandbox: 20/min, Production: 200/min

**Parameters:**
```json
{
  "operation_type": "CASH_SWEEP",  // Required: Treasury operation type
  "amount": 1000000               // Required: Operation amount
}
```

**Response (200):**
```json
{
  "operation_id": "TREAS123",
  "status": "EXECUTED",
  "yield_rate": 6.5
}
```

---

### API Testing & Sandbox Environment

#### Sandbox Configuration
All APIs support sandbox testing with:
- **Mock Data**: Pre-configured test scenarios
- **Rate Limiting**: Reduced limits for development
- **Real-time Testing**: Interactive API explorer
- **Error Simulation**: Test error handling scenarios

#### Getting Started with API Testing
1. **Authentication**: Obtain sandbox API credentials from admin panel
2. **Base URL**: Use sandbox endpoint: `https://sandbox-api.aubank.in`
3. **Test Data**: Use provided test customer and account data
4. **Rate Limits**: Respect sandbox rate limits (typically 10x lower than production)

#### Common Response Codes
- **200**: Success
- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid or missing authentication
- **403**: Forbidden - Insufficient permissions
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error

---

### API Security & Best Practices

#### Authentication Flow
1. Obtain OAuth 2.0 token using client credentials
2. Include Bearer token in Authorization header
3. Refresh tokens before expiration
4. Implement proper error handling

#### Rate Limiting
- All APIs implement rate limiting based on API key
- Limits vary by environment (sandbox vs production)
- Include rate limit headers in responses
- Implement exponential backoff for retries

#### Data Validation
- All inputs validated using Zod schemas
- Comprehensive error messages for invalid data
- SQL injection and XSS protection
- Input sanitization and output encoding

---

## System Architecture Overview

This section provides comprehensive architecture diagrams and system design documentation for the AU Bank Developer Portal, illustrating the complete technical architecture, data flow, and component interactions.

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AU BANK DEVELOPER PORTAL ARCHITECTURE                    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              FRONTEND LAYER                                │ │
│  │                                                                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   React 18 App  │    │  Shadcn/UI      │    │   TailwindCSS   │         │ │
│  │  │   + TypeScript  │    │  Components     │    │   Styling       │         │ │
│  │  │   + Vite        │    │  (35+ Components)│    │   + Animations  │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │                                     │                                       │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Wouter Router │    │ TanStack Query  │    │  React Hooks    │         │ │
│  │  │   (12 Pages)    │    │ State Mgmt      │    │  Custom Logic   │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │ HTTP/HTTPS Requests                         │
│                                    │ (JSON API + Authentication)                │
│  ┌─────────────────────────────────▼───────────────────────────────────────────┐ │
│  │                             MIDDLEWARE LAYER                               │ │
│  │                                                                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   CORS Policy   │    │  Rate Limiting  │    │    Helmet       │         │ │
│  │  │   Security      │    │  Protection     │    │   Security      │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │                                     │                                       │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │ Authentication  │    │ Session Mgmt    │    │  Authorization  │         │ │
│  │  │ Middleware      │    │ PostgreSQL      │    │  Role-Based     │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │                                             │
│  ┌─────────────────────────────────▼───────────────────────────────────────────┐ │
│  │                             BACKEND LAYER                                  │ │
│  │                           (Express.js + TypeScript)                        │ │
│  │                                                                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │  API Routes     │    │   Storage       │    │  File Upload    │         │ │
│  │  │  (3000+ lines)  │    │   Interface     │    │  Processing     │         │ │
│  │  │  32 Endpoints   │    │   (CRUD Ops)    │    │  (PDF/DOCX/TXT) │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │                                     │                                       │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │  Audit Logging  │    │  API Analytics  │    │  Error Handling │         │ │
│  │  │  System         │    │  Tracking       │    │  & Validation   │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └─────────────────────────────────┬───────────────────────────────────────────┘ │
│                                    │ SQL Queries + Drizzle ORM                  │
│  ┌─────────────────────────────────▼───────────────────────────────────────────┐ │
│  │                             DATABASE LAYER                                 │ │
│  │                            (PostgreSQL)                                    │ │
│  │                                                                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │   Core Tables   │    │  Configuration  │    │  Documentation  │         │ │
│  │  │  • users        │    │  • ui_configs   │    │  • doc_categories│         │ │
│  │  │  • developers   │    │  • form_configs │    │  • doc_endpoints │         │ │
│  │  │  • api_endpoints│    │  • validations  │    │  • doc_params   │         │ │
│  │  │  • applications │    │  • environments │    │  • doc_responses│         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  │                                     │                                       │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │ │
│  │  │  Analytics      │    │   Security      │    │  Session Store  │         │ │
│  │  │  • api_usage    │    │  • audit_logs   │    │  • sessions     │         │ │
│  │  │  • daily_analytics│  │  • api_tokens   │    │  • api_keys     │         │ │
│  │  │  • api_activity │    │  • permissions  │    │  • auth_data    │         │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                  │
│                                                                                 │
│  USER JOURNEY                      DATA PROCESSING                   STORAGE    │
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │    User     │───▶│  Frontend   │───▶│  Middleware │───▶│  Database   │      │
│  │  (Browser)  │    │  (React)    │    │  (Express)  │    │(PostgreSQL) │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
│         │                   │                   │                   │          │
│         │                   │                   │                   │          │
│         ▼                   ▼                   ▼                   ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ 1. Login    │    │ 2. API Call │    │ 3. Auth     │    │ 4. Query    │      │
│  │ Authentication│  │ with Token  │    │ Validation  │    │ Execution   │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
│         │                   │                   │                   │          │
│         │                   │                   │                   │          │
│         ▼                   ▼                   ▼                   ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ 5. Session  │    │ 6. Data     │    │ 7. Business │    │ 8. Response │      │
│  │ Creation    │    │ Validation  │    │ Logic       │    │ Formatting  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
│         │                   │                   │                   │          │
│         │                   │                   │                   │          │
│         ▼                   ▼                   ▼                   ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ 9. Audit    │    │10. Analytics│    │11. Cache    │    │12. Response │      │
│  │ Logging     │    │ Tracking    │    │ Update      │    │ to Client   │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT INTERACTION DIAGRAM                           │
│                                                                                 │
│  FRONTEND COMPONENTS          BACKEND SERVICES          DATABASE ENTITIES       │
│                                                                                 │
│  ┌─────────────┐              ┌─────────────┐              ┌─────────────┐      │
│  │    Pages    │─────────────▶│  API Routes │─────────────▶│    Tables   │      │
│  │             │              │             │              │             │      │
│  │ • Home      │              │ • Auth      │              │ • users     │      │
│  │ • Admin     │              │ • Users     │              │ • developers│      │
│  │ • Sandbox   │              │ • APIs      │              │ • endpoints │      │
│  │ • Analytics │              │ • Analytics │              │ • usage     │      │
│  │ • API Docs  │              │ • Config    │              │ • configs   │      │
│  └─────────────┘              └─────────────┘              └─────────────┘      │
│         │                             │                             │          │
│         │                             │                             │          │
│         ▼                             ▼                             ▼          │
│  ┌─────────────┐              ┌─────────────┐              ┌─────────────┐      │
│  │ UI Library  │              │ Middleware  │              │   Indexes   │      │
│  │             │              │             │              │             │      │
│  │ • Forms     │              │ • Auth      │              │ • Primary   │      │
│  │ • Tables    │              │ • CORS      │              │ • Foreign   │      │
│  │ • Dialogs   │              │ • Helmet    │              │ • Composite │      │
│  │ • Charts    │              │ • Sessions  │              │ • Performance│     │
│  │ • Buttons   │              │ • Rate Limit│              │ • Search    │      │
│  └─────────────┘              └─────────────┘              └─────────────┘      │
│         │                             │                             │          │
│         │                             │                             │          │
│         ▼                             ▼                             ▼          │
│  ┌─────────────┐              ┌─────────────┐              ┌─────────────┐      │
│  │   Hooks     │              │  Storage    │              │ Relationships│     │
│  │             │              │             │              │             │      │
│  │ • useAuth   │              │ • Database  │              │ • One-to-One│      │
│  │ • useQuery  │              │ • Cache     │              │ • One-to-Many│     │
│  │ • useConfig │              │ • File Sys  │              │ • Many-to-Many│    │
│  │ • useMobile │              │ • Memory    │              │ • Self-Reference│  │
│  │ • useToast  │              │ • Session   │              │ • Constraints│     │
│  └─────────────┘              └─────────────┘              └─────────────┘      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### API Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            API INTEGRATION ARCHITECTURE                         │
│                                                                                 │
│  CLIENT APPLICATIONS         API GATEWAY              INTERNAL SERVICES        │
│                                                                                 │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐        │
│  │   Web App   │────────────▶│ Authentication │────────▶│   Banking   │        │
│  │  (React)    │             │   Service     │         │   Core APIs │        │
│  └─────────────┘             └─────────────┘         └─────────────┘        │
│         │                            │                        │              │
│         │                            │                        │              │
│         ▼                            ▼                        ▼              │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐        │
│  │ Mobile App  │────────────▶│ Rate Limiting │────────▶│  Payment    │        │
│  │ (Future)    │             │   Service     │         │  Gateway    │        │
│  └─────────────┘             └─────────────┘         └─────────────┘        │
│         │                            │                        │              │
│         │                            │                        │              │
│         ▼                            ▼                        ▼              │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐        │
│  │   Admin     │────────────▶│ API Analytics│────────▶│   Audit &   │        │
│  │   Panel     │             │   Service     │         │   Logging   │        │
│  └─────────────┘             └─────────────┘         └─────────────┘        │
│                                      │                        │              │
│  API CATEGORIES                      │                        │              │
│  ┌─────────────┐                     ▼                        ▼              │
│  │Authentication│             ┌─────────────┐             ┌─────────────┐        │
│  │Digital Payments│         │ Configuration│         │ Notification│        │
│  │Customer     │             │   Service     │         │   Service   │        │
│  │Loans        │             └─────────────┘         └─────────────┘        │
│  │Liabilities  │                                                            │
│  │Cards        │             SECURITY LAYERS                                 │
│  │Payments     │             ┌─────────────┐                                 │
│  │Trade Services│           │ • OAuth 2.0  │                                 │
│  │Corporate APIs│           │ • JWT Tokens │                                 │
│  └─────────────┘             │ • API Keys   │                                 │
│                               │ • Rate Limits│                                 │
│                               │ • CORS Policy│                                 │
│                               └─────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA ARCHITECTURE                          │
│                              (27 Tables Total)                                 │
│                                                                                 │
│  CORE ENTITIES              CONFIGURATION             DOCUMENTATION            │
│                                                                                 │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐          │
│  │    users    │           │config_categories│        │ doc_categories│        │
│  │     (PK)    │           │     (PK)    │            │     (PK)    │          │
│  └─────┬───────┘           └─────────────┘            └─────────────┘          │
│        │                                                      │                │
│        │ 1:1                                                 │ 1:N            │
│        ▼                                                      ▼                │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐          │
│  │ developers  │           │configurations│           │doc_endpoints│          │
│  │    (PK)     │           │     (PK)    │            │     (PK)    │          │
│  └─────┬───────┘           └─────────────┘            └─────┬───────┘          │
│        │                                                      │                │
│        │ 1:N                                                 │ 1:N            │
│        ▼                                                      ▼                │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐          │
│  │applications │           │ui_configurations│        │doc_parameters│        │
│  │    (PK)     │           │     (PK)    │            │     (PK)    │          │
│  └─────┬───────┘           └─────────────┘            └─────────────┘          │
│        │                                                                      │
│        │ 1:N                                                                  │
│        ▼                                                                      │
│  ┌─────────────┐            ANALYTICS & TRACKING        SECURITY & ACCESS     │
│  │  api_usage  │                                                              │
│  │    (PK)     │            ┌─────────────┐            ┌─────────────┐          │
│  └─────────────┘           │daily_analytics│          │ audit_logs  │          │
│                             │     (PK)    │            │     (PK)    │          │
│  API MANAGEMENT             └─────────────┘            └─────────────┘          │
│                                                                                 │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐          │
│  │api_categories│          │api_activity │            │ api_tokens  │          │
│  │     (PK)    │           │     (PK)    │            │     (PK)    │          │
│  └─────┬───────┘           └─────────────┘            └─────────────┘          │
│        │                                                                      │
│        │ 1:N                                                                  │
│        ▼                                              SESSION MANAGEMENT      │
│  ┌─────────────┐                                                              │
│  │api_endpoints│                                      ┌─────────────┐          │
│  │    (PK)     │                                     │  sessions   │          │
│  └─────────────┘                                     │     (PK)    │          │
│                                                       └─────────────┘          │
│  INDEXES & PERFORMANCE                                                         │
│  • Primary Key Indexes (Auto)                                                 │
│  • Foreign Key Indexes (Auto)                                                 │
│  • Session Expiry Index                                                       │
│  • API Activity Timestamp Index                                               │
│  • Daily Analytics Date+Environment Index                                     │
│  • Developer Activity Index                                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION DEPLOYMENT ARCHITECTURE                       │
│                                                                                 │
│  EXTERNAL ACCESS             LOAD BALANCING              APPLICATION TIER       │
│                                                                                 │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐        │
│  │   Internet  │────────────▶│ AWS ALB     │────────────▶│   EC2       │        │
│  │   Users     │             │ (HTTPS)     │             │ Instance 1  │        │
│  └─────────────┘             └─────────────┘             └─────────────┘        │
│                                      │                          │              │
│                                      │                          │              │
│                                      ▼                          ▼              │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐        │
│  │   Route 53  │             │ Target Group│             │   EC2       │        │
│  │    (DNS)    │             │ Health Check│             │ Instance 2  │        │
│  └─────────────┘             └─────────────┘             └─────────────┘        │
│                                      │                          │              │
│                                      │                          │              │
│                                      ▼                          ▼              │
│  SECURITY LAYER              ┌─────────────┐             ┌─────────────┐        │
│                               │ Auto Scaling│             │ Application │        │
│  ┌─────────────┐             │   Group     │             │   Server    │        │
│  │   WAF       │             └─────────────┘             └─────────────┘        │
│  │ Protection  │                                                              │
│  └─────────────┘             STORAGE TIER                DATA TIER             │
│                                                                                 │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐        │
│  │ CloudFront  │             │     S3      │             │    RDS      │        │
│  │    (CDN)    │             │  (Assets)   │             │(PostgreSQL) │        │
│  └─────────────┘             └─────────────┘             └─────────────┘        │
│                                      │                          │              │
│                                      │                          │              │
│                                      ▼                          ▼              │
│  MONITORING                  ┌─────────────┐             ┌─────────────┐        │
│                               │   Backup    │             │  Read       │        │
│  ┌─────────────┐             │   Storage   │             │ Replicas    │        │
│  │ CloudWatch  │             └─────────────┘             └─────────────┘        │
│  │   Logs &    │                                                              │
│  │  Metrics    │             SECRETS & CONFIG            ENVIRONMENT          │
│  └─────────────┘                                                              │
│                               ┌─────────────┐             ┌─────────────┐        │
│  ┌─────────────┐             │ Secrets     │             │ Parameter   │        │
│  │    SNS      │             │ Manager     │             │   Store     │        │
│  │ Notifications│            └─────────────┘             └─────────────┘        │
│  └─────────────┘                                                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY ARCHITECTURE                              │
│                                                                                 │
│  AUTHENTICATION FLOW           AUTHORIZATION LAYERS          DATA PROTECTION    │
│                                                                                 │
│  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐    │
│  │   OAuth 2.0 │──────────────▶│ Role-Based  │──────────────▶│ Encryption  │    │
│  │   Tokens    │               │ Access      │               │ at Rest     │    │
│  └─────────────┘               └─────────────┘               └─────────────┘    │
│         │                              │                              │        │
│         │                              │                              │        │
│         ▼                              ▼                              ▼        │
│  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐    │
│  │ JWT Refresh │               │ API Key     │               │ Encryption  │    │
│  │ Mechanism   │               │ Validation  │               │ in Transit  │    │
│  └─────────────┘               └─────────────┘               └─────────────┘    │
│         │                              │                              │        │
│         │                              │                              │        │
│         ▼                              ▼                              ▼        │
│  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐    │
│  │ Session     │               │ Permission  │               │ Data        │    │
│  │ Management  │               │ Checking    │               │ Sanitization│    │
│  └─────────────┘               └─────────────┘               └─────────────┘    │
│                                                                                 │
│  SECURITY CONTROLS             MONITORING & AUDITING         COMPLIANCE        │
│                                                                                 │
│  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐    │
│  │ Rate        │               │ Audit       │               │ Data        │    │
│  │ Limiting    │               │ Logging     │               │ Privacy     │    │
│  └─────────────┘               └─────────────┘               └─────────────┘    │
│         │                              │                              │        │
│         │                              │                              │        │
│         ▼                              ▼                              ▼        │
│  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐    │
│  │ CORS        │               │ Security    │               │ Regulatory  │    │
│  │ Protection  │               │ Alerts      │               │ Standards   │    │
│  └─────────────┘               └─────────────┘               └─────────────┘    │
│         │                              │                              │        │
│         │                              │                              │        │
│         ▼                              ▼                              ▼        │
│  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐    │
│  │ Input       │               │ Real-time   │               │ Security    │    │
│  │ Validation  │               │ Monitoring  │               │ Policies    │    │
│  └─────────────┘               └─────────────┘               └─────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication & Security

### Authentication Flow
1. **User Login**: Email/password authentication
2. **Session Creation**: Secure session with PostgreSQL storage
3. **Role-based Access**: Developer, Admin, Manager roles
4. **API Key Generation**: Unique keys for API access
5. **Permission Management**: Environment-based permissions

### Security Features
- **Password Hashing**: Bcrypt with salt rounds
- **Session Security**: HTTP-only cookies, secure flags
- **Rate Limiting**: Per-endpoint and per-user limits
- **CORS Protection**: Configured origins and methods
- **Security Headers**: Helmet.js middleware
- **Audit Logging**: Complete action tracking
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Drizzle ORM with prepared statements

### Environment Levels
1. **Sandbox**: Development and testing (unrestricted)
2. **UAT**: User acceptance testing (limited access)
3. **Production**: Live environment (restricted access)

---

## Development Environment

### Prerequisites
- **Node.js**: v20.19.3 or higher
- **npm**: v10.8.2 or higher
- **PostgreSQL**: Latest (provided by Replit/Neon)
- **TypeScript**: v5.6.3

### Environment Variables
```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=host
PGUSER=username
PGPASSWORD=password
PGDATABASE=database_name
PGPORT=5432

# Application Configuration
NODE_ENV=development
SESSION_SECRET=your_session_secret
API_BASE_URL=http://localhost:5000

# Replit Configuration (automatically set)
REPL_ID=repl_identifier
REPLIT_DOMAINS=domain1.com,domain2.com
```

### Development Scripts
```bash
# Start development server (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run check

# Database schema push
npm run db:push

# Force database schema push
npm run db:push --force
```

### Development Workflow
1. **Code Changes**: Hot reload via Vite and TSX
2. **Database Changes**: Update `shared/schema.ts` and run `npm run db:push`
3. **API Changes**: Update `shared/data.ts` for new endpoints
4. **UI Changes**: Component-driven development with Shadcn/UI
5. **Testing**: Interactive sandbox for API testing

---

## Deployment Guide

### 1. Replit Deployment (Recommended)

#### Prerequisites
- Replit account with access to deployments
- PostgreSQL database provisioned in Replit
- Environment variables configured

#### Step-by-Step Deployment

**Phase 1: Preparation**
```bash
# 1. Ensure all dependencies are installed
npm install

# 2. Run type checking
npm run check

# 3. Test database connection
npm run db:push

# 4. Verify application runs locally
npm run dev
```

**Phase 2: Database Setup**
```bash
# 1. Create PostgreSQL database in Replit
# (Use Replit UI: Database → Create Database → PostgreSQL)

# 2. Configure environment variables in Replit
# DATABASE_URL (automatically set by Replit)
# SESSION_SECRET (generate secure random string)
# NODE_ENV=production

# 3. Push database schema
npm run db:push --force
```

**Phase 3: Deployment Configuration**
```bash
# 1. Build the application
npm run build

# 2. Configure run command in Replit deployment
# Command: npm run start
# Build Command: npm run build

# 3. Set deployment type to "Autoscale Deployment"
# (Automatically handles traffic scaling)
```

**Phase 4: Deploy**
1. Click **"Deploy"** button in Replit workspace
2. Select **"Autoscale Deployment"** for web applications
3. Configure deployment settings:
   - **Run Command**: `npm run start`
   - **Build Command**: `npm run build`
   - **Environment**: Production
4. Click **"Deploy"** to start deployment process
5. Application will be live at provided public URL

#### Post-Deployment Verification
```bash
# 1. Check application health
curl https://your-app-url.replit.app/api/health

# 2. Verify database connectivity
# Check admin panel functionality

# 3. Test API endpoints
# Use sandbox environment for testing

# 4. Monitor deployment logs
# Check Replit deployment console
```

### 2. Alternative Deployment Options

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "start"]
```

#### Manual Server Deployment
```bash
# 1. Clone repository
git clone <repository-url>
cd au-bank-developer-portal

# 2. Install dependencies
npm ci --only=production

# 3. Configure environment variables
export DATABASE_URL="postgresql://..."
export SESSION_SECRET="secure-random-string"
export NODE_ENV="production"

# 4. Build application
npm run build

# 5. Start application
npm run start
```

### 3. Environment Configuration

#### Production Environment Variables
```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/db
SESSION_SECRET=secure-random-string-min-32-chars
NODE_ENV=production

# Optional
PORT=5000
API_BASE_URL=https://your-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
```

#### Database Migration
```bash
# For production deployment
npm run db:push --force

# This will:
# 1. Read schema from shared/schema.ts
# 2. Compare with existing database
# 3. Apply necessary changes
# 4. Preserve existing data
```

### 4. Post-Deployment Setup

#### Admin User Creation
```sql
-- Create initial admin user
INSERT INTO users (email, first_name, last_name, role, password_hash, employee_id)
VALUES (
  'admin@aubank.in',
  'Admin',
  'User',
  'admin',
  '$2b$10$hashed_password_here',
  'EMP001'
);

-- Create corresponding developer profile
INSERT INTO developers (user_id, name, email, department, permissions, api_key, is_verified)
VALUES (
  'user_id_from_above',
  'Admin User',
  'admin@aubank.in',
  'IT',
  '{"sandbox": true, "uat": true, "production": true}',
  'unique_api_key_here',
  true
);
```

#### Default Access
- **Admin Username**: admin
- **Admin Password**: aubank2024
- **Admin Panel URL**: `/admin`

---

## Critical Information

### 1. Security Considerations

#### Authentication
- **Session Timeout**: 24 hours (configurable)
- **Password Policy**: Minimum 6 characters, bcrypt hashing
- **API Keys**: UUID-based, environment-specific
- **CORS Policy**: Restricted to configured domains

#### Data Protection
- **Sensitive Data**: Password hashes, API keys, session data
- **Audit Logging**: All admin actions and API calls
- **Rate Limiting**: 100 requests/minute (sandbox), 1000 requests/minute (production)
- **Input Validation**: Zod schemas for all inputs

### 2. Performance Optimizations

#### Frontend
- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Vite build optimizations
- **Caching**: TanStack Query for server state
- **Bundle Size**: Tree-shaking and minification

#### Backend
- **Database Indexing**: Optimized queries with proper indexes
- **Session Storage**: PostgreSQL-based sessions
- **Connection Pooling**: Neon serverless database
- **Response Compression**: Gzip compression enabled

### 3. Monitoring & Maintenance

#### Logging
- **Application Logs**: Express.js request logging
- **Audit Logs**: Database-stored audit trail
- **Error Tracking**: Runtime error overlay in development
- **Performance Metrics**: API response times and usage

#### Database Maintenance
```sql
-- Regular maintenance queries
-- 1. Clean expired sessions
DELETE FROM sessions WHERE expire < NOW();

-- 2. Archive old audit logs (older than 1 year)
DELETE FROM audit_logs WHERE timestamp < NOW() - INTERVAL '1 year';

-- 3. Update usage statistics
-- Run monthly aggregation queries for reporting
```

### 4. Backup & Recovery

#### Database Backup
```bash
# Automated backups (Replit handles this)
# Manual backup command
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

#### Application Backup
- **Source Code**: Git repository with version control
- **Configuration**: Environment variables documented
- **Database Schema**: Version-controlled in `shared/schema.ts`

### 5. Scaling Considerations

#### Horizontal Scaling
- **Stateless Design**: Session stored in database
- **Load Balancing**: Replit auto-scaling handles this
- **Database Scaling**: Neon serverless auto-scales

#### Vertical Scaling
- **Memory Usage**: Monitor Node.js memory consumption
- **CPU Usage**: Monitor during peak API usage
- **Database Connections**: Pool size optimization

### 6. Troubleshooting Guide

#### Common Issues
```bash
# Database connection issues
npm run db:push --force

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# TypeScript compilation errors
npm run check

# Build issues
rm -rf dist
npm run build
```

#### Debug Mode
```bash
# Enable debug logging
export DEBUG=*
npm run dev

# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"
```

### 7. API Rate Limits

| Environment | Rate Limit | Usage |
|-------------|------------|-------|
| Sandbox | 100 req/min | Development & Testing |
| UAT | 500 req/min | User Acceptance Testing |
| Production | 1000 req/min | Live Environment |

### 8. Support & Maintenance

#### Contact Information
- **Development Team**: Internal AU Bank IT Department
- **Database Issues**: Replit Support / Neon Support
- **Deployment Issues**: Replit Deployment Support

#### Maintenance Schedule
- **Database Maintenance**: Monthly cleanup of audit logs
- **Security Updates**: Quarterly dependency updates
- **Feature Updates**: Continuous deployment via Git

---

## Conclusion

The AU Bank Internal Developer Portal is a comprehensive, enterprise-grade solution built with modern technologies and best practices. This documentation provides complete information for development, deployment, and maintenance of the platform.

For additional support or questions, refer to the individual component documentation or contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Maintained By**: AU Bank IT Development Team