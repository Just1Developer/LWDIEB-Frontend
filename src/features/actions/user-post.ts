'use server'

import { DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { UserThemes } from '@/configuration/userdata-config'
import { COMMAND_REFRESH_THEMES } from '@/configuration/ws-communication-commands'
import { sendWSCommand } from '@/features/actions/websockets'
import { getUserFromAccessJWT } from '@/lib/cookie-reader'
import { setDBSelectedTheme, setDBTheme } from '@/lib/theme-db-access'
import { AvailableThemes } from '@/lib/types'

interface ThemeProps {
  selectedTheme: AvailableThemes
  themes: UserThemes
}

export const postUser = async ({ selectedTheme, themes }: ThemeProps) => {
  const { id: userId } = await getUserFromAccessJWT()
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to update user themes: ID was default ID on post call.')
    return
  }
  await sendWSCommand({ userId, command: COMMAND_REFRESH_THEMES })
  await setDBTheme({ userId: userId, themes: JSON.stringify(themes), selectedTheme })
}
export const updateSelectedTheme = async ({ theme }: { theme: AvailableThemes }) => {
  const { id: userId } = await getUserFromAccessJWT()
  if (userId === DEFAULT_USER_UUID) {
    return
  }
  await setDBSelectedTheme({ userId: userId, selectedTheme: theme })
  await sendWSCommand({ userId, command: theme })
}
