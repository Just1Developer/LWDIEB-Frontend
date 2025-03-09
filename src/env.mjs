import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SPRING_SERVER_URL: z.string().url(),
    SPRING_SERVER_PASSWORD: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  },
  runtimeEnv: {
    SPRING_SERVER_URL: process.env.SPRING_SERVER_URL,
    SPRING_SERVER_PASSWORD: process.env.SPRING_SERVER_PASSWORD,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
})
