'use client'

import { CompanyLogo } from '@/components/company-logo'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContentRightThemeToggle, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { widgetPreviews } from '@/configuration/widget-register/widget-previews'
import { time } from '@/features/edit-dashboard/editgrid'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { cn } from '@/lib/utils'
import React, { Dispatch, SetStateAction, useState } from 'react'

export interface DashboardInteractionButtonActionProps {
  setSaving: Dispatch<SetStateAction<boolean>>
  setSidebarStatus: Dispatch<SetStateAction<boolean>>
}

interface AdderHoverSidebarProps {
  setSidebarOpenAction: Dispatch<SetStateAction<boolean>>
  saveButtonPressedAction: ({ setSaving, setSidebarStatus }: DashboardInteractionButtonActionProps) => Promise<void>
  discardButtonPressedAction: () => void
  eraseButtonPressedAction: () => void
  injectWidgetAction: ({ triggerEvent, widgetType }: { triggerEvent: React.MouseEvent<HTMLDivElement>; widgetType: string }) => void
  type: 'admin' | 'user'
}

// Time to be able to open the sidebar after clicking on a widget
// This event isn't triggered when the cursor has already entered,
// this just needs to be long enough for the sidebar to close,
// because the trigger does trigger when going from sidebar to
// the trigger because that counts as enter
const SIDEBAR_OPEN_COOLDOWN = 500

export default function AdderHoverSidebar({
  saveButtonPressedAction,
  setSidebarOpenAction,
  injectWidgetAction,
  discardButtonPressedAction,
  eraseButtonPressedAction,
  type,
}: Readonly<AdderHoverSidebarProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [nextOpenTime, setNextOpenTime] = useState(0)
  const { theme } = useUserData()

  const buttonClassname = 'hover:bg-accent/50 font-semibold duration-300 transition-colors rounded-5 p-2.5 w-full h-full'

  const saveButtonClicked = ({ e }: { e: React.MouseEvent<HTMLParagraphElement> }) => {
    e.preventDefault()
    if (isSaving) return
    saveButtonPressedAction({ setSaving: setIsSaving, setSidebarStatus: setIsOpen }).then(() => setIsSaving(false))
  }

  const discardButtonClicked = ({ e }: { e: React.MouseEvent<HTMLParagraphElement> }) => {
    e.preventDefault()
    if (isSaving) return
    setIsOpen(false)
    discardButtonPressedAction()
  }

  const eraseButtonClicked = ({ e }: { e: React.MouseEvent<HTMLParagraphElement> }) => {
    e.preventDefault()
    if (isSaving) return
    setIsOpen(false)
    eraseButtonPressedAction()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div
          className="absolute right-0 top-0 h-screen w-[5%] bg-transparent"
          onMouseEnter={() => {
            if (time() - nextOpenTime < SIDEBAR_OPEN_COOLDOWN) return
            setIsOpen(true)
            setSidebarOpenAction(true)
          }}
        >
          <div
            className="ml-auto h-full w-[65%] border-l-4 shadow-lg"
            style={{ backgroundColor: rgba(theme.accent, 0.15), borderColor: rgba(theme.accent, 0.95) }}
          ></div>
        </div>
      </SheetTrigger>

      <SheetContentRightThemeToggle
        side="right"
        className="f-col bg-faded shadow-l-3xl z-[1010] w-[30%] rounded-l-lg px-2 py-4"
        style={{ backgroundColor: rgba(theme.backgroundBoard, 0.8) }}
        onMouseLeave={() => {
          setIsOpen(false)
          setSidebarOpenAction(false)
        }}
        aria-describedby={undefined}
        theme={theme}
      >
        <SheetTitle className="hidden">Title (required but hidden)</SheetTitle>
        <div className="space-y-3">
          <div className="f-center px-2 pb-1">
            <div className="flex flex-row items-center justify-start gap-2">
              <CompanyLogo px={50} />
              <p className="pointer-events-none text-[150%] text-lg font-semibold">Add Widgets</p>
            </div>
          </div>
          <Separator />
          <h1 id="sidebar-description-actions" className="text-gray-[400] bg-transparent text-center text-[95%] opacity-60">
            Actions
          </h1>
          <div className="mt-0 w-full pt-0">
            <div
              className={cn(
                'rounded-md border-2 border-gray-500/50',
                isSaving ? 'disabled cursor-wait bg-accent-foreground/10' : 'cursor-pointer',
              )}
              onClick={(e) => saveButtonClicked({ e })}
            >
              <p className={buttonClassname}>Save Dashboard</p>
            </div>
          </div>
          <div className="mt-0 w-full pt-0">
            <div
              className={cn(
                'duration-400 rounded-md border-2 border-gray-500/50 bg-red-400/30 transition-colors hover:bg-red-500/90',
                isSaving ? 'disabled cursor-wait bg-accent-foreground/20' : 'cursor-pointer',
              )}
              onClick={(e) => discardButtonClicked({ e })}
            >
              <p className={buttonClassname}>Discard Changes</p>
            </div>
          </div>
          {type !== 'admin' && (
            <div className="mt-0 w-full pt-0">
              <div
                className={cn(
                  'duration-400 rounded-md border-2 border-gray-500/50 bg-red-400/60 transition-colors hover:bg-red-600 hover:text-gray-100',
                  isSaving ? 'disabled cursor-wait bg-accent-foreground/20' : 'cursor-pointer',
                )}
                onClick={(e) => eraseButtonClicked({ e })}
              >
                <p className={buttonClassname}>Erase Custom Dashboard</p>
              </div>
            </div>
          )}
          <Separator />
          <p className="text-gray-[400] bg-transparent text-center text-[95%] opacity-60">Click on the Widget you want to add</p>
        </div>

        <div className="relative mb-1 grid grid-cols-2 gap-1.5 overflow-y-auto rounded-md border border-gray-500/20 p-2">
          {widgetPreviews.map(({ widgetType, widgetName, component }, index) => (
            <div
              className="duration-250 col-span-1 aspect-square h-full w-full cursor-pointer rounded-md border-2 border-gray-500/50 p-1 transition-colors hover:border-gray-300/95"
              title={widgetName} // Tooltip
              key={`addW-${index}`}
              onMouseDown={(e) => {
                if (e.button === 0) {
                  e.preventDefault()
                  setNextOpenTime(time() + SIDEBAR_OPEN_COOLDOWN)
                  setIsOpen(false)
                  injectWidgetAction({ triggerEvent: e, widgetType })
                }
              }}
            >
              <div className="h-full w-full overflow-hidden">{component}</div>
            </div>
          ))}
        </div>
      </SheetContentRightThemeToggle>
    </Sheet>
  )
}
