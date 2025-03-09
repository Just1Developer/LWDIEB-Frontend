import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SIGNATURE_SECRET: z.string(),
    SPRING_SERVER_URL: z.string().url(),
    SPRING_SERVER_PASSWORD: z.string(),
  },
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  },
  runtimeEnv: {
    SIGNATURE_SECRET: process.env.SIGNATURE_SECRET,
    SPRING_SERVER_URL: process.env.SPRING_SERVER_URL,
    SPRING_SERVER_PASSWORD: process.env.SPRING_SERVER_PASSWORD,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
})
