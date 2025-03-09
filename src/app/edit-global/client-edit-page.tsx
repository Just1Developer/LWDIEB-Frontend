'use client'

import Loading, { LoadingScreen } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { EditGrid } from '@/features/edit-dashboard/editgrid'
import { UserDashboardLoader } from '@/features/shared/load-clientside-data'
import { useUserData } from '@/features/shared/user-provider'
import { EditDashboard } from '@/lib/types'
import { CircleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const GlobalEditDashboardClientPage = () => {
  const router = useRouter()
  const { loaded, user, theme } = useUserData()
  const [dashboard, setDashboard] = useState<EditDashboard>()

  if (!loaded) return <LoadingScreen text={'Verifying Access...'} />

  return (
    <main className="flex flex-col overflow-hidden" style={{ backgroundColor: theme.backgroundBoard }}>
      <div className="h-screen w-full">
        {user?.admin ? (
          <div className="ml-[3%] mr-[5%] h-full rounded-lg border-2 border-accent/80">
            <UserDashboardLoader setEditDashboardAction={setDashboard} type="admin" />
            {!dashboard ? (
              <div className="h-full w-full items-center">
                <Loading />
              </div>
            ) : (
              <EditGrid dashboard={dashboard} type="admin" />
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <div className="f-box gap-2 text-[110%] text-red-400">
              <CircleAlert size={30} />
              Could not verify permission level
            </div>
            <Button onClick={() => router.push('/')}>Go to Dashboard</Button>
            <Button onClick={() => router.push('/edit')}>Go to Edit Page</Button>
          </div>
        )}
      </div>
    </main>
  )
}
