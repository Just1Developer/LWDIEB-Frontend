import { getWeatherWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { WeatherArguments, WeatherDataArguments, WidgetArguments } from '@/lib/argument-types'
import { Size } from '@/lib/widget-types'
import { WeatherWidgetDetail1, WeatherWidgetDetail1Loading } from './details1'
import { WeatherWidgetDetail2, WeatherWidgetDetail2Loading } from './details2'

interface WeatherWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: WeatherArguments
}

export interface WeatherWidgetProps {
  args: WidgetArguments<WeatherArguments, WeatherDataArguments>
  nativeSizeOverride?: Size
}

export const WeatherWidget = ({ skeletonArgs, currentSize }: WeatherWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={600000} // 10 minutes
      queryKey={'weather-data'}
      queryAction={getWeatherWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        {
          component: WeatherWidgetDetail1,
          loadingState: WeatherWidgetDetail1Loading,
        },
        {
          component: WeatherWidgetDetail2,
          loadingState: WeatherWidgetDetail2Loading,
        },
      ]}
      currentSize={currentSize}
    />
  )
}
