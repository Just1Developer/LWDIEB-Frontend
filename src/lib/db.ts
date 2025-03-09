import 'server-only'

import { PrismaClient } from '@prisma/client'

declare global {
  // Needed because we actually need "this"
  // noinspection ES6ConvertVarToLetConst
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}
