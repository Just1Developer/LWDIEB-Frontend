'use server'

import { DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { UserThemes } from '@/configuration/userdata-config'
import { getUserFromAccessJWT } from '@/lib/cookie-reader'
import { setDBSelectedTheme, setDBTheme } from '@/lib/theme-db-access'
import { AvailableThemes } from '@/lib/types'

interface ThemeProps {
  selectedTheme: AvailableThemes
  themes: UserThemes
}

export const postUser = async ({ selectedTheme, themes }: ThemeProps) => {
  console.log('Attempting Update for user ')
  const { id: userId } = await getUserFromAccessJWT()
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to update user themes: ID was default ID on post call.')
  }
  console.log('Updating for user ', userId)

  await setDBTheme({ userId: userId, themes: JSON.stringify(themes), selectedTheme })
}
export const updateSelectedTheme = async ({ theme }: { theme: AvailableThemes }) => {
  console.log('Attempting Update for user ')
  const { id: userId } = await getUserFromAccessJWT()
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to update selected theme: ID was default ID on post call.')
  }
  console.log('Updating for user ', userId)
  await setDBSelectedTheme({ userId: userId, selectedTheme: theme })
}
