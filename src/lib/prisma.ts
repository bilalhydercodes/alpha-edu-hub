import { PrismaClient } from '@prisma/client'
import { mockPrismaClient } from './mockPrisma'

let dbAvailable = false
let connectionChecked = false

const prismaClientSingleton = (): PrismaClient => {
  // If database is explicitly disabled, use mock client
  if (process.env.DISABLE_DATABASE === 'true') {
    console.log('🔧 Using mock Prisma client (database disabled)')
    return mockPrismaClient as unknown as PrismaClient
  }

  return new PrismaClient({
    log: ['error'], // Only log errors, not queries
    errorFormat: 'minimal',
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

export default prisma

export function isDatabaseAvailable() {
  return connectionChecked && dbAvailable
}

export function isConnectionChecked() {
  return connectionChecked
}

// Test database connection on startup (force work mode - don't fail if connection fails)
// Skip connection test during build time to prevent build failures
if ((process.env.NODE_ENV as string) !== 'build' && process.env.NODE_ENV !== 'test') {
  // If database is explicitly disabled, skip connection test
  if (process.env.DISABLE_DATABASE === 'true') {
    console.log('⚠️ Database explicitly disabled, using mock data mode');
    dbAvailable = false
    connectionChecked = true
  } else {
    const connectWithTimeout = () => {
      return Promise.race([
        prisma.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 3000)
        )
      ])
    }
    
    connectWithTimeout()
      .then(() => {
        console.log('✅ Database connected successfully')
        dbAvailable = true
      })
      .catch((error) => {
        console.log('⚠️ Database connection failed, using force work mode with mock data');
        dbAvailable = false
      })
      .finally(() => {
        connectionChecked = true
      })
  }
}

// Graceful shutdown for serverless environments
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
  })
  
  // Handle all possible process exits
  process.on('SIGINT', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
    process.exit(0)
  })
}