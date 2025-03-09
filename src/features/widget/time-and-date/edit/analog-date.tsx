import { TimeAndDateEditWidgetProps } from '@/features/widget/time-and-date/edit/widget'
import { TimeDisplayAnalog } from '@/features/widget/time-and-date/view/analog'
import { DateDisplay } from '@/features/widget/time-and-date/view/analog-date'
import { useLayoutEffect, useRef, useState } from 'react'

export const TimeAndDateWidgetAnalogDate = ({}: TimeAndDateEditWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerMinimum, setContainerMinimumm] = useState(0)

  useLayoutEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          setContainerMinimumm(Math.min(containerRef.current.offsetHeight, containerRef.current.offsetWidth))
        }
      })
      resizeObserver.observe(containerRef.current)

      return () => resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className="center flex h-full w-full flex-col items-center justify-evenly gap-4">
      <div
        className="center flex flex-col items-center justify-evenly gap-y-2"
        style={{
          height: `${containerMinimum * 0.7}px`,
          width: `${containerMinimum * 0.7}px`,
        }}
      >
        <TimeDisplayAnalog />
        <div
          className="tracking-widest"
          style={{
            fontSize: `clamp(0px, ${containerMinimum * 0.05}px, 70px)`,
          }}
        >
          <DateDisplay />
        </div>
      </div>
    </div>
  )
}
