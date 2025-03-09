'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LocationPickerProps } from '@/features/edit-dashboard/editgrid'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { Theme } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react'

// FROM: zenathra @/components/responsive-dialog, has option for mobile drawer excluded here
// Modified heavily

interface Props {
  callbackAction: () => void
  onAnyCloseEvent?: () => void
  setDialogAction?: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
  title: string
  description?: string
  cancelButtonText?: string
  confirmButtonText?: string
  trigger?: ReactNode
  open?: boolean
  children: ReactNode
  type?: 'small' | 'regular' | 'large' | 'maps' | 'text'
  confirmEnabled?: boolean
  themeOverride?: Theme
}

export const ResponsiveDialog = ({
  callbackAction, // The function executed when Confirm is pressed
  onAnyCloseEvent, // The function executed when the dialog closes, no matter how it was triggered
  setDialogAction, // The function to set the dialog in the edit grid. Optional, but the dialog cleans up after itself when provided.
  title, // The title
  description, // The description, optional.
  cancelButtonText = 'Cancel', // The text for the cancel button. Default is Cancel.
  confirmButtonText = 'Confirm', // The text for the confirm button. Default is Confirm.
  trigger, // The trigger that must be pressed to open. If none is provided, the dialog opens immediately.
  open: openDefault, // If the dialog should be open by default. Automatically true if trigger is undefined.
  children, // Dialog contents. Places inside <ResponsiveDialog> ... here ... </ResponsiveDialog>
  type: typeDefault, // The type. Not really important for you, but maps needs a different type so that the dialog is larger.
  confirmEnabled = true, // If the confirm button is enabled
  themeOverride, // If we want a specific theme regardless of the current theme
}: Props) => {
  const [open, setOpen] = useState((openDefault ?? false) || !trigger)
  const { theme: dataTheme } = useUserData()
  const theme = themeOverride ?? dataTheme

  useEffect(() => {
    if (open) return
    if (onAnyCloseEvent) onAnyCloseEvent()
    if (setDialogAction) setDialogAction(undefined)
  }, [open])

  const type = typeDefault ?? 'regular'

  const large = type === 'maps' || type === 'text'

  return (
    <div className={cn('z-[3000]')}>
      {trigger ? <div onClick={() => setOpen(true)}>{trigger}</div> : undefined}
      {/* What I am doing with type maps here is a bit blasphemous but as long as dialogs are buggy, this is the solution */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className={cn('z-[3001]', large ? 'h-[75%] w-[50%]' : type === 'small' ? 'min-h-20 max-w-sm' : 'min-h-20 max-w-lg')}
        >
          <DialogHeader className="max-h-10">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div
            className={cn(
              'mb-10 w-full',
              type === 'maps' ? 'h-[200%] -translate-y-[45%]' : type === 'text' ? 'h-[200%] -translate-y-[31%]' : 'h-full',
            )}
          >
            {children}
          </div>
          {cancelButtonText.length !== 0 || confirmButtonText.length !== 0 ? (
            <div
              className="absolute bottom-0 left-0 z-[101] flex h-12 w-full items-center justify-end space-x-[5%] overflow-hidden border-t border-gray-500 bg-accent/20 pr-[5%]"
              onMouseDown={(e) => {
                e.preventDefault()
              }}
            >
              {cancelButtonText.length !== 0 ? (
                <Button
                  className="border"
                  style={{ backgroundColor: rgba(theme.foregroundButton, 0.6), color: theme.backgroundButton, borderColor: theme.accent }}
                  onClick={() => setOpen(false)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = rgba(theme.backgroundButton, 0.95)
                    e.currentTarget.style.color = theme.foregroundButton
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = rgba(theme.foregroundButton, 0.6)
                    e.currentTarget.style.color = theme.backgroundButton
                  }}
                >
                  {cancelButtonText}
                </Button>
              ) : undefined}
              {confirmButtonText.length !== 0 ? (
                <Button
                  onClick={() => {
                    setOpen(false)
                    callbackAction()
                  }}
                  disabled={!confirmEnabled}
                >
                  {confirmButtonText}
                </Button>
              ) : undefined}
            </div>
          ) : undefined}
        </DialogContent>
      </Dialog>
    </div>
  )
}
