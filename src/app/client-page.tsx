'use client'

import { LoadingScreen } from '@/components/loading'
import { Grid } from '@/features/dashboard/grid'
import HoverSidebar from '@/features/dashboard/sidebar'
import { SocketConnection } from '@/features/dashboard/socket-builder'
import { UserDashboardLoader } from '@/features/shared/load-clientside-data'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { SkeletonDashboard, Theme } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'

export const DashboardClientPage = () => {
  const [dashboard, setDashboard] = useState<SkeletonDashboard>()
  const { loaded, theme } = useUserData()
  if (!loaded) return <LoadingScreen />

  return (
    <main className="flex overflow-hidden" style={{ backgroundColor: theme.backgroundBoard }}>
      <SocketConnection />
      <UserDashboardLoader setDashboardAction={setDashboard} />
      <div className="h-screen w-full">
        <HoverSidebar />
        {!dashboard ? <LoadingScreen /> : <Grid dashboard={dashboard} />}
      </div>
      <HideMouse delay={2300} theme={theme} />
    </main>
  )
}

const HideMouse = ({ delay, theme }: { delay: number; theme: Theme }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)

  const onMouseMove = () => {
    setIsVisible(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, delay)
  }

  const onMouseLeave = () => {
    clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    onMouseMove()
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    document.body.style.cursor = isVisible ? 'auto' : 'none'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [isVisible])

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full bg-transparent">
      <div
        className={`${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-[101%] opacity-20'} duration-800 z-[2025] h-full w-[3%] border-r-4 shadow-lg transition-all ease-in-out`}
        style={{ background: rgba(theme.accent, 0.15), borderColor: rgba(theme.accent, 0.45) }}
      ></div>
    </div>
  )
}
