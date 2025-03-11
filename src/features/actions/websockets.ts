'use server'

import { axiosInstance } from '@/configuration/axios-config'
import { env } from '@/env.mjs'
import { signString } from '@/features/shared/signature'

export const sendWSCommand = async ({ userId, command }: { userId: string; command: string }) => {
  try {
    void axiosInstance.post('/ws-post', {
      userId,
      command,
      serverPassword: env.SPRING_SERVER_PASSWORD,
      checksum: await signString({ string: command + env.SPRING_SERVER_PASSWORD }),
    })
  } catch (_) {
    console.log("Failed to send WS command (Axios Fault)", userId, command, _)
  }
}
