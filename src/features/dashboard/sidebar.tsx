'use client'

import { CompanyLogo } from '@/components/company-logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { LOGIN_LINK_GOOGLE, LOGIN_LINK_KIT, LOGIN_TEXT_GOOGLE, LOGIN_TEXT_KIT } from '@/configuration/login-link-configuration'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { Theme, User } from '@/lib/types'
import Link from 'next/link'
import { MouseEvent, useEffect, useRef, useState } from 'react'

const buttonClassname = 'hover:bg-accent/50 font-semibold duration-300 rounded-md transition-colors rounded-5 m-2 py-4 p-3.5 pr-2 h-auto'

const MouseEnterButton = ({ e, theme }: { e: MouseEvent<HTMLDivElement>; theme: Theme }) => {
  e.currentTarget.style.backgroundColor = rgba(theme.backgroundButton, 0.3)
}

const MouseLeaveButton = ({ e, theme }: { e: MouseEvent<HTMLDivElement>; theme: Theme }) => {
  e.currentTarget.style.backgroundColor = rgba(theme.backgroundButton, 0)
}

const time = () => new Date().getTime()

export default function HoverSidebar() {
  const { user, theme } = useUserData()
  const [isOpen, setIsOpen] = useState(false)
  const isOpenRef = useRef<boolean>(isOpen)
  const page = window ? window.location.pathname : '/'

  const openTime = 300
  const [lastOpen, setLastOpen] = useState(0)

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  document.addEventListener('mouseleave', () => setIsOpen(false))

  return (
    <Sheet open={isOpen}>
      <SheetTrigger asChild>
        <div
          className="absolute left-0 top-0 z-[1] h-screen w-[4%]"
          onMouseEnter={() => {
            setLastOpen(time())
            setIsOpen(true)
          }}
        ></div>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="f-col bg-faded z-[1010] h-full w-[25%] justify-between rounded-r-lg"
        style={{ backgroundColor: rgba(theme.backgroundBoard, 0.8) }}
        aria-describedby={undefined}
        theme={theme}
        closeOp={() => {
          if (time() > lastOpen + openTime) {
            setIsOpen(false)
          }
        }}
      >
        <SheetTitle className="hidden">Sidebar</SheetTitle>
        <div className="flex h-full flex-col justify-between" style={{ color: theme.foregroundText }}>
          <div className="space-y-4 overflow-auto p-4">
            <div className="f-center gap-3 pt-5">
              <div className="flex flex-row items-center justify-between gap-2">
                <CompanyLogo />
                <p className="pointer-events-none text-lg font-semibold">Dashboard for Insights and Everyday Briefing</p>
              </div>
            </div>
            <Separator />
            <div className="py-2">
              {page !== '/' && (
                <Link href="/">
                  <div
                    className={buttonClassname}
                    onMouseEnter={(e) => MouseEnterButton({ e, theme })}
                    onMouseLeave={(e) => MouseLeaveButton({ e, theme })}
                  >
                    View Dashboard
                  </div>
                </Link>
              )}
              <Link href="/edit">
                <div
                  className={buttonClassname}
                  onMouseEnter={(e) => MouseEnterButton({ e, theme })}
                  onMouseLeave={(e) => MouseLeaveButton({ e, theme })}
                >
                  Edit Dashboard
                </div>
              </Link>
              {user?.admin && (
                <Link href="/edit-global">
                  <div
                    className={buttonClassname}
                    onMouseEnter={(e) => MouseEnterButton({ e, theme })}
                    onMouseLeave={(e) => MouseLeaveButton({ e, theme })}
                  >
                    Edit Global Dashboard
                  </div>
                </Link>
              )}
              {user && page !== '/profile' && (
                <Link href="/profile">
                  <div
                    className={buttonClassname}
                    onMouseEnter={(e) => MouseEnterButton({ e, theme })}
                    onMouseLeave={(e) => MouseLeaveButton({ e, theme })}
                  >
                    Customize Themes
                  </div>
                </Link>
              )}
            </div>
            <Separator />
          </div>
          <div className="mb-1 p-4">
            {user ? (
              <UserProfile user={user} theme={theme} sidebarOpen={isOpen} />
            ) : (
              <>
                <a href={LOGIN_LINK_GOOGLE}>
                  <div className={buttonClassname}>→ {LOGIN_TEXT_GOOGLE}</div>
                </a>
                <a href={LOGIN_LINK_KIT}>
                  <div className={buttonClassname}>→ {LOGIN_TEXT_KIT}</div>
                </a>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const UserProfile = ({ user, theme, sidebarOpen }: { user: User; theme: Theme; sidebarOpen: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen && sidebarOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="w-full overflow-hidden">
        <div className="min-h-12 space-y-1 rounded-sm border p-4 text-left text-[105%]" style={{ borderColor: rgba(theme.accent, 0.7) }}>
          {user.name}
          <div className="text-[87%] text-zinc-500/85">{user.email}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[1012] w-[150%]" style={{ backgroundColor: rgba(theme.backgroundWidget, 0.8) }}>
        <DropdownMenuLabel className="flex items-center overflow-hidden">
          <span className="space-y-1 p-1 pr-2 text-[135%]">
            {user.name}
            <div className="text-[83%] text-zinc-500/85">{user.email}</div>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <a href="/profile">
            <div
              className={buttonClassname}
              style={{ backgroundColor: rgba(theme.accent, 0) }}
              onMouseEnter={(e) => MouseEnterButton({ e, theme })}
              onMouseLeave={(e) => MouseLeaveButton({ e, theme })}
            >
              Customize Themes
            </div>
          </a>
          <a href="/api/auth/logout">
            <div
              className={buttonClassname}
              style={{ backgroundColor: rgba(theme.accent, 0) }}
              onMouseEnter={(e) => MouseEnterButton({ e, theme })}
              onMouseLeave={(e) => MouseLeaveButton({ e, theme })}
            >
              Logout
            </div>
          </a>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
