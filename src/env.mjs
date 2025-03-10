import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SIGNATURE_SECRET: z.string(),
    NEXT_URL: z.string().url(),
    LW_SERVER_URL: z.string().url(),
    SPRING_SERVER_PASSWORD: z.string(),
    KC_SPRING_CLIENT: z.string(),
    KC_SPRING_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  },
  runtimeEnv: {
    SIGNATURE_SECRET: process.env.SIGNATURE_SECRET,
    NEXT_URL: process.env.NEXT_URL,
    LW_SERVER_URL: process.env.LW_SERVER_URL,
    SPRING_SERVER_PASSWORD: process.env.SPRING_SERVER_PASSWORD,
    KC_SPRING_CLIENT: process.env.KC_SPRING_CLIENT,
    KC_SPRING_SECRET: process.env.KC_SPRING_SECRET,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
})
