import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { TimeAndDateWidgetAnalog } from '@/features/widget/time-and-date/edit/analog'
import { TimeAndDateWidgetAnalogDate } from '@/features/widget/time-and-date/edit/analog-date'
import { TimeAndDateWidgetDigital } from '@/features/widget/time-and-date/edit/digital'
import { TimeAndDateWidgetDigitalDate } from '@/features/widget/time-and-date/edit/digital-date'
import { TimeAndDateArguments, TimeFormat } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export const DefaultTimeAndDateArgumentValues: TimeAndDateArguments = {
  levelOfDetail: 0,
  timeFormat: TimeFormat.SECONDS,
}

export interface TimeAndDateEditWidgetProps extends CommonEditWidgetProps {
  args: TimeAndDateArguments
  updateFn: ({ args }: { args: TimeAndDateArguments }) => void
}

export const TimeAndDateEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<TimeAndDateArguments>[] = [
    {
      component: TimeAndDateWidgetDigital,
      minimumSize: {
        name: 'Digital Watchface',
        width: 2,
        height: 1,
      },
    },
    {
      component: TimeAndDateWidgetDigitalDate,
      minimumSize: {
        name: 'Digital Watchface and Date',
        width: 2,
        height: 2,
      },
    },
    {
      component: TimeAndDateWidgetAnalog,
      minimumSize: {
        name: 'Analog Watchface',
        width: 2,
        height: 2,
      },
    },
    {
      component: TimeAndDateWidgetAnalogDate,
      minimumSize: {
        name: 'Analog Watchface and Date',
        width: 2,
        height: 3,
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
