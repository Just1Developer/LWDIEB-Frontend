import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { AdaptiveCardsDetailLoading, AdaptiveCardsWidgetDetail } from '@/features/widget/adaptive-cards/view/details'
import { AdaptiveCardsArguments, WidgetArguments, WidgetDataArguments } from '@/lib/argument-types'

interface AdaptiveCardsWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: AdaptiveCardsArguments
}

export interface AdaptiveCardsWidgetProps {
  args: WidgetArguments<AdaptiveCardsArguments, WidgetDataArguments>
}

export const AdaptiveCardsWidget = ({ skeletonArgs, currentSize }: AdaptiveCardsWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      arguments={skeletonArgs}
      levelsOfDetail={[
        {
          component: AdaptiveCardsWidgetDetail,
          loadingState: AdaptiveCardsDetailLoading,
        },
      ]}
      currentSize={currentSize}
    />
  )
}
