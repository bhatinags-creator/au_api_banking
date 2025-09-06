# AU Bank Developer Portal (Internal Users)
## Deployment Guide & Documentation

### Project Overview
This is the internal AU Bank Developer Portal built with modern full-stack architecture, designed specifically for AU Bank's internal development teams and employees. This portal features:
- React 18 + TypeScript frontend with Vite
- Express.js backend with TypeScript
- PostgreSQL database with Drizzle ORM
- AU Bank's official purple branding (#603078) for internal use
- Internal developer authentication system
- Interactive API sandbox and internal testing tools
- Admin panel for internal API management
- Internal-only resources and documentation

---

## Table of Contents
1. [Downloading Your Code](#downloading-your-code)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Deployment Options](#deployment-options)
6. [Production Deployment](#production-deployment)
7. [Project Structure](#project-structure)
8. [Key Features](#key-features)
9. [Troubleshooting](#troubleshooting)

---

## Downloading Your Code

### From Replit:
1. In your Replit project, look for the `...` menu in the file explorer (left sidebar)
2. Click on "Download as Zip"
3. Your entire project will be downloaded as a `.zip` file
4. Extract the zip file to your preferred directory on your PC

---

## Local Development Setup

### Prerequisites
- Node.js 18+ installed on your PC
- PostgreSQL database (local or cloud)
- Git (optional, for version control)

### Installation Steps
1. **Navigate to your project directory:**
   ```bash
   cd path/to/your/extracted/project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if available) or create a new `.env` file
   - Configure the required environment variables (see section below)

4. **Set up the database:**
   - Create a PostgreSQL database
   - Run database migrations: `npm run db:push`

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5000`

---

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/au_bank_internal_portal
PGHOST=localhost
PGPORT=5432
PGDATABASE=au_bank_internal_portal
PGUSER=your_username
PGPASSWORD=your_password

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Replit Configuration (for Replit deployment)
REPL_ID=your-repl-id
REPLIT_DOMAINS=your-domain.replit.app
ISSUER_URL=https://replit.com/oidc

# Application Environment
NODE_ENV=development
```

### Important Notes:
- **SESSION_SECRET**: Generate a strong, random string for production
- **DATABASE_URL**: Update with your actual database credentials
- For local development, you may not need the Replit-specific variables

---

## Database Setup

### Using PostgreSQL Locally:
1. **Install PostgreSQL** on your PC
2. **Create a database:**
   ```sql
   CREATE DATABASE au_bank_internal_portal;
   ```
3. **Update your DATABASE_URL** in the `.env` file
4. **Run migrations:**
   ```bash
   npm run db:push
   ```

### Using Cloud Database (Recommended):
- **Neon**: Free PostgreSQL hosting
- **Supabase**: PostgreSQL with additional features
- **PlanetScale**: MySQL-compatible option
- **Railway**: PostgreSQL hosting

Update the `DATABASE_URL` with your cloud database connection string.

---

## Deployment Options

### 1. Replit Deployment (Easiest)
Since you're already on Replit:
1. Click the "Deploy" button in your Replit editor
2. Choose your deployment type:
   - **Autoscale**: For variable traffic (recommended)
   - **Reserved VM**: For consistent performance
   - **Static**: For frontend-only deployments
3. Configure custom domain if needed
4. Monitor through Replit's deployment dashboard

### 2. Vercel (Frontend + Serverless)
Best for the React frontend with serverless API routes:
```bash
npm install -g vercel
vercel
```

### 3. Netlify (Frontend + Serverless Functions)
Great for static hosting with API functions:
```bash
npm install -g netlify-cli
netlify deploy
```

### 4. Railway (Full-Stack)
Excellent for full-stack applications:
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with automatic database provisioning

### 5. DigitalOcean App Platform
Professional hosting with managed databases:
1. Connect repository
2. Configure build/run commands
3. Add database component

### 6. AWS/Google Cloud/Azure
Enterprise-level deployment with complete control

---

## Production Deployment

### Build Commands:
```json
{
  "build": "npm run build:client && npm run build:server",
  "build:client": "cd client && npm run build",
  "build:server": "cd server && tsc",
  "start": "node server/dist/index.js"
}
```

### Production Checklist:
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `SESSION_SECRET`
- [ ] Configure secure database connection
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all API endpoints
- [ ] Verify authentication flows
- [ ] Check responsive design on all devices

---

## Project Structure

```
au-bank-portal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/           # Utility functions
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Express backend
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data layer
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
├── package.json          # Root package configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── drizzle.config.ts    # Database configuration
```

---

## Key Features

### 1. Internal Developer Authentication System
- Internal user sign-up wizard (4 steps)
- Professional sign-in page for AU Bank employees
- Internal demo credentials for testing
- Secure session management

### 2. Internal API Portal
- Internal API documentation and resources
- Comprehensive sandbox for internal testing
- 100+ internal API endpoints
- Real-time internal API testing

### 3. Internal Admin Panel
- Internal API endpoint management
- Parameter configuration for internal use
- Internal user management
- Internal analytics dashboard

### 4. Internal UI/UX
- AU Bank's official purple branding for internal use
- Responsive design optimized for internal teams
- Custom illustrations for internal workflows
- Professional gradients and animations

### 5. Technical Architecture
- TypeScript throughout
- Modern React with hooks
- Express.js REST API
- PostgreSQL with Drizzle ORM
- Tailwind CSS styling
- shadcn/ui components

---

## Troubleshooting

### Common Issues:

**1. Database Connection Errors:**
- Verify DATABASE_URL is correct
- Ensure database server is running
- Check firewall settings

**2. Build Errors:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version compatibility (18+)
- Verify TypeScript configuration

**3. Authentication Issues:**
- Ensure SESSION_SECRET is set
- Check database sessions table exists
- Verify environment variables

**4. Port Conflicts:**
- Default port is 5000
- Change in server configuration if needed
- Ensure no other services are using the port

### Support Resources:
- Check the console for detailed error messages
- Verify all environment variables are set
- Ensure database migrations have run successfully
- Test API endpoints individually

---

## Additional Notes

### Security Considerations:
- Never commit `.env` files to version control
- Use strong passwords and secrets
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting for APIs

### Performance Optimization:
- Enable gzip compression
- Optimize images and assets
- Use CDN for static files
- Implement caching strategies
- Monitor database query performance

### Maintenance:
- Regularly backup your database
- Monitor server logs
- Update dependencies monthly
- Test new features in staging environment

---

## Contact & Support

For technical support or questions about this deployment:
- Review the application logs for error details
- Check database connectivity
- Verify environment configuration
- Test individual components separately

**Deployment Date:** $(date)
**Project Version:** 1.0.0 (Internal)
**Target Users:** AU Bank Internal Development Teams
**Node.js Version:** 18+
**Database:** PostgreSQL with Drizzle ORM