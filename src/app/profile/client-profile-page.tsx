'use client'

import { ThemeSelectorPage } from '@/app/profile/theme-selector-page'
import { LoadingScreen } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { LOGIN_LINK_GOOGLE, LOGIN_LINK_KIT, LOGIN_TEXT_GOOGLE, LOGIN_TEXT_KIT } from '@/configuration/login-link-configuration'
import HoverSidebar from '@/features/dashboard/sidebar'
import { useUserData } from '@/features/shared/user-provider'
import { CircleAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const ThemesClientPage = () => {
  const router = useRouter()
  const { theme, loaded, user } = useUserData()

  if (!loaded) {
    return <LoadingScreen />
  }

  return (
    <main className="flex overflow-hidden" style={{ backgroundColor: theme.backgroundBoard }}>
      <div className="h-screen w-full">
        {user ? (
          <>
            <ThemeSelectorPage />
            <div className="absolute inset-0 z-[1] h-full w-[2%] translate-x-0 border-r-4 border-accent/45 bg-accent/10 opacity-100 shadow-lg"></div>
          </>
        ) : (
          <div className="z-[2] flex h-full flex-col items-center justify-center gap-5">
            <div className="f-box z-[3] gap-2 text-[110%] text-red-400">
              <CircleAlert size={30} />
              You must be logged in to customize your profile
            </div>
            <Button onClick={() => router.push(LOGIN_LINK_GOOGLE)}>{LOGIN_TEXT_GOOGLE}</Button>
            <Button onClick={() => router.push(LOGIN_LINK_KIT)}>{LOGIN_TEXT_KIT}</Button>
          </div>
        )}
        <HoverSidebar />
      </div>
    </main>
  )
}
