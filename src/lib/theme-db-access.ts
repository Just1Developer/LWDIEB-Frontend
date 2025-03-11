'use server'

import { DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { DEFAULT_THEMES } from '@/configuration/userdata-config'
import { db } from '@/lib/db'
import { AvailableThemes } from '@/lib/types'

export const getDBTheme = async ({ userId }: { userId: string }) => {
  if (userId === DEFAULT_USER_UUID) return DEFAULT_THEMES
  const { themeConfig } = (await db.themes.findFirst({ where: { userId } })) ?? { dashboard: undefined }
  if (!themeConfig) {
    return DEFAULT_THEMES
  }
  return themeConfig
}

export const setDBTheme = async ({ userId, themes, selectedTheme }: { userId: string, themes: string, selectedTheme: AvailableThemes }) => {
  const contains = (await db.themes.count({ where: { userId } })) > 0
  if (contains) {
    await db.themes.update({ where: { userId }, data: { themeConfig: themes } })
  } else {
    await db.themes.create({ data: { userId, themeConfig: themes, selectedTheme } })
  }
}

export const getDBSelectedTheme = async ({ userId } : { userId: string }): Promise<AvailableThemes> => {
  const { selectedTheme } = (await db.themes.findFirst({ where: { userId } })) ?? { dashboard: undefined }
  if (!selectedTheme) {
    return 'light'
  }
  return selectedTheme === 'dark' ? 'dark' : 'light'
}

export const setDBSelectedTheme = async ({ userId, selectedTheme }: { userId: string; selectedTheme: string }) => {
  const contains = (await db.themes.count({ where: { userId } })) > 0
  if (contains) {
    await db.themes.update({ where: { userId }, data: { selectedTheme } })
  } else {
    await db.themes.create({ data: { userId, themeConfig: DEFAULT_THEMES, selectedTheme } })
  }
}
