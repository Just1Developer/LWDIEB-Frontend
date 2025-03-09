import { getPublicTransportWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { PublicTransportWidgetLoading, PublicTransportWidgetView } from '@/features/widget/public-transport/view/details'
import { PublicTransportArguments, PublicTransportDataArguments, WidgetArguments } from '@/lib/argument-types'

interface PublicTransportWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: PublicTransportArguments
}

export interface PublicTransportWidgetProps {
  args: WidgetArguments<PublicTransportArguments, PublicTransportDataArguments>
}

export const PublicTransportWidget = ({ skeletonArgs, currentSize }: PublicTransportWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={8000} // 8 seconds
      queryKey={'public-transport-data'}
      queryAction={getPublicTransportWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        { component: PublicTransportWidgetView('separateDelay'), loadingState: PublicTransportWidgetLoading },
        { component: PublicTransportWidgetView('combined'), loadingState: PublicTransportWidgetLoading },
      ]}
      currentSize={currentSize}
    />
  )
}
