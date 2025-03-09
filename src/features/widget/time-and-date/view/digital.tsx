import { Skeleton } from '@/components/ui/skeleton'
import { TimeAndDateWidgetProps } from '@/features/widget/time-and-date/view/widget'
import { TimeAndDateArguments, TimeFormat } from '@/lib/argument-types'
import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import 'react-clock/dist/Clock.css'

interface TimeDisplayDigitalProps {
  updateInterval: number
  format?: (time: Date) => string // Optional function
}

export const TimeDisplayDigital: FC<TimeDisplayDigitalProps> = ({ updateInterval, format }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  return <div>{format ? format(time) : time.toLocaleTimeString('de-DE')}</div>
}

export const TimeAndDateWidgetDigital = ({ args }: TimeAndDateWidgetProps) => {
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
        className="font-mono tracking-widest"
        style={{
          fontSize: `clamp(0px, ${containerMinimum * 0.17}px, 7000px)`,
        }}
      >
        {clock}
      </div>
    </div>
  )
}

export const TimeAndDateWidgetDigitalLoading = ({}: { args: TimeAndDateArguments }) => {
  return (
    <div className="center flex h-full w-full flex-col items-center justify-evenly gap-4 text-xl">
      <Skeleton className="h-[20%] w-full rounded-full" />
    </div>
  )
}
