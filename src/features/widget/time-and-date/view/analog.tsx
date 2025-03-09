'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useUserData } from '@/features/shared/user-provider'
import { TimeAndDateWidgetProps } from '@/features/widget/time-and-date/view/widget'
import { TimeAndDateArguments } from '@/lib/argument-types'
import { rgba } from '@/lib/theme-helpers'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Clock from 'react-clock'

export const TimeDisplayAnalog = () => {
  const [time, setTime] = useState(new Date())
  const { theme, selectedTheme } = useUserData()
  const isLightTheme = selectedTheme === 'light'

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="aspect-square w-full rounded-full" style={isLightTheme ? {} : { backgroundColor: rgba(theme.foregroundText, 0.06) }}>
      <Clock value={time} size="100%" className={isLightTheme ? '' : 'invert'} />
    </div>
  )
}

export const TimeAndDateWidgetAnalog = ({}: TimeAndDateWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerMinimum, setContainerMinimum] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          setContainerMinimum(Math.min(containerRef.current.offsetHeight, containerRef.current.offsetWidth))
        }
      })
      resizeObserver.observe(containerRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="center flex h-full w-full flex-col items-center justify-evenly text-xl">
      <div
        style={{
          height: `${containerMinimum}px`,
          width: `${containerMinimum}px`,
        }}
      >
        {TimeDisplayAnalog()}
      </div>
    </div>
  )
}

export const TimeAndDateWidgetAnalogLoading = ({}: { args: TimeAndDateArguments }) => {
  return (
    <div className="center flex h-full w-full flex-col items-center justify-evenly text-xl">
      <Skeleton className="aspect-square h-full rounded-full" />
    </div>
  )
}
