'use client'

import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { cn } from '@/lib/utils'
import { Moon, Sun } from 'lucide-react'
import { HTMLAttributes, useEffect, useState } from 'react'
import { Button } from './ui/button'

export const ThemeToggle = ({ className }: Readonly<HTMLAttributes<HTMLButtonElement>>) => {
  const { theme, selectedTheme, setTheme } = useUserData()
  const [isLight, setIsLight] = useState(selectedTheme === 'light')

  useEffect(() => {
    setIsLight(selectedTheme === 'light')
  }, [selectedTheme])

  return (
    <Button
      theme={{ ...theme, backgroundButton: rgba('#000000', 0.0), foregroundButton: theme.foregroundText }}
      className={cn('bg-transparent', className)}
      size="icon"
      variant="ghost"
      aria-label="Toggle theme"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      <div
        className="absolute z-[-1] h-full w-full blur-md"
        style={{ backgroundColor: rgba(theme.foregroundText, selectedTheme === 'light' ? 0.2 : 0.15) }}
      ></div>
      {isLight ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
