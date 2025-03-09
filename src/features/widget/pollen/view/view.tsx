import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { regions } from '@/features/widget/pollen/edit/details'
import { PollenWidgetProps } from '@/features/widget/pollen/view/widget'
import { PollenArguments } from '@/lib/argument-types'
import { rgba } from '@/lib/theme-helpers'

const Exposure = ({ exposure }: { exposure: string }) => {
  const value = parseFloat(exposure)

  if (isNaN(value)) {
    return <span className="text-gray-500">invalid value</span>
  }
  if (value === 0) {
    return <span className="text-green-500">none</span>
  }
  if (value > 0 && value < 1) {
    return <span className="text-green-400">none to low</span>
  }
  if (value === 1) {
    return <span className="text-yellow-400">low</span>
  }
  if (value > 1 && value < 2) {
    return <span className="text-yellow-500">low to medium</span>
  }
  if (value === 2) {
    return <span className="text-orange-500">medium</span>
  }
  if (value > 2 && value < 3) {
    return <span className="text-orange-600">medium to high</span>
  }
  if (value === 3) {
    return <span className="text-red-500">high</span>
  }
  if (value > 3) {
    return <span className="text-red-700">very high</span>
  }

  return <span className="text-gray-500">off the charts</span>
}

const PollenName = ({ name }: { name: string }) => {
  switch (name) {
    case 'Ambrosia':
      return <span>Ambrosia</span>
    case 'Beifuss':
      return <span>Beifuss</span>
    case 'Birke':
      return <span>Birch</span>
    case 'Erle':
      return <span>Alder</span>
    case 'Esche':
      return <span>Ash</span>
    case 'Graeser':
      return <span>Grass</span>
    case 'Hasel':
      return <span>Hazel</span>
    case 'Roggen':
      return <span>Rye</span>
  }
}

const nativeSize = {
  width: 3,
  height: 3,
}

export const PollenWidgetView =
  ({ days }: { days: number }) =>
  ({ args }: PollenWidgetProps) => {
    const { currentSize, data } = args
    const { theme } = useUserData()

    if (!data.pollenDataList) {
      return (
        <div className="w-full max-w-md rounded-lg bg-red-500 p-4 text-white">
          <div className="text-xl font-bold">Error</div>
          <div>No pollen data could be found</div>
        </div>
      )
    }

    const dateString = (date: number) => new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
    const TIME_DAY = 86400000
    const regionName = regions.find((region) => region.value === data.regionName)?.label ?? 'Unknown Region'

    const dateStamps = [dateString(Date.now()), dateString(Date.now() + TIME_DAY), dateString(Date.now() + 2 * TIME_DAY)]
    const displayedDates = dateStamps.slice(0, days)

    return (
      <div className="h-full w-full overflow-hidden rounded-lg">
        {/* region name */}
        <div className="mb-4 flex items-center text-[120%] font-semibold">
          <div
            style={{
              fontSize:
                data.regionName === 'PREVIEW'
                  ? '210%'
                  : `${Math.round((1.01 - Math.min(0.02, Math.max(0.15, regionName.length / 550))) * 100)}%`,
            }}
          >
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              {regionName}
            </DynamicTextsize>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid w-full grid-cols-5 grid-rows-1 gap-4 pr-2 font-semibold">
            {displayedDates.map((date, index) => (
              <div key={`date-${index}`} className="flex flex-col items-center" style={{ gridColumn: `${6 - days + index} / span 1` }}>
                <div className="text-[90%]">
                  <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                    <div
                      className="rounded-md border-[1px] p-0.5"
                      style={{ borderColor: rgba(theme.accentForeground, 0.2), backgroundColor: rgba(theme.backgroundBoard, 0.25) }}
                    >
                      {date}
                    </div>
                  </DynamicTextsize>
                </div>
              </div>
            ))}
          </div>
          {data.pollenDataList.map((pollenData, index) => {
            const data = [pollenData.exposureToday, pollenData.exposureTomorrow, pollenData.exposureDayAfterTomorrow].slice(0, days)
            return (
              <div
                key={index}
                className="flex w-full items-center justify-between overflow-hidden rounded-lg p-2"
                style={{ backgroundColor: rgba(theme.accentForeground, 0.1) }}
              >
                <div className="flex flex-1 flex-col">
                  {/* pollen type */}
                  <div className="text-ellipsis text-[100%] font-bold">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      <PollenName name={pollenData.pollenType} />
                    </DynamicTextsize>
                  </div>
                </div>
                <div className="grid grid-cols-3 grid-rows-1 justify-end gap-2 truncate text-[90%] font-semibold">
                  {/* pollenData */}
                  {data.map((typeData, index) => (
                    <div
                      key={`data-${pollenData.pollenType}-${index}`}
                      className="max-w-[20%]"
                      style={{ gridColumn: `${4 - days + index} / span 1` }}
                    >
                      <Badge variant="none" style={{ backgroundColor: rgba(theme.backgroundBoard, 0.45) }}>
                        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                          <Exposure exposure={typeData} />
                        </DynamicTextsize>
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

export const PollenWidgetLoading = ({}: { args: PollenArguments }) => {
  return (
    <div className="w-full max-w-md rounded-lg p-4">
      {/* region name */}
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="h-8 w-10/12" />
      </div>
      {/* list of pollen data */}
      <div className="flex flex-col gap-2">
        <div
          className="items-cente flex justify-between overflow-hidden rounded-lg pb-2"
          style={{ height: 'clamp(40px, 8vh, 160px)', fontSize: 'clamp(10px, 2vh, 16px)' }}
        >
          <Skeleton className="h-full w-full"></Skeleton>
        </div>
        <div
          className="items-cente flex justify-between overflow-hidden rounded-lg pb-2"
          style={{ height: 'clamp(40px, 8vh, 160px)', fontSize: 'clamp(10px, 2vh, 16px)' }}
        >
          <Skeleton className="h-full w-full"></Skeleton>
        </div>
      </div>
    </div>
  )
}
