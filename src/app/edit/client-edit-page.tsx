'use client'

import Loading, { LoadingScreen } from '@/components/loading'
import { EditGrid } from '@/features/edit-dashboard/editgrid'
import { UserDashboardLoader } from '@/features/shared/load-clientside-data'
import { useUserData } from '@/features/shared/user-provider'
import { EditDashboard } from '@/lib/types'
import { useState } from 'react'

export const EditDashboardClientPage = () => {
  const { loaded, theme } = useUserData()
  const [dashboard, setDashboard] = useState<EditDashboard>()
  if (!loaded) return <LoadingScreen />

  return (
    <main className="flex flex-col overflow-hidden" style={{ backgroundColor: theme.backgroundBoard }}>
      <UserDashboardLoader setEditDashboardAction={setDashboard} />
      <div className="h-screen w-full">
        <div className="ml-[3%] mr-[5%] h-full rounded-lg border border-zinc-500/30">
          {!dashboard ? (
            <div className="h-full w-full items-center">
              <Loading />
            </div>
          ) : (
            <EditGrid dashboard={dashboard} />
          )}
        </div>
      </div>
    </main>
  )
}
