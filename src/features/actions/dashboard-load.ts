'use server'

import { DoubleSignedSkeletonDashboard, SignedSkeletonDashboard } from '@/lib/types'
import { toSingleSignedDashboard } from '@/lib/utils'
import { getDBDashboard, getDBDefaultDashboard, removeDBDashboard, setDBDashboard, setDBDefaultDashboard } from '@/lib/dashboard-db-access'
import { DEFAULT_DASHBOARD, DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { getUserFromAccessJWT } from '@/lib/cookie-reader'

interface DashboardPostReturn {
  status: number
  error: string
  msg: string
}

// ----------------------------- Data Fetch Server Actions -----------------------------

export const getDashboard = async (): Promise<DoubleSignedSkeletonDashboard> => {
  try {
    // Long is too complex of a type to be passed down
    const dashboard = JSON.parse(await getDBDashboard({ userId: (await getUserFromAccessJWT()).id }))
    return dashboard as DoubleSignedSkeletonDashboard
  } catch (error) {
    return JSON.parse(DEFAULT_DASHBOARD) as DoubleSignedSkeletonDashboard
  }
}

export const getGlobalDashboard = async (): Promise<SignedSkeletonDashboard> => {
  try {
    const dashboard = JSON.parse(await getDBDefaultDashboard()) as DoubleSignedSkeletonDashboard
    return toSingleSignedDashboard({ dashboard })
  } catch (error) {
    return toSingleSignedDashboard({ dashboard: JSON.parse(DEFAULT_DASHBOARD) as DoubleSignedSkeletonDashboard })
  }
}

export const postDashboard = async ({ doubleSignedDashboard }: { doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  const { id: userId } = (await getUserFromAccessJWT())
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to post dashboard: ID was default ID on regular post call.')
    return { status: 401, error: 'You are probably not logged in.', msg: '' }
  }
  await setDBDashboard({ userId, dashboard: doubleSignedDashboard })
  return { status: 200, error: 'ok', msg: 'ok' }
}

export const postGlobalDashboard = async ({ doubleSignedDashboard }: { doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  // todo validation dashboard
  const { id: userId, admin } = (await getUserFromAccessJWT())
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to post dashboard: ID was default ID on regular post call.')
    return { status: 401, error: 'You are probably not logged in.', msg: '' }
  } else if (!admin) {
    return { status: 403, error: 'You have no permission to update the global dashboard! You are probably not logged in.', msg: '' }
  }
  try {
    await setDBDefaultDashboard({ dashboard: doubleSignedDashboard })
    return { status: 200, error: 'ok', msg: 'ok' }
  } catch (error) {
    return { status: 401, error: 'An unknown error occurred (axios fault)', msg: '' }
  }
}

export const eraseDashboard = async (): Promise<SignedSkeletonDashboard> => {
  // todo validate cookies
  await removeDBDashboard({ userId: (await getUserFromAccessJWT()).id })
  return await getGlobalDashboard()
}
