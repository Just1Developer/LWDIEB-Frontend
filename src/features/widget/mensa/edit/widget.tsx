import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { MensaWidgetDetail } from '@/features/widget/mensa/edit/details'
import { MensaArguments } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export interface MensaEditWidgetProps extends CommonEditWidgetProps {
  args: MensaArguments
  updateFn: ({ args }: { args: MensaArguments }) => void
}

export const DefaultMensaArgumentValues: MensaArguments = {
  levelOfDetail: 0,
  canteenType: 'MENSA_AM_ADENAUERRING',
  lineId: '5a11b7c4-1b58-4fe6-a084-1848a643fafd',
  priceType: 'STUDENT',
}

export const MensaEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<MensaArguments>[] = [
    {
      component: MensaWidgetDetail,
      minimumSize: {
        name: 'Design 1',
        width: 3,
        height: 3,
      },
    },
    {
      component: MensaWidgetDetail,
      minimumSize: {
        name: 'Design 2',
        width: 3,
        height: 3,
      },
    },
    {
      component: MensaWidgetDetail,
      minimumSize: {
        name: 'Design 1 Just Food',
        width: 3,
        height: 3,
      },
    },
    {
      component: MensaWidgetDetail,
      minimumSize: {
        name: 'Design 2 Just Food',
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

export const validateMensaArgumentValues = ({ args }: { args: MensaArguments }): boolean => {
  if (args.levelOfDetail < 0) {
    return false
  }
  if (args.canteenType.trim() === '') {
    return false
  }
  if (args.lineId.trim() === '') {
    return false
  }
  if (args.priceType.trim() === '') {
    return false
  }

  const diningFacilities = [
    'MENSA_AM_ADENAUERRING',
    'MENSA_SCHLOSS_GOTTESAUE',
    'MENSA_MOLTKE',
    'MENSA_MOLTKESTRAßE_30',
    'MENSA_ERZBERGERSTRAßE',
    'MENSA_TIEFENBRONNERSTRAßE',
    'MENSA_HOLZGARTENSTRAßE',
  ]
  return diningFacilities.includes(args.canteenType)
}
