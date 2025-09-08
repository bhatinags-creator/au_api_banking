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
│   │   │   └── ui/                  # Shadcn/UI components
│   │   │       ├── button.tsx       # Button component
│   │   │       ├── card.tsx         # Card component
│   │   │       ├── dialog.tsx       # Modal dialog component
│   │   │       ├── form.tsx         # Form components
│   │   │       ├── input.tsx        # Input components
│   │   │       ├── select.tsx       # Select dropdown component
│   │   │       ├── tabs.tsx         # Tab navigation component
│   │   │       └── ...              # Other UI components
│   │   ├── hooks/
│   │   │   ├── use-toast.ts         # Toast notification hook
│   │   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   │   └── useAuth.ts           # Authentication hook
│   │   ├── lib/
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   └── utils.ts             # Utility functions
│   │   ├── pages/
│   │   │   ├── admin.tsx            # Admin panel with edit dialogs
│   │   │   ├── api-docs.tsx         # API documentation viewer
│   │   │   ├── api-explorer.tsx     # API explorer interface
│   │   │   ├── dashboard.tsx        # Analytics dashboard
│   │   │   ├── home.tsx             # Main landing page
│   │   │   ├── sandbox.tsx          # API testing playground
│   │   │   ├── signin.tsx           # User authentication
│   │   │   └── ...                  # Other pages
│   │   ├── App.tsx                  # Main React application
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles with AU Bank theme
│   └── index.html                   # HTML template
├── server/                          # Backend Express application
│   ├── auth.ts                      # Authentication & authorization
│   ├── db.ts                        # Database connection setup
│   ├── index.ts                     # Express server entry point
│   ├── routes.ts                    # API route definitions
│   ├── session.ts                   # Session configuration
│   ├── storage.ts                   # Database operations layer
│   └── vite.ts                      # Vite development integration
├── shared/                          # Shared code between client/server
│   ├── data.ts                      # Centralized API data store (32 APIs)
│   └── schema.ts                    # Database schema & validation
├── attached_assets/                 # Static assets and documentation
├── components.json                  # Shadcn/UI configuration
├── drizzle.config.ts               # Database migration configuration
├── package.json                     # Node.js dependencies
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
└── replit.md                       # Project documentation
```

### Folder Purposes

#### `/client` - Frontend Application
- **React-based UI** with TypeScript
- **Component-driven architecture** using Radix UI primitives
- **Page-based routing** with Wouter
- **State management** via TanStack Query
- **AU Bank theme** implementation

#### `/server` - Backend API Server
- **Express.js REST API** with TypeScript
- **Authentication middleware** and session management
- **Database operations** via Drizzle ORM
- **API route handlers** for all endpoints
- **Security middleware** (CORS, Helmet, rate limiting)

#### `/shared` - Common Code
- **Database schemas** and TypeScript types
- **Validation schemas** using Zod
- **Centralized API data** (32 banking APIs)
- **Type definitions** shared between frontend/backend

#### `/components.json` & UI Configuration
- **Shadcn/UI setup** for consistent component library
- **Theme configuration** for AU Bank branding
- **Path aliases** for clean imports

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