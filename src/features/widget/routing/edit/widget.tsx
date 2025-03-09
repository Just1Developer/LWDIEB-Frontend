import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { RoutingWidgetDetail } from '@/features/widget/routing/edit/details'
import { LocationData, RoutingArguments } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export interface RoutingEditWidgetProps extends CommonEditWidgetProps {
  args: RoutingArguments
  updateFn: ({ args }: { args: RoutingArguments }) => void
}

const origin: LocationData = {
  latitude: 49.01208,
  longitude: 8.415424,
}

const destination: LocationData = {
  latitude: 49.090743,
  longitude: 8.42805,
}

export const DefaultRoutingArgumentValues: RoutingArguments = {
  origin: origin,
  destination: destination,
  levelOfDetail: 0,
}

export const RoutingEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<RoutingArguments>[] = [
    {
      component: RoutingWidgetDetail,
      minimumSize: {
        name: 'Values only',
        width: 2,
        height: 1,
      },
    },
    {
      component: RoutingWidgetDetail,
      minimumSize: {
        name: 'Map and Values',
        width: 3,
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
