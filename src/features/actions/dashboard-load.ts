'use server'

import { DoubleSignedSkeletonDashboard, SignedSkeletonDashboard } from '@/lib/types'
import { toSingleSignedDashboard } from '@/lib/utils'
import { getDBDashboard, getDBDefaultDashboard, removeDBDashboard, setDBDashboard, setDBDefaultDashboard } from '@/lib/dashboard-db-access'
import { DEFAULT_DASHBOARD } from '@/configuration/default-dashboard-config'

interface DashboardPostReturn {
  status: number
  error: string
  msg: string
}

// ----------------------------- Data Fetch Server Actions -----------------------------

export const getDashboard = async ({ userId }: { userId: string }): Promise<DoubleSignedSkeletonDashboard> => {
  try {
    // Long is too complex of a type to be passed down
    const dashboard = JSON.parse(await getDBDashboard({ userId }))
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

export const postDashboard = async ({ userId, doubleSignedDashboard }: { userId: string, doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  // todo validation
  try {
    await setDBDashboard({ userId, dashboard: doubleSignedDashboard })
    return { status: 200, error: 'ok', msg: 'ok' }
  } catch (error) {
    console.warn('Failed to post dashboard', error)
    return { status: 401, error: 'You are probably not logged in.', msg: '' }
  }
}

export const postGlobalDashboard = async ({ doubleSignedDashboard }: { doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  // todo validation dashboard + user
  try {
    await setDBDefaultDashboard({ dashboard: doubleSignedDashboard })
    return { status: 200, error: 'ok', msg: 'ok' }
  } catch (error) {
    return { status: 401, error: 'An unknown error occurred (axios fault)', msg: '' }
  }
}

export const eraseDashboard = async ({ userId }: { userId: string }): Promise<SignedSkeletonDashboard> => {
  // todo validate cookies
  await removeDBDashboard({ userId })
  return await getGlobalDashboard()
}
