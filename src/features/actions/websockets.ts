'use server'

import { axiosInstance } from '@/configuration/axios-config'
import { env } from '@/env.mjs'
import { signString } from '@/features/shared/signature'

export const sendWSCommand = async ({ userId, command }: { userId: string; command: string }) => {
  await axiosInstance.post('/ws-post', {
    userId,
    command,
    serverPassword: env.SPRING_SERVER_PASSWORD,
    checksum: signString({ string: command + env.SPRING_SERVER_PASSWORD }),
  })
}
