import { LocationPicker } from '@/components/location-picker'
import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { MapView } from '@/components/map-view'
import { ExampleEditWidgetProps } from '@/features/widget/example/edit/widget'

export const ExampleWidgetDetail1 = ({ args, updateFn, setDialog }: ExampleEditWidgetProps) => {
  // Here we can, if some details change, call the update function and pass in our "updated" arguments.
  // The function is defined in the edit grid, where the changes to the arguments will be stored in the widget state,
  // such that later the updated arguments in the updated state can be exported to the DB
  const { latitude, longitude, levelOfDetail } = args

  const updateCoordsChange = ({ latitude, longitude }: LocationUpdateProps) => {
    try {
      const updatedArgs = {
        ...args, // <-- rest of args (unchanged, needs to come first)
        latitude: latitude, // <-- stuff that has changed
        longitude: longitude,
      }
      updateFn({ args: updatedArgs }) // <-- this reloads the component. This means that stuff like localLatitude will be gone.
      // If we wish, we can set it to whatever we store in args, by setting the state to the loaded value by
      // default, and setting it like shown below in the <textarea>{here!}</textarea>
    } catch (error) {
      return
    }
  }

  return (
    <div className="h-full w-full text-xl">
      <LocationPicker onLocationPicked={updateCoordsChange} latitude={latitude} longitude={longitude} setDialog={setDialog} />
      <div>
        Weather: [LoD: {levelOfDetail}]<br />
        Latitude: {latitude}
        <br />
        Longitude: {longitude}
        <br />
        <div className="aspect-square h-5 max-h-5 w-5 max-w-5">
          <MapView latitude={latitude} longitude={longitude} />
        </div>
      </div>
    </div>
  )
}
