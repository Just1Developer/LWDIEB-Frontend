'use server'

import { axiosInstance } from '@/configuration/axios-config'
import { EmptyDefaultDashboard } from '@/configuration/empty-dashboard'
import { verifyDashboardSignature } from '@/features/shared/signature'
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
    const response = await axiosInstance.get<DoubleSignedSkeletonDashboard>('/api/dashboard')
    return response.data
  } catch (error) {
    return { gridHeight: 9, gridWidth: 16, widgets: [], signature: { upperHalf: 0, lowerHalf: 0 } }
  }
}

export const getGlobalDashboard = async (): Promise<SignedSkeletonDashboard> => {
  try {
    // Long is too complex of a type to be passed down
    const response = await axiosInstance.get<DoubleSignedSkeletonDashboard>('/api/global-dashboard')
    return toSingleSignedDashboard({ dashboard: response.data })
  } catch (error) {
    return EmptyDefaultDashboard
  }
}

export const postDashboard = async ({ doubleSignedDashboard }: { doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  try {
    const response = await axiosInstance.post<DashboardPostReturn>('/api/dashboard', doubleSignedDashboard)
    return response.data
  } catch (error) {
    console.warn('Failed to post dashboard', error)
    return { status: 401, error: 'You are probably not logged in.', msg: '' }
  }
}

export const postGlobalDashboard = async ({ doubleSignedDashboard }: { doubleSignedDashboard: string }): Promise<DashboardPostReturn> => {
  try {
    const response = await axiosInstance.post<DashboardPostReturn>('/api/global-dashboard', doubleSignedDashboard)
    return response.data
  } catch (error) {
    return { status: 401, error: 'An unknown error occurred (axios fault)', msg: '' }
  }
}

export const eraseDashboard = async (): Promise<SignedSkeletonDashboard> => {
  try {
    const response = await axiosInstance.delete<DoubleSignedSkeletonDashboard>('/api/dashboard')
    const validated = await verifyDashboardSignature({ dashboard: response.data })
    return validated ? toSingleSignedDashboard({ dashboard: response.data }) : EmptyDefaultDashboard
  } catch (error) {
    return EmptyDefaultDashboard
  }
}
