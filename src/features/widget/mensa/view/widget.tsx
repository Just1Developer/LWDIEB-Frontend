import { getMensaWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { MensaWidgetDetail, MensaWidgetDetailLoading } from '@/features/widget/mensa/view/details'
import { MensaArguments, MensaDataArguments, WidgetArguments } from '@/lib/argument-types'

interface MensaWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: MensaArguments
}

export interface MensaWidgetProps {
  args: WidgetArguments<MensaArguments, MensaDataArguments>
}

export const MensaWidget = ({ skeletonArgs, currentSize }: MensaWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={1800000} // 30 minutes
      queryKey={'mensa-data'}
      queryAction={getMensaWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        { component: MensaWidgetDetail({ showPrices: true, showIndividualStars: false }), loadingState: MensaWidgetDetailLoading },
        { component: MensaWidgetDetail({ showPrices: true, showIndividualStars: true }), loadingState: MensaWidgetDetailLoading },
        { component: MensaWidgetDetail({ showPrices: false, showIndividualStars: false }), loadingState: MensaWidgetDetailLoading },
        { component: MensaWidgetDetail({ showPrices: false, showIndividualStars: true }), loadingState: MensaWidgetDetailLoading },
      ]}
      currentSize={currentSize}
    />
  )
}
