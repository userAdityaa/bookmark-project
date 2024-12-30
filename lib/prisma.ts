import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

prisma.$connect()
  .catch((error) => {
    console.error('Failed to connect to the database:', error)
    process.exit(1)
  })

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma