import { WeatherArguments, WeatherDaily } from '@/lib/argument-types'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateScalingFactorPercent, DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { Size } from '@/lib/widget-types'
import { useEffect, useRef, useState } from 'react'
import { getWeatherIcon, temperatureSymbol, WeatherWidgetDetail1 } from './details1'
import { WeatherWidgetProps } from './widget'

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const convertDay = (date: string) => {
  const d = new Date(date)
  return `${weekDays[d.getDay()]?.substring(0, 3)}. ${d.getDate()}`
}

const nativeSize: Size = {
  width: 4,
  height: 4,
}

export const WeatherWidgetDetail2 = ({ args }: WeatherWidgetProps) => {
  const { theme } = useUserData()
  const { currentSize, data, dataFetchArgs } = args
  const { future } = data
  const { unit } = dataFetchArgs
  const { width, height } = currentSize
  const weeks = Math.min(2, Math.ceil(future.length / 7))
  const weekIndices = [...Array(weeks).keys()]
  const degrees = temperatureSymbol[unit]

  const WeekComponent = ({ days }: { days: WeatherDaily[] }) => {
    return (
      <div
        className="grid rounded-lg"
        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))`, backgroundColor: rgba(theme.backgroundButton, 0.3) }}
      >
        {days.map(({ time, weatherCode, minTemperature, maxTemperature }, i) => {
          const { image, description } = getWeatherIcon(weatherCode)
          const [wide, setWide] = useState(false)
          const objRef = useRef<HTMLDivElement>(null)

          useEffect(() => {
            setWide((objRef.current && objRef.current.clientWidth > 1.4 * objRef.current.clientHeight) ?? false)
          }, [objRef.current])
          return (
            <div
              key={`day-${i}`}
              ref={objRef}
              className="relative flex flex-col items-center justify-center overflow-hidden whitespace-nowrap text-nowrap border-zinc-500/30 text-center"
              style={{ borderRightWidth: `${i < days.length - 1 ? 1 : 0}px` }}
            >
              {wide ? (
                <div className="flex flex-row-reverse items-center justify-center gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="z-auto flex text-[105%] font-semibold">
                      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                        {convertDay(time)}
                      </DynamicTextsize>
                    </div>
                    <div className="flex flex-col items-end gap-0 space-y-[1%] justify-self-end whitespace-nowrap text-nowrap pb-2 text-[82%] font-medium">
                      <div className="flex flex-row gap-0 space-x-0">
                        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                          Min:{' '}
                          <span className="text-[110%] font-semibold">
                            {minTemperature}
                            {degrees}
                          </span>
                        </DynamicTextsize>
                      </div>
                      <div className="flex flex-row gap-0 space-x-0">
                        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                          Max:{' '}
                          <span className="text-[110%] font-semibold">
                            {maxTemperature}
                            {degrees}
                          </span>
                        </DynamicTextsize>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full w-full items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={description}
                      className="z-auto max-h-full max-w-full -translate-y-[9%] scale-[1.13] bg-transparent object-contain"
                      style={{
                        width: `${calculateScalingFactorPercent({ currentSize, nativeSize })}%`,
                        height: `${calculateScalingFactorPercent({ currentSize, nativeSize })}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute flex h-full w-full items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={description}
                      className="z-auto max-h-full max-w-full -translate-y-[9%] scale-[0.62] bg-transparent object-contain"
                      style={{
                        width: `${calculateScalingFactorPercent({ currentSize, nativeSize })}%`,
                        height: `${calculateScalingFactorPercent({ currentSize, nativeSize })}%`,
                      }}
                    />
                  </div>
                  <div className="flex h-full flex-col justify-between">
                    <div className="z-auto text-[105%] font-semibold">
                      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                        {convertDay(time)}
                      </DynamicTextsize>
                    </div>
                    <div className="flex flex-col items-end gap-0 space-y-[1%] whitespace-nowrap text-nowrap pb-2 text-[82%] font-medium">
                      <div className="flex flex-row gap-0 space-x-0">
                        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                          Min:{' '}
                          <span className="text-[110%] font-semibold">
                            {minTemperature}
                            {degrees}
                          </span>
                        </DynamicTextsize>
                      </div>
                      <div className="flex flex-row gap-0 space-x-0">
                        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                          Max:{' '}
                          <span className="text-[110%] font-semibold">
                            {maxTemperature}
                            {degrees}
                          </span>
                        </DynamicTextsize>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid h-full w-full grid-rows-7 gap-y-2">
      <div
        style={{
          gridRow: `1 / span ${7 - weeks * 2}`, // 3 or 5
        }}
      >
        <WeatherWidgetDetail1
          args={{ ...args, currentSize: { width, height: height * (weeks === 1 ? 6 / 7 : 4 / 7) } }}
          nativeSizeOverride={{ width: nativeSize.width * 1.2, height: nativeSize.height * 0.8 }}
        />
      </div>
      <div
        className={`grid grid-cols-1 grid-rows-${weeks} gap-y-[2%] rounded-lg p-1`}
        style={{
          gridRow: `${weeks == 1 ? 6 : 4} / span ${weeks * 2}`, // start at 5 or 6, then span 2 or 3
        }}
      >
        {weekIndices.map((week) => {
          const startIndex = week * 7
          const days = future.slice(startIndex, startIndex + 7)
          return <WeekComponent key={`week-${week}`} days={days} />
        })}
      </div>
    </div>
  )
}

export const WeatherCardLoading = () => {
  return (
    <div className="flex w-24 flex-col flex-nowrap items-center justify-center gap-0 rounded-lg border border-gray-300 p-1 shadow-md">
      <Skeleton className="h-4 w-16" />
      <div className="flex flex-row flex-nowrap items-center justify-center gap-0">
        <div className="flex-none">
          <Skeleton className="h-12 w-12" />
        </div>
        <div>
          <div className="flex grow flex-col flex-nowrap items-center justify-center gap-[2px]">
            <div className="text-xs font-medium">
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="text-xs font-medium">
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const WeatherWidgetDetail2Loading = ({ args }: { args: WeatherArguments }) => {
  const { forecastDays } = args
  return (
    <div className="h-full w-full content-center justify-center">
      <div className="flex flex-col flex-nowrap items-center justify-center gap-1">
        <div className="w-full">
          <div className="flex flex-col flex-nowrap items-center justify-center gap-0 rounded-lg border-gray-300 p-0 shadow-md">
            <div className="text-l font-bold">
              <Badge variant={'default'}>Weather Today</Badge>
            </div>
            <div className="flex flex-row flex-nowrap items-center justify-center gap-0">
              <div className="flex grow flex-col flex-nowrap items-center justify-center gap-[2px]">
                <Badge variant={'outline'}>
                  <div className="text-center text-xs font-medium">
                    Currently: <br></br>
                    <div className="text-background">Loading</div>
                  </div>
                </Badge>
              </div>
              <div className="flex-none">
                <Skeleton className="h-14 w-14" />
              </div>
              <div>
                <div className="flex grow flex-col flex-nowrap items-center justify-center gap-[1px]">
                  <div className="text-xs font-medium">
                    Max:
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="text-xs font-medium">
                    Min:
                    <Skeleton className="h-4 w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-evenly gap-1">
          {Array.from({ length: forecastDays - 1 }).map((_, index) => (
            <div key={index}>
              <WeatherCardLoading />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
