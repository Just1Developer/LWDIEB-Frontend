import { NativeRenderAdaptiveCard } from '@/features/dashboard/adaptive-card-renderer'
import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { AdaptiveCardsWidgetDetailEdit } from '@/features/widget/adaptive-cards/edit/details-edit'
import { AdaptiveCardsWidgetDetailPreview } from '@/features/widget/adaptive-cards/edit/details-preview'
import { AdaptiveCardsArguments } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'
import React from 'react'

export interface AdaptiveCardsEditWidgetProps extends CommonEditWidgetProps {
  args: AdaptiveCardsArguments
  updateFn: ({ args }: { args: AdaptiveCardsArguments }) => void
}

export const DefaultAdaptiveCardsArgumentValues: AdaptiveCardsArguments = {
  levelOfDetail: 0,
  adaptiveCard: '{}',
  adaptiveCardData: '',
}

export const validateAdaptiveCardsArgumentValues = ({ args }: { args: AdaptiveCardsArguments }): boolean => {
  try {
    let data
    try {
      data = JSON.parse(args.adaptiveCardData)
    } catch (_) {
      data = undefined
    }
    // Test if it can be rendered
    return React.isValidElement(NativeRenderAdaptiveCard({ card: JSON.parse(args.adaptiveCard), data }))
  } catch (_) {
    return false // Error while parsing or something
  }
}

export const AdaptiveCardsEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<AdaptiveCardsArguments>[] = [
    {
      component: AdaptiveCardsWidgetDetailEdit,
      minimumSize: {
        name: 'Edit JSON',
        width: 1,
        height: 1,
      },
    },
    {
      component: AdaptiveCardsWidgetDetailPreview,
      minimumSize: {
        name: 'Preview',
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
