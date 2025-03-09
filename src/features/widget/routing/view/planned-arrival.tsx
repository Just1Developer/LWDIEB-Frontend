import { Badge } from '@/components/ui/badge'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { RoutingWidgetProps } from '@/features/widget/routing/view/widget'
import { useEffect, useState } from 'react'

export const EstimatedArrival = ({
  travelTimeInSeconds,
  travelTimeNoTraffic,
}: {
  travelTimeInSeconds: number
  travelTimeNoTraffic: number
}) => {
  const [estimatedArrival, setEstimatedArrival] = useState('')

  useEffect(() => {
    const updateArrivalTime = () => {
      const arrivalTime = new Date(Date.now() + travelTimeInSeconds * 1000)
      setEstimatedArrival(arrivalTime.toLocaleTimeString('de-DE'))
    }

    // Initial calculation
    updateArrivalTime()

    // Update every minute
    const interval = setInterval(updateArrivalTime, 60000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [travelTimeInSeconds])

  const delayMins = Math.floor((travelTimeInSeconds - travelTimeNoTraffic) / 60)
  const showDelay = Math.abs(travelTimeInSeconds / travelTimeNoTraffic - 1) > 0.05 || delayMins > 15

  return (
    <div>
      <p className="opacity-65">Arrival </p>
      <div className="flex flex-row items-center justify-center gap-2.5 text-center">
        <>{estimatedArrival.slice(0, -3)}</>
        {showDelay && (
          <div className="text-[45%]">
            <>{`(${delayMins > 0 ? '+' : '-'}${delayMins} min${delayMins != 1 ? 's' : ''})`}</>
          </div>
        )}
      </div>
    </div>
  )
}

const nativeSize = {
  width: 3,
  height: 3,
}

export const RoutingWidgetPlannedArrival = ({ args }: RoutingWidgetProps) => {
  const { currentSize, data } = args
  const { travelTimeInSeconds: defaultTime, travelTimeWithTrafficInSeconds: trafficTime, lengthInMeters } = data

  if (!trafficTime || !lengthInMeters) {
    return (
      <div className="w-full max-w-md rounded-lg bg-red-500 p-4 text-white">
        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="secondary">No route found</Badge>
        </DynamicTextsize>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center gap-4 overflow-hidden rounded-lg p-4">
      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
        <Badge className="text-center" variant="secondary">
          <EstimatedArrival travelTimeInSeconds={trafficTime} travelTimeNoTraffic={defaultTime} />
        </Badge>
      </DynamicTextsize>
      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
        <Badge className="text-center" variant="secondary">
          <div>
            <p className="opacity-65">Length </p>
            {(lengthInMeters / 1000).toFixed(2)} km
          </div>
        </Badge>
      </DynamicTextsize>
    </div>
  )
}
