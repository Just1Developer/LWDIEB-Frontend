import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { ReactNode } from 'react'

export const WidgetStyleContainer = ({ children }: { children: ReactNode }) => {
  const { theme, selectedTheme } = useUserData()
  const border =
    selectedTheme === 'light'
      ? { borderWidth: '0px', borderColor: 'transparent' }
      : { borderWidth: '2px', borderColor: rgba(theme.accent, 0.2) }

  return (
    <div
      className="flex h-full w-full overflow-hidden rounded-md border-2 p-1 shadow-md shadow-accent/20"
      style={{ color: theme.foregroundText, backgroundColor: theme.backgroundWidget, ...border }}
    >
      <div className="h-full w-full overflow-hidden rounded-lg p-3 shadow-2xl" style={{ backgroundColor: theme.backgroundWidget }}>
        {children}
      </div>
    </div>
  )
}

export const WidgetStyleContainerNoPadding = ({ children }: { children: ReactNode }) => {
  const { theme, selectedTheme } = useUserData()
  const border =
    selectedTheme === 'light'
      ? { borderWidth: '0px', borderColor: 'transparent' }
      : { borderWidth: '2px', borderColor: rgba(theme.accent, 0.2) }

  return (
    <div
      className="flex h-full w-full overflow-hidden rounded-md border-2 p-0.5 shadow-md shadow-accent/20"
      style={{ color: theme.foregroundText, backgroundColor: theme.backgroundWidget, ...border }}
    >
      <div className="h-full w-full overflow-hidden rounded-lg shadow-2xl" style={{ backgroundColor: theme.backgroundWidget }}>
        {children}
      </div>
    </div>
  )
}
