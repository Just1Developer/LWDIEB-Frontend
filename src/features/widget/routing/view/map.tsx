import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { EstimatedArrival } from '@/features/widget/routing/view/planned-arrival'
import { RoutingWidgetProps } from '@/features/widget/routing/view/widget'
import { LocationData } from '@/lib/argument-types'
import { rgba } from '@/lib/theme-helpers'
import { Size } from '@/lib/widget-types'
import { ReactNode, useEffect, useState } from 'react'

export interface LeafletMapViewProps {
  deltaTime: number
  locations: LocationData[]
}

export const LocationMap = ({ deltaTime, locations }: Readonly<LeafletMapViewProps>) => {
  if (!locations || locations.length === 0 || !locations[0]) return <p>No locations provided</p>
  const [mapComponent, setMapComponent] = useState<ReactNode>(undefined)

  useEffect(() => {
    if (mapComponent) return
    const initLeaflet = async () => {
      const { LeafletMapView } = await import('@/components/leaflet-mapview')
      setMapComponent(<LeafletMapView deltaTime={deltaTime} locations={locations} />)
    }

    void initLeaflet()
  }, [])

  return <div className="pointer-events-none z-0 h-full w-full">{mapComponent}</div>
}

const nativeSizeNoMap = {
  width: 1.6,
  height: 1,
}

const nativeSizeYesMap = {
  width: 3,
  height: 3,
}

export const RoutingWidgetMap =
  ({ map }: { map: boolean }) =>
  ({ args }: RoutingWidgetProps) => {
    const { currentSize, data } = args
    const { points, travelTimeInSeconds: defaultTime, travelTimeWithTrafficInSeconds: trafficTime, lengthInMeters } = data
    const { theme } = useUserData()

    if (!points) {
      return (
        <div className="w-full max-w-md rounded-lg bg-red-500 p-4 text-white">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSizeNoMap}>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="secondary">No route found</Badge>
          </DynamicTextsize>
        </div>
      )
    }

    const divStyle = { backgroundColor: rgba(theme.backgroundButton, 0.2) }

    return (
      <div className="center flex h-full w-full flex-col items-center justify-evenly gap-4 overflow-hidden rounded-lg p-4">
        <div className="w-full" style={map ? {} : { height: `100%` }}>
          <Badges
            currentSize={currentSize}
            nativeSize={map ? nativeSizeYesMap : nativeSizeNoMap}
            divStyle={divStyle}
            trafficTime={trafficTime}
            defaultTime={defaultTime}
            lengthInMeters={lengthInMeters}
            map={map}
          />
        </div>
        {map && <LocationMap deltaTime={trafficTime / defaultTime} locations={points} />}
      </div>
    )
  }

interface BadgesProps {
  currentSize: Size
  nativeSize: Size
  divStyle: { backgroundColor: string }
  trafficTime: number
  defaultTime: number
  lengthInMeters: number
  map: boolean
}

const Badges = ({ currentSize, nativeSize, divStyle, trafficTime, defaultTime, lengthInMeters, map }: BadgesProps) => (
  <div
    className="flex h-full w-full items-center justify-center gap-x-[10%] gap-y-[10%]"
    style={{ flexDirection: currentSize.width < 2 * currentSize.height && !map ? 'column' : 'row' }}
  >
    <Badge className="text-center" variant="none" style={divStyle}>
      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
        <EstimatedArrival travelTimeInSeconds={trafficTime} travelTimeNoTraffic={defaultTime} />
      </DynamicTextsize>
    </Badge>
    <Badge className="text-center" variant="none" style={divStyle}>
      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
        <div>
          <p className="opacity-65">Length </p>
          {(lengthInMeters / 1000).toFixed(2)} km
        </div>
      </DynamicTextsize>
    </Badge>
  </div>
)

export const RoutingWidgetMapLoading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center gap-4 overflow-hidden rounded-lg p-4">
      <Skeleton className="w-50 h-20" />
      <Skeleton className="w-50 h-20" />
    </div>
  )
}
