'use client'

import { LoadingScreen } from '@/components/loading'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { localStorageDashboardKey } from '@/configuration/local-storage-settings'
import { postDashboard } from '@/features/actions/dashboard-load'
import { LocationPickerProps } from '@/features/edit-dashboard/editgrid'
import { useUserData } from '@/features/shared/user-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { isValidElement, ReactNode, Suspense, useEffect, useState } from 'react'

export default function NewUserCallback() {
  return (
    <Suspense fallback={<LoadingScreen text="Loading..." />}>
      <NewUserCallbackContent />
    </Suspense>
  )
}

const NewUserCallbackContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { theme } = useUserData()
  const [localDashboard, setLocalDashboard] = useState<string | null>('loading')

  const [isUploading, setIsUploading] = useState(false)
  const [dialog, setDialog] = useState<ReactNode | LocationPickerProps>()

  const localDashboardValid = () => !!localDashboard?.match(/\{.*}/g)

  const openTryAgain = () => {
    setDialog(
      <ResponsiveDialog
        callbackAction={trySavingDashboard}
        title={'Upload failed'}
        setDialogAction={setDialog}
        confirmButtonText="Try again"
        confirmEnabled={localDashboardValid()}
        themeOverride={theme} // Theme should be consistent now
      >
        Failed to upload your local dashboard to your account.
      </ResponsiveDialog>,
    )
  }

  const goHome = () => router.replace('/')

  const trySavingDashboard = async () => {
    if (!localDashboard) {
      openTryAgain()
      return
    }
    setIsUploading(true)
    const response = await postDashboard({ doubleSignedDashboard: localDashboard })
    if (response.msg === 'Dashboard updated') {
      goHome()
      return
    }
    setIsUploading(false)
    openTryAgain()
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const localBoard = localStorage.getItem(localStorageDashboardKey)
    if (!localBoard) {
      goHome()
      return
    }

    // Refresh to properly log in, but after dashboard has loaded
    const refreshVal = searchParams.get('refresh')
    const refresh = parseInt(refreshVal ?? '0')
    if (refresh === 1) {
      new Promise((resolve) => setTimeout(resolve, 350)).then(() => {
        router.replace('/newusercallback')
        setLocalDashboard(localBoard)
      })
    }
  }, [])

  useEffect(() => {
    if (!localDashboard) {
      goHome()
      return
    }
    setDialog(
      <ResponsiveDialog
        callbackAction={trySavingDashboard}
        title={'Local dashboard found!'}
        setDialogAction={setDialog}
        cancelButtonText={'No'}
        confirmButtonText={'Yes'}
        confirmEnabled={localDashboardValid()}
      >
        Do you want to upload your local dashboard to your account?
      </ResponsiveDialog>,
    )
  }, [localDashboard])

  if (!localDashboard || localDashboard === 'loading') {
    return <></>
  }

  return (
    <main className="h-screen w-full overflow-hidden overscroll-none" style={{ backgroundColor: theme.backgroundBoard }}>
      {isUploading ? (
        <LoadingScreen text="Sit tight while we are uploading your local dashboard..." />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-5">
          <Button onClick={() => router.push('/')}>Go without Uploading</Button>
          <Button onClick={trySavingDashboard} disabled={!localDashboardValid()}>
            Upload Local Dashboard
          </Button>
        </div>
      )}
      {isValidElement(dialog) && !isUploading && dialog}
    </main>
  )
}
