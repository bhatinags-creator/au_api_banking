import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { randomUUID } from 'crypto';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        developerId?: string;
      };
    }
  }
}

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    developerId?: string;
  }
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check session for user ID
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    // Get user from database
    const user = await storage.getUser(userId);
    if (!user || !user.isActive) {
      // Clear invalid session
      if (req.session) {
        req.session.userId = undefined;
        req.session.developerId = undefined;
      }
      return res.status(401).json({ 
        error: 'Invalid session',
        message: 'User not found or inactive'
      });
    }

    // Get developer profile if exists
    const developer = await storage.getDeveloperByUserId(userId);
    
    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      developerId: developer?.id
    };

    // Log user activity
    await storage.createAuditLog({
      userId: user.id,
      action: 'api_access',
      resource: req.path,
      details: {
        method: req.method,
        userAgent: req.get('User-Agent'),
        endpoint: `${req.method} ${req.path}`
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `This resource requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

// API key authentication middleware (for API access)
export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.header('X-API-Key') || req.query.api_key as string;
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API key required',
        message: 'Please provide a valid API key'
      });
    }

    // Allow sandbox test key for development/testing
    if (apiKey === 'sandbox_test_key' || apiKey === 'demo_api_key') {
      req.user = {
        id: 'sandbox_user',
        email: 'sandbox@aubank.in',
        role: 'developer',
        developerId: 'sandbox_dev'
      };
      return next();
    }

    // Check if it's a developer API key
    const developer = await storage.getDeveloperByApiKey(apiKey);
    if (developer) {
      req.user = {
        id: developer.userId,
        email: developer.email,
        role: 'developer',
        developerId: developer.id
      };

      // Update developer activity
      await storage.updateDeveloperActivity(developer.id);
      
      // Log API usage
      await storage.createAuditLog({
        userId: developer.userId,
        action: 'api_key_access',
        resource: req.path,
        details: {
          method: req.method,
          developerId: developer.id,
          endpoint: `${req.method} ${req.path}`
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return next();
    }

    // Check if it's an API token
    const apiToken = await storage.getApiToken(apiKey);
    if (apiToken && apiToken.isActive) {
      const developer = await storage.getDeveloper(apiToken.developerId);
      if (developer) {
        req.user = {
          id: developer.userId,
          email: developer.email,
          role: 'developer',
          developerId: developer.id
        };

        // Update token last used
        await storage.updateTokenLastUsed(apiKey);
        
        return next();
      }
    }

    res.status(401).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is not valid or has been revoked'
    });
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error during API key authentication'
    });
  }
};

// Environment access middleware
export const requireEnvironmentAccess = (environment: 'sandbox' | 'uat' | 'production') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const developerId = req.user?.developerId;
      
      if (!developerId) {
        return res.status(403).json({ 
          error: 'Developer profile required',
          message: 'A developer profile is required to access this environment'
        });
      }

      // Allow sandbox test user to access sandbox environment
      if (developerId === 'sandbox_dev' && environment === 'sandbox') {
        return next();
      }

      const developer = await storage.getDeveloper(developerId);
      if (!developer) {
        return res.status(403).json({ 
          error: 'Developer not found',
          message: 'Developer profile not found'
        });
      }

      const permissions = developer.permissions as any;
      if (!permissions || !permissions[environment]) {
        return res.status(403).json({ 
          error: 'Environment access denied',
          message: `You don't have access to the ${environment} environment`
        });
      }

      next();
    } catch (error) {
      console.error('Environment access check error:', error);
      res.status(500).json({ 
        error: 'Access check failed',
        message: 'Internal server error during environment access check'
      });
    }
  };
};

// Rate limiting helper
export const createRateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, number[]>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.user?.id || req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get existing requests for this key
    const userRequests = requests.get(key) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil((recentRequests[0] - windowStart) / 1000)
      });
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    next();
  };
};