'use server'

import { DEFAULT_DASHBOARD, DEFAULT_USER_UUID } from '@/configuration/default-dashboard-config'
import { COMMAND_REFRESH_DASHBOARD } from '@/configuration/ws-communication-commands'
import { sendWSCommand } from '@/features/actions/websockets'
import { getUserFromAccessJWT } from '@/lib/cookie-reader'
import { getDBDashboard, getDBDefaultDashboard, removeDBDashboard, setDBDashboard, setDBDefaultDashboard } from '@/lib/dashboard-db-access'
import { DoubleSignedSkeletonDashboard, SignedSkeletonDashboard } from '@/lib/types'
import { toSingleSignedDashboard } from '@/lib/utils'

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
  const { id: userId } = await getUserFromAccessJWT()
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to post dashboard: ID was default ID on regular post call.')
    return { status: 401, error: 'You are probably not logged in.', msg: '' }
  }
  await setDBDashboard({ userId, dashboard: doubleSignedDashboard })
  await sendWSCommand({ userId, command: COMMAND_REFRESH_DASHBOARD })
  return { status: 200, error: 'ok', msg: 'ok' }
}

export const postGlobalDashboard = async ({ doubleSignedDashboard }: { doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  // to-do validation dashboard   (to-do because eslint)
  const { id: userId, admin } = await getUserFromAccessJWT()
  if (userId === DEFAULT_USER_UUID) {
    console.warn('Failed to post dashboard: ID was default ID on regular post call.')
    return { status: 401, error: 'You are probably not logged in.', msg: '' }
  } else if (!admin) {
    return { status: 403, error: 'You have no permission to update the global dashboard! You are probably not logged in.', msg: '' }
  }
  await setDBDefaultDashboard({ dashboard: doubleSignedDashboard })
  await sendWSCommand({ userId: DEFAULT_USER_UUID, command: COMMAND_REFRESH_DASHBOARD })
  return { status: 200, error: 'ok', msg: 'ok' }
}

export const eraseDashboard = async (): Promise<SignedSkeletonDashboard> => {
  const { id: userId } = await getUserFromAccessJWT()
  if (userId !== DEFAULT_USER_UUID) {
    await removeDBDashboard({ userId })
    await sendWSCommand({ userId, command: COMMAND_REFRESH_DASHBOARD })
  } else {
    console.warn('Failed to erase dashboard: ID was default ID on regular post call.')
  }
  return await getGlobalDashboard()
}
