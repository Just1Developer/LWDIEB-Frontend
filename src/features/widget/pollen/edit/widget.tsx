import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { PollenWidgetDetail } from '@/features/widget/pollen/edit/details'
import { PollenArguments, PollenType } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export interface PollenEditWidgetProps extends CommonEditWidgetProps {
  args: PollenArguments
  updateFn: ({ args }: { args: PollenArguments }) => void
}

export const DefaultPollenArgumentValues: PollenArguments = {
  levelOfDetail: 0,
  pollenTypes: [PollenType.BIRCH, PollenType.GRASS],
  region: 'BW_LOW_MOUNTAIN_RANGE',
}

export const PollenEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<PollenArguments>[] = [
    {
      component: PollenWidgetDetail,
      minimumSize: {
        name: 'Pollen data for today',
        width: 3,
        height: 2,
      },
    },
    {
      component: PollenWidgetDetail,
      minimumSize: {
        name: 'Pollen data for next two days',
        width: 3,
        height: 2,
      },
    },
    {
      component: PollenWidgetDetail,
      minimumSize: {
        name: 'Pollen data for next three days',
        width: 3,
        height: 2,
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
