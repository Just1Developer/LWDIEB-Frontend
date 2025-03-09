import { LocationPicker } from '@/components/location-picker'
import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { Badge } from '@/components/ui/badge'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { RoutingEditWidgetProps } from '@/features/widget/routing/edit/widget'
import { RoutingArguments } from '@/lib/argument-types'

const nativeSize = {
  width: 3,
  height: 3,
}

export const RoutingWidgetDetail = ({ args, updateFn, setDialog, currentSize }: RoutingEditWidgetProps) => {
  const { origin, destination } = args

  const updateOrigin = ({ latitude, longitude }: LocationUpdateProps) => {
    const updatedArgs: RoutingArguments = {
      ...args,
      origin: { latitude: latitude, longitude: longitude },
    }
    updateFn({ args: updatedArgs })
  }

  const updateDestination = ({ latitude, longitude }: LocationUpdateProps) => {
    const updatedArgs: RoutingArguments = {
      ...args,
      destination: { latitude: latitude, longitude: longitude },
    }
    updateFn({ args: updatedArgs })
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="absolute left-0 top-0 p-4">
        <p className="text-xs text-gray-400">Routing widget</p>
      </div>
      <div className="flex -translate-y-[10%] flex-col items-center justify-center space-y-6">
        <div className="flex flex-row items-center justify-center space-x-2">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            <Badge variant={'none'} className="flex flex-row gap-2">
              <>Origin:</>
              <LocationPicker
                iconSize={currentSize.width + currentSize.height}
                onLocationPicked={updateOrigin}
                setDialog={setDialog}
                latitude={origin.latitude}
                longitude={origin.longitude}
              />
            </Badge>
          </DynamicTextsize>
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            <Badge variant={'none'} className="flex flex-row gap-2">
              <>Destination:</>
              <LocationPicker
                iconSize={currentSize.width + currentSize.height}
                onLocationPicked={updateDestination}
                setDialog={setDialog}
                latitude={destination.latitude}
                longitude={destination.longitude}
              />
            </Badge>
          </DynamicTextsize>
        </div>
      </div>
    </div>
  )
}
