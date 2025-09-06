import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { pool } from './db';

// Configure session store with PostgreSQL
const PgSession = connectPg(session);

export const sessionConfig = session({
  store: new PgSession({
    pool: pool,
    tableName: 'sessions',
    createTableIfMissing: false, // We already have the table in our schema
  }),
  secret: process.env.SESSION_SECRET || 'au-bank-internal-dev-portal-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  },
  name: 'au.bank.session', // Custom session name
  rolling: true // Reset expiry on each request
});