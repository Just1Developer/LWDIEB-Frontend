import pino from 'pino'

const isServer = typeof window === 'undefined'

export const logger = pino({
  enabled: isServer,
  level: process.env.LOG_LEVEL ?? 'info',
})
