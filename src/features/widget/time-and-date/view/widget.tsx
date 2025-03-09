import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { TimeAndDateWidgetAnalog, TimeAndDateWidgetAnalogLoading } from '@/features/widget/time-and-date/view/analog'
import { TimeAndDateWidgetAnalogDate, TimeAndDateWidgetAnalogDateLoading } from '@/features/widget/time-and-date/view/analog-date'
import { TimeAndDateWidgetDigital, TimeAndDateWidgetDigitalLoading } from '@/features/widget/time-and-date/view/digital'
import { TimeAndDateWidgetDigitalDate, TimeAndDateWidgetDigitalDateLoading } from '@/features/widget/time-and-date/view/digital-date'
import { TimeAndDateArguments, WidgetArguments, WidgetDataArguments } from '@/lib/argument-types'

interface TimeAndDateWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: TimeAndDateArguments
}

export interface TimeAndDateWidgetProps {
  args: WidgetArguments<TimeAndDateArguments, WidgetDataArguments>
}

export const TimeAndDateWidget = ({ skeletonArgs, currentSize }: TimeAndDateWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      arguments={skeletonArgs}
      levelsOfDetail={[
        {
          component: TimeAndDateWidgetDigital,
          loadingState: TimeAndDateWidgetDigitalLoading,
        },
        {
          component: TimeAndDateWidgetDigitalDate,
          loadingState: TimeAndDateWidgetDigitalDateLoading,
        },
        {
          component: TimeAndDateWidgetAnalog,
          loadingState: TimeAndDateWidgetAnalogLoading,
        },
        {
          component: TimeAndDateWidgetAnalogDate,
          loadingState: TimeAndDateWidgetAnalogDateLoading,
        },
      ]}
      currentSize={currentSize}
    />
  )
}
