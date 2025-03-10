'use client'

import { localStorageDashboardKey } from '@/configuration/local-storage-settings'
import { getDashboard, getGlobalDashboard } from '@/features/actions/dashboard-load'
import { verifyDashboardSignature, verifySignature } from '@/features/shared/signature'
import { useUserData } from '@/features/shared/user-provider'
import { getEditDashboard } from '@/lib/dashboard-helpers'
import { DoubleSignedSkeletonDashboard, EditDashboard, SignedSkeletonDashboard, SkeletonDashboard } from '@/lib/types'
import { toSingleSignedDashboard, toUnsignedWidget } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const UserDashboardLoader = ({
  setDashboardAction,
  setEditDashboardAction,
  type = 'user',
}: {
  setDashboardAction?: Dispatch<SetStateAction<SkeletonDashboard | undefined>>
  setEditDashboardAction?: Dispatch<SetStateAction<EditDashboard | undefined>>
  type?: 'admin' | 'user'
}) => {
  const { loaded, user } = useUserData()
  const [signedSkeletonDashboard, setSignedSkeletonDashboard] = useState<SignedSkeletonDashboard | undefined>()

  const { data: dashboardData, refetch } = useQuery({
    queryFn: async () => getDashboard(),
    queryKey: ['dashboard-client', type],
    enabled: false,
  })

  useEffect(() => {
    if (signedSkeletonDashboard) {
      if (setDashboardAction) {
        getVerifiedDashboard({ signedSkeletonDashboard }).then((dash) => setDashboardAction(dash))
      }
      if (setEditDashboardAction) {
        setEditDashboardAction(getEditDashboard({ signedSkeletonDashboard }))
      }
    }
  }, [signedSkeletonDashboard])

  useEffect(() => {
    if (dashboardData) {
      try {
        setSignedSkeletonDashboard(dashboardData)
      } catch (_) {}
    }
  }, [dashboardData])

  useEffect(() => {
    if (!loaded) return

    // Don't fetch if there is no valid setter
    if (!setDashboardAction && !setEditDashboardAction) return

    if (type === 'admin') {
      void getGlobalDashboard().then((dashboard) => {
        setSignedSkeletonDashboard(dashboard)
      })
      return
    }
    const fetchDashboard = !!user || !localStorage?.getItem(localStorageDashboardKey)
    void loadDashboardAsync({ fetchDashboard }).then((dash) => {
      if (!dash) void refetch()
      else setSignedSkeletonDashboard(dash)
    })
  }, [])

  return <></>
}

/**
 * Returns the loaded local dashboard or undefined if it should be fetched from the server instead
 * @param fetchDashboard If it should be fetched from the server immediately
 * @return a promise of the local dashboard or undefined
 */
const loadDashboardAsync = async ({ fetchDashboard }: { fetchDashboard: boolean }) => {
  if (fetchDashboard) {
    return
  } else {
    try {
      const localDashboard = JSON.parse(localStorage.getItem(localStorageDashboardKey) ?? '-') as DoubleSignedSkeletonDashboard
      const verified = await verifyDashboardSignature({ dashboard: localDashboard })
      return verified ? toSingleSignedDashboard({ dashboard: localDashboard }) : undefined
    } catch (_) {
      return
    }
  }
}

const getVerifiedDashboard = async ({ signedSkeletonDashboard }: { signedSkeletonDashboard: SignedSkeletonDashboard }) => {
  const verifiedDashboard: SkeletonDashboard = {
    gridHeight: signedSkeletonDashboard.gridHeight,
    gridWidth: signedSkeletonDashboard.gridWidth,
    widgets: (
      await Promise.all(
        signedSkeletonDashboard.widgets.map(async (widget) => ({
          widget,
          isValid: await verifySignature({ widget }),
        })),
      )
    )
      .filter(({ isValid }) => isValid)
      .map(({ widget }) => toUnsignedWidget({ widget })),
  }
  return verifiedDashboard
}
