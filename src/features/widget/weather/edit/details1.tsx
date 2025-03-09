import { LocationPicker } from '@/components/location-picker'
import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { MapView } from '@/components/map-view'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Unit } from '@/lib/argument-types'
import { Size } from '@/lib/widget-types'
import { WeatherEditWidgetProps } from './widget'

export const MapInsert = ({ latitude, longitude, currentSize }: { latitude: number; longitude: number; currentSize: Size }) => {
  const { height } = currentSize
  return (
    height >= 5 && (
      <div className="pointer-events-none z-auto flex items-center justify-self-center overflow-hidden pb-6 pt-[7%]">
        <MapView latitude={latitude} longitude={longitude} overrideZIndex />
      </div>
    )
  )
}

export const WeatherWidgetDetail1 = ({ args, updateFn, setDialog, currentSize }: WeatherEditWidgetProps) => {
  const { latitude, longitude, unit } = args

  const updateCoordsChange = ({ latitude, longitude }: LocationUpdateProps) => {
    try {
      const updatedArgs = {
        ...args,
        latitude: latitude,
        longitude: longitude,
      }
      updateFn({ args: updatedArgs })
    } catch (error) {
      return
    }
  }

  return (
    <div className="flex h-full w-full flex-col flex-wrap items-center gap-1">
      <MapInsert latitude={latitude} longitude={longitude} currentSize={currentSize} />
      <div className="mb-4">
        <label className="block justify-self-center text-sm font-medium">Pick Location:</label>
        <div className="justify-items-center">
          <LocationPicker onLocationPicked={updateCoordsChange} latitude={latitude} longitude={longitude} setDialog={setDialog} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block justify-self-center text-sm font-medium">Select a Unit:</label>
        <Select value={unit} onValueChange={(value: Unit) => updateFn({ args: { ...args, unit: value } })} disabled={false}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={unit} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Unit.CELSIUS}>Celsius</SelectItem>
              <SelectItem value={Unit.FAHRENHEIT}>Fahrenheit</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
