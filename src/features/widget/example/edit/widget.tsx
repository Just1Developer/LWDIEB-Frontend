import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { ExampleWidgetDetail1 } from '@/features/widget/example/edit/details1'
import { ExampleWidgetDetail2 } from '@/features/widget/example/edit/details2'
import { ExampleArguments } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export interface ExampleEditWidgetProps extends CommonEditWidgetProps {
  args: ExampleArguments
  updateFn: ({ args }: { args: ExampleArguments }) => void
}

export const DefaultExampleArgumentValues: ExampleArguments = {
  levelOfDetail: 0,
  latitude: 49.01208,
  longitude: 8.415424,
}

export const validateExampleArgumentValues = ({ args }: { args: ExampleArguments }): boolean => {
  // Validate Argument Values: Is this valid to render? Are fields not empty?
  // This is important!
  const isLatitudeValid = args.latitude >= -90 && args.latitude <= 90
  const isLongitudeValid = args.longitude >= -180 && args.longitude <= 180
  return isLatitudeValid && isLongitudeValid
}

export const ExampleEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<ExampleArguments>[] = [
    {
      component: ExampleWidgetDetail1,
      minimumSize: {
        name: 'Minimal Information',
        width: 2,
        height: 2,
      },
    },
    {
      component: ExampleWidgetDetail2,
      minimumSize: {
        name: 'Advanced Location Data',
        width: 1,
        height: 1,
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
