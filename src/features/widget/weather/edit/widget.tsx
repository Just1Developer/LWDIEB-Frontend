import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { Unit, WeatherArguments } from '@/lib/argument-types'
import { EditableComponent, Size } from '@/lib/widget-types'
import { WeatherWidgetDetail1 } from './details1'
import { WeatherWidgetDetail2 } from './details2'
import { WeatherWidgetDetail3 } from './details3'

export interface WeatherEditWidgetProps extends CommonEditWidgetProps {
  args: WeatherArguments
  updateFn: ({ args }: { args: WeatherArguments }) => void
}

export const DefaultWeatherArgumentValues: WeatherArguments = {
  levelOfDetail: 0,
  longitude: 8.41542287541877,
  latitude: 49.01258806984499,
  unit: Unit.CELSIUS,
  forecastDays: 1,
}

export const shouldWeatherForecastDayBeEnabled = ({ dayIndex, width }: { dayIndex: number; width: number }) =>
  width >= 5 || (width >= 4 && dayIndex < 5) || (width >= 3 && dayIndex < 3)

export const validateWeatherArgumentValues = ({ args, size }: { args: WeatherArguments; size: Size }): boolean => {
  // Validate Argument Values: Is this valid to render? Are fields not empty?
  const { latitude, longitude, levelOfDetail, forecastDays } = args
  const isLatitudeValid = latitude >= -90 && latitude <= 90
  const isLongitudeValid = longitude >= -180 && longitude <= 180
  return (
    isLatitudeValid &&
    isLongitudeValid &&
    shouldWeatherForecastDayBeEnabled({ dayIndex: forecastDays - 1, width: size.width }) &&
    (levelOfDetail === 2 || forecastDays <= 7)
  )
}

export const WeatherEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<WeatherArguments>[] = [
    {
      component: WeatherWidgetDetail1,
      minimumSize: {
        name: 'Todays weather',
        width: 3,
        height: 3,
      },
    },
    {
      component: WeatherWidgetDetail2,
      minimumSize: {
        name: 'Weather up to next week',
        width: 3,
        height: 4,
      },
    },
    {
      component: WeatherWidgetDetail3,
      minimumSize: {
        name: 'Weather up to next two weeks',
        width: 5,
        height: 5,
      },
    },
  ]

  return LevelOfDetails.map(
    ({ component, minimumSize }): EditableComponent =>
      toEditableComponent({
        result: FormlessEditableWidget({
          LevelOfDetail: component,
        }),
        minimumSize: minimumSize,
      }),
  )
}
