import { TimeAndDateEditWidgetProps } from '@/features/widget/time-and-date/edit/widget'
import { DateDisplay } from '@/features/widget/time-and-date/view/analog-date'
import { TimeDisplayDigital } from '@/features/widget/time-and-date/view/digital'
import { TimeAndDateArguments, TimeFormat } from '@/lib/argument-types'
import { ChangeEvent, FC, useLayoutEffect, useRef, useState } from 'react'

export const TimeAndDateWidgetDigitalDate = ({ args, updateFn }: TimeAndDateEditWidgetProps) => {
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

  let clock = <TimeDisplayDigital updateInterval={1000} />

  if (args.timeFormat == TimeFormat.MINUTES) {
    clock = <TimeDisplayDigital updateInterval={1000} format={(time) => time.toLocaleTimeString('de-DE').slice(0, -3)} />
  }

  interface DropdownProps {
    updateFn: (data: any) => void
    args: TimeAndDateArguments
  }

  const Dropdown: FC<DropdownProps> = ({ updateFn, args }) => {
    // State to track the selected option
    const [selected, setSelected] = useState<TimeFormat>(args.timeFormat) // Initialize with args.timeFormat

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as TimeFormat // Convert to enum type
      setSelected(value) // Update state

      // Update args with the new selection
      const newArgs = { ...args, timeFormat: value }
      updateFn({ args: newArgs }) // Call update function with new value
    }

    return (
      <div>
        <select value={selected} onChange={handleChange}>
          {Object.values(TimeFormat).map((format) => (
            <option key={format} value={format}>
              {format.charAt(0).toUpperCase() + format.slice(1)}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col items-center justify-center text-xl">
      <h1
        className="mb-5"
        style={{
          fontSize: `clamp(0px, ${containerMinimum * 0.05}px, 70px)`,
        }}
      >
        Select Digital clock style
      </h1>
      <Dropdown updateFn={updateFn} args={args} />
      <div className="flex h-full w-full flex-col items-center justify-evenly text-center text-xl">
        <div
          className="font-mono tracking-widest"
          style={{
            fontSize: `clamp(0px, ${containerMinimum * 0.17}px, 70px)`,
          }}
        >
          {clock}
        </div>
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
