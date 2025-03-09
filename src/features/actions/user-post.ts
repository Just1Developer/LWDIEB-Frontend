'use server'

import { axiosInstance } from '@/configuration/axios-config'
import { BackendUser } from '@/configuration/userdata-config'
import { AvailableThemes } from '@/lib/types'

export const postUser = async ({ user }: { user: BackendUser }) => {
  try {
    await axiosInstance.post<void>('/api/user', user)
  } catch (error) {}
}

export const updateSelectedTheme = async ({ theme }: { theme: AvailableThemes }) => {
  try {
    await axiosInstance.post<void>('/api/user/theme', theme)
  } catch (error) {}
}
