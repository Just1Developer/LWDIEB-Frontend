'use server'

import { DEFAULT_DASHBOARD, DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { db } from '@/lib/db'

export const getDBDashboard = async ({ userId }: { userId: string }) => {
  const { dashboard } = (await db.dashboards.findFirst({ where: { userId } })) ?? { dashboard: undefined }
  if (!dashboard) {
    return getDBDefaultDashboard()
  }
  return dashboard
}

export const setDBDefaultDashboard = async ({ dashboard }: { dashboard: string }) => {
  await setDBDashboard({ userId: DEFAULT_USER_UUID, dashboard })
}

export const setDBDashboard = async ({ userId, dashboard }: { userId: string; dashboard: string }) => {
  const contains = (await db.dashboards.count({ where: { userId } })) > 0
  if (contains) {
    db.dashboards.update({ where: { userId }, data: { dashboard } })
  } else {
    db.dashboards.create({ data: { userId, dashboard } })
  }
}

export const getDBDefaultDashboard = async () => {
  const { dashboard } = (await db.dashboards.findFirst({ where: { userId: DEFAULT_USER_UUID } })) ?? { dashboard: undefined }
  if (!dashboard) {
    db.dashboards.create({ data: { userId: DEFAULT_USER_UUID, dashboard: DEFAULT_DASHBOARD } })
    return DEFAULT_DASHBOARD
  }
  return dashboard
}

export const removeDBDashboard = async ({ userId }: { userId: string }) => {
  if (userId === DEFAULT_USER_UUID) return
  await db.dashboards.delete({ where: { userId } })
}
