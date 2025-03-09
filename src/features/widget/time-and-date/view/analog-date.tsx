'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { TimeDisplayAnalog } from '@/features/widget/time-and-date/view/analog'
import { TimeAndDateWidgetProps } from '@/features/widget/time-and-date/view/widget'
import { TimeAndDateArguments } from '@/lib/argument-types'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export const DateDisplay = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {time.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}
    </div>
  )
}

export const TimeAndDateWidgetAnalogDate = ({}: TimeAndDateWidgetProps) => {
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
    <div ref={containerRef} className="center flex h-full w-full flex-col items-center justify-evenly gap-4">
      <div
        className="center flex flex-col items-center justify-center gap-y-2"
        style={{
          height: `${containerMinimum * 0.8}px`,
          width: `${containerMinimum * 0.8}px`,
        }}
      >
        <TimeDisplayAnalog />
        <div
          className="tracking-widest"
          style={{
            fontSize: `clamp(0px, ${containerMinimum * 0.1}px, 70px)`,
          }}
        >
          <DateDisplay />
        </div>
      </div>
    </div>
  )
}

export const TimeAndDateWidgetAnalogDateLoading = ({}: { args: TimeAndDateArguments }) => {
  return (
    <div className="center flex h-full w-full flex-col items-center justify-evenly gap-4 text-xl">
      <div className="aspect-square h-full">
        <Skeleton className="aspect-square w-[95%] rounded-full" />
      </div>
      <Skeleton className="h-[15%] w-40 rounded-full" />
    </div>
  )
}
