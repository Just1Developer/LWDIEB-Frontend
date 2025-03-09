import { getRoutingWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { RoutingWidgetMap, RoutingWidgetMapLoading } from '@/features/widget/routing/view/map'
import { RoutingArguments, RoutingDataArguments, WidgetArguments } from '@/lib/argument-types'

interface RoutingWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: RoutingArguments
}

export interface RoutingWidgetProps {
  args: WidgetArguments<RoutingArguments, RoutingDataArguments>
}

export const RoutingWidget = ({ skeletonArgs, currentSize }: RoutingWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={45000} // 45 seconds
      queryKey={'routing-data'}
      queryAction={getRoutingWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        { component: RoutingWidgetMap({ map: false }), loadingState: RoutingWidgetMapLoading },
        { component: RoutingWidgetMap({ map: true }), loadingState: RoutingWidgetMapLoading },
      ]}
      currentSize={currentSize}
    />
  )
}
