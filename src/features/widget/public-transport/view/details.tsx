import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { PublicTransportWidgetProps } from '@/features/widget/public-transport/view/widget'
import { PublicTransportArguments, TransportType } from '@/lib/argument-types'
import { rgba } from '@/lib/theme-helpers'
import { Size } from '@/lib/widget-types'
import { useRef } from 'react'

const nativeSize: Size = {
  width: 5,
  height: 5,
}

const typeOfTrain = (train: string) => {
  if (train.match(/^S?\d\d?|^I?RE$/g)) return TransportType.TRAIN
  if (train.match(/.*(?:[Bb]us|Flix).*/g)) return TransportType.BUS
  return TransportType.OTHER
}

export const PublicTransportWidgetView =
  (type: 'separateDelay' | 'combined') =>
  ({ args }: PublicTransportWidgetProps) => {
    const { data, dataFetchArgs, currentSize } = args
    const { theme, selectedTheme } = useUserData()
    const isLightTheme = selectedTheme === 'light'
    const containerRef = useRef<HTMLDivElement>(null)

    //eslint-disable-next-line sonarjs/cognitive-complexity
    const getColor = (train: string) => {
      if (train.match(/^S\d\d?$/g)) {
        // S1, S2, S3, etc.
        if (train.startsWith('S1')) return '#09945D'
        if (train.startsWith('S2')) return '#945a8c'
        if (train.startsWith('S3')) return '#00a99d'
        if (train.startsWith('S4')) return '#940039'
        if (train.startsWith('S5')) return '#ff9c94'
        if (train.startsWith('S6')) return '#282268'
        if (train.startsWith('S7')) return '#fff460'
        if (train.startsWith('S8')) return '#a36421'
        if (train.startsWith('S9')) return '#a6ce42'
      } else if (train.match(/\d\d?/g)) {
        if (train.startsWith('1')) return '#ff1900'
        if (train.startsWith('2')) return '#006ba5'
        if (train.startsWith('3')) return '#986f20'
        if (train.startsWith('4')) return '#ffbd00'
        if (train.startsWith('5')) return '#18bde7'
        if (train.startsWith('8')) return '#f7931d'
      } else if (train.includes('RE')) return '#6d6e70'
      if (train.includes('Flix')) return '#97d700'
      return theme.backgroundBoard
    }

    const getTextColor = (train: string) => {
      if (train.match(/^(?:[49]|S[57])/g)) return rgba('#1e1e1e', 0.9)
      else if (train.startsWith('Flix') || train.startsWith('S9')) return '#ffffff'
      else if (train.match(/^S?\d\d?$/g)) return '#efefef'
      return theme.foregroundText
    }

    const formatName = (name: string) => {
      return name
        .replaceAll(/Straßenbahn|S-Bahn|Metropolexpress|Einsatzwagen|\(Sondertarif\) |R-Bahn|(\n)/g, '')
        .replace(/(Schienen)[Ee]rsatz(verkehr|bus)/g, '(Bus)')
        .replace('Flixbus', 'Flix')
        .replace('Regionalb', 'Regio B')
        .replace('Stadtbus', 'Bus ')
        .replace('RE ', 'RE')
        .replaceAll(/([a-z\s]*\d+)[\sA-Z]*/gi, '$1')
        .trim()
    }

    const formatPlatform = (platform: string) => {
      return platform.match(/^\s*\d+\s*$/g)
        ? `Platform ${platform.trim()}`
        : platform.replaceAll('Gleis', 'Platform').replaceAll('Bstg', 'Bus plt')
    }

    const NoDepartures = () => (
      <div className="flex w-full flex-col items-center p-4 pt-[20%] text-zinc-400">
        <div className="text-[110%]">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            No departures to display
          </DynamicTextsize>
        </div>
      </div>
    )

    const toTime = (date: Date) => date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
    const departures = data.timeTable?.departures
      .map((departure) => {
        const planTimeStr = toTime(new Date(departure.planTime))
        const estTimeStr = departure.estTime.length > 6 ? toTime(new Date(departure.estTime)) : departure.estTime

        return {
          ...departure,
          name: formatName(departure.name),
          planTimeStr,
          estTimeStr,
          estTimeVal: new Date(departure.estTime.length < 6 ? departure.planTime : departure.estTime).getTime(),
        }
      })
      .filter(({ name }) => {
        const type = typeOfTrain(name)
        return dataFetchArgs.transportType.includes(type)
      })
      .sort(({ estTimeVal: a }, { estTimeVal: b }) => a - b)

    return (
      <div ref={containerRef} className="h-full w-full overflow-hidden rounded-lg p-4">
        <div className="mb-1 flex items-center">
          <div className="text-[140%] font-bold">
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              {dataFetchArgs.selectedStation.stopPointName}
            </DynamicTextsize>
          </div>
        </div>
        <div className="text-[82%] font-normal text-zinc-400">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {type === 'combined' ? 'Estimated Departure Time' : 'Planned Departure Time'}
          </DynamicTextsize>
        </div>
        {departures?.length > 0 ? (
          <div
            className={`grid grid-cols-1 grid-rows-${Math.min(Math.min(12, Math.round(currentSize.height / 2.5)), departures.length)} mt-2.5 gap-2`}
          >
            {departures?.map(({ estTime, estTimeStr, estTimeVal, dest, name, planTime, planTimeStr, platform }, index) => {
              const delayMinutes = Math.abs(estTimeVal - new Date(planTime).getTime()) / 60000
              const early = delayMinutes < 0
              const late = delayMinutes > 0
              const veryLate = delayMinutes > 5

              const isEstLate = estTime === 'pue'
              return (
                <div
                  key={index}
                  className="flex items-center justify-between overflow-hidden rounded-lg p-2"
                  style={{ backgroundColor: rgba(theme.accentForeground, 0.1) }}
                >
                  <div className="flex flex-col">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      <div className="flex w-full flex-row items-center space-x-3 font-semibold">
                        <div className={`min-w-[${currentSize.width * 10}%]`}>
                          <Badge
                            variant="none"
                            className="whitespace-nowrap text-[105%] transition-none"
                            style={{
                              backgroundColor: rgba(getColor(name), isLightTheme ? 0.95 : 0.8),
                              color: getTextColor(name),
                            }}
                          >
                            {name}
                          </Badge>
                        </div>
                        <div>{dest}</div>
                      </div>
                    </DynamicTextsize>
                    {dataFetchArgs.showPlatform && (
                      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                        <div className="mt-1 pl-1 text-[90%]">{formatPlatform(platform)}</div>
                      </DynamicTextsize>
                    )}
                  </div>
                  <div className="right-0 flex items-center font-normal">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      <Badge
                        variant="none"
                        className={`whitespace-nowrap ${veryLate ? 'border-red-500 bg-red-200 text-red-950' : ''}`}
                        style={
                          !veryLate
                            ? {
                                backgroundColor: theme.backgroundBoard,
                                color: theme.foregroundText,
                              }
                            : {}
                        }
                      >
                        {type === 'separateDelay' || isEstLate ? (
                          <>
                            <span>{planTimeStr}</span>
                            {(early || late) && (
                              <div className="ml-1">
                                <span> {early ? '-' : '+'} </span>
                                <span className={veryLate ? 'text-rose-700' : early ? 'text-green-500' : 'text-red-400'}>
                                  {delayMinutes}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <span>{estTimeStr}</span>
                        )}
                      </Badge>
                    </DynamicTextsize>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <NoDepartures />
        )}
      </div>
    )
  }

export const PublicTransportWidgetLoading = ({}: { args: PublicTransportArguments }) => {
  return (
    <div className="h-full w-full rounded-lg p-4">
      {/* station name */}
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="h-8 w-10/12" />
      </div>
      {/* list of departures */}
      <div className="flex flex-col gap-2">
        <div
          className="items-cente flex justify-between overflow-hidden rounded-lg pb-2"
          style={{ height: 'clamp(40px, 8vh, 160px)', fontSize: 'clamp(10px, 2vh, 16px)' }} // Dynamische Größe
        >
          <Skeleton className="h-full w-full"></Skeleton>
        </div>
        <div
          className="items-cente flex justify-between overflow-hidden rounded-lg pb-2"
          style={{ height: 'clamp(40px, 8vh, 160px)', fontSize: 'clamp(10px, 2vh, 16px)' }} // Dynamische Größe
        >
          <Skeleton className="h-full w-full"></Skeleton>
        </div>
      </div>
    </div>
  )
}
