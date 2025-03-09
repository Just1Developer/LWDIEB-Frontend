import { TimeAndDateEditWidgetProps } from '@/features/widget/time-and-date/edit/widget'
import { TimeDisplayAnalog } from '@/features/widget/time-and-date/view/analog'
import { useLayoutEffect, useRef, useState } from 'react'

export const TimeAndDateWidgetAnalog = ({}: TimeAndDateEditWidgetProps) => {
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
    <div ref={containerRef} className="center flex h-full w-full flex-col items-center justify-evenly text-xl">
      <div
        style={{
          height: `${containerMinimum * 0.8}px`,
          width: `${containerMinimum * 0.8}px`,
        }}
      >
        <TimeDisplayAnalog />
      </div>
    </div>
  )
}
