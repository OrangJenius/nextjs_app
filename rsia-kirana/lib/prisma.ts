import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
// const url = new URL(process.env.DATABASE_URL!)

// const adapter = new PrismaMariaDb({
//   host: url.hostname,
//   port: Number(url.port),
//   user: decodeURIComponent(url.username),
//   password: decodeURIComponent(url.password),
//   database: url.pathname.slice(1),
//   ssl: { rejectUnauthorized: false }, // quick test; see note below
//   connectionLimit: 5,
//   connectTimeout: 20000,
//   acquireTimeout: 20000,
// })

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma