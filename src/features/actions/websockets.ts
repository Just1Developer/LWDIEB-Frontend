'use server'

import { axiosInstance } from '@/configuration/axios-config'
import { env } from '@/env.mjs'
import { signString } from '@/features/shared/signature'
import { v4 } from 'uuid'

export const sendWSCommand = async ({ userId, command }: { userId: string; command: string }) => {
  try {
    const timestamp = new Date().getTime().toString()
    const requestUUID = v4()
    void axiosInstance.post('/ws-post', {
      userId,
      command,
      serverPassword: env.SPRING_SERVER_PASSWORD,
      checksum: await signString({ string: `${userId}#${command}#${env.SPRING_SERVER_PASSWORD}` }),
      timestamp,
      signedTime: await signString({ string: timestamp }),
      requestUUID,
      signedUUID: await signString({ string: requestUUID }),
    })
  } catch (_) {
    console.log('Failed to send WS command (Axios Fault)', userId, command, _)
  }
}
