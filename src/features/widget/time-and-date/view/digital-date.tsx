import { Skeleton } from '@/components/ui/skeleton'
import { DateDisplay } from '@/features/widget/time-and-date/view/analog-date'
import { TimeDisplayDigital } from '@/features/widget/time-and-date/view/digital'
import { TimeAndDateWidgetProps } from '@/features/widget/time-and-date/view/widget'
import { TimeAndDateArguments, TimeFormat } from '@/lib/argument-types'
import { useLayoutEffect, useRef, useState } from 'react'
import 'react-clock/dist/Clock.css'

export const TimeAndDateWidgetDigitalDate = ({ args }: TimeAndDateWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerMinimum, setContainerMinimum] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          if (containerRef.current.offsetWidth < containerRef.current.offsetHeight * 5) {
            setContainerMinimum(containerRef.current.offsetWidth)
          } else {
            setContainerMinimum(containerRef.current.offsetHeight * 5)
          }
        }
      })
      resizeObserver.observe(containerRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [])

  let clock = <TimeDisplayDigital updateInterval={1000} />

  if (args.dataFetchArgs.timeFormat == TimeFormat.MINUTES) {
    clock = <TimeDisplayDigital updateInterval={1000} format={(time) => time.toLocaleTimeString('de-DE').slice(0, -3)} />
  }

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col items-center justify-evenly text-center text-xl">
      <div
        className="mb-2 font-mono tracking-widest"
        style={{
          fontSize: `clamp(0px, ${containerMinimum * 0.13 * 1.1}px, 7000px)`,
        }}
      >
        {clock}
      </div>
      <div
        className="tracking-widest"
        style={{
          fontSize: `clamp(0px, ${containerMinimum * 0.13 * 0.6}px, 7000px)`,
        }}
      >
        <DateDisplay />
      </div>
    </div>
  )
}

export const TimeAndDateWidgetDigitalDateLoading = ({}: { args: TimeAndDateArguments }) => {
  return (
    <div className="center flex h-full w-full flex-col items-center justify-evenly gap-4 text-xl">
      <Skeleton className="h-[35%] w-full rounded-full" />
      <Skeleton className="h-[20%] w-full rounded-full" />
    </div>
  )
}
