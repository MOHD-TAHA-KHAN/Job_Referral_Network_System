import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from './config/passport';
import { validateEnv } from './config/env.validation';
import { authLimiter, apiLimiter, uploadLimiter } from './middleware/rateLimiter';

import { connectPostgres } from './config/db';
import authRoutes from './modules/auth/auth.routes';
import profileRoutes from './modules/profile/profile.routes';
import jobsRoutes from './modules/jobs/jobs.routes';
import referralRoutes from './modules/referral/referral.routes';
import matchingRoutes from './modules/matching/matching.routes';
import filesRoutes from './modules/files/files.routes';

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan('dev'))

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'fallback-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}))

app.use(passport.initialize())
app.use(passport.session())

// Rate limiting middleware
app.use('/api/auth', authLimiter)
app.use('/api/files', uploadLimiter)
app.use('/api/', apiLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/referrals', referralRoutes)
app.use('/api/match', matchingRoutes)
app.use('/api/files', filesRoutes)

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/', (req: any, res: any) => {
  res.json({ message: 'RefNet API is running!', version: '1.0.0' })
})

app.use((req: any, res: any, next: any) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong' })
})

const DEFAULT_PORT = 5000
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null
const PORTS_TO_TRY = envPort
  ? Array.from(new Set([envPort, envPort + 1, envPort + 2]))
  : [DEFAULT_PORT, DEFAULT_PORT + 1, DEFAULT_PORT + 2]

const listen = (port) => new Promise((resolve, reject) => {
  const server = app.listen(port, () => resolve(server))
  server.on('error', reject)
})

const start = async () => {
  // Validate required environment variables
  validateEnv();
  
  await connectPostgres()

  let server
  for (const port of PORTS_TO_TRY) {
    try {
      server = await listen(port)
      console.log(`Server running on http://localhost:${port}`)
      
      // Graceful shutdown handling
      const gracefulShutdown = async (signal: string) => {
        console.log(`\n${signal} received. Starting graceful shutdown...`)
        server?.close(() => {
          console.log('HTTP server closed')
          process.exit(0)
        })
        // Force shutdown after 10 seconds
        setTimeout(() => {
          console.error('Forced shutdown due to timeout')
          process.exit(1)
        }, 10000)
      }
      
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
      process.on('SIGINT', () => gracefulShutdown('SIGINT'))
      
      return
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use.`)
        continue
      }
      throw error
    }
  }

  console.error(`All fallback ports are in use: ${PORTS_TO_TRY.join(', ')}`)
  process.exit(1)
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

export default app
;