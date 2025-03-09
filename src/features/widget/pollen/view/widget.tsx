import { getPollenWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { PollenWidgetLoading, PollenWidgetView } from '@/features/widget/pollen/view/view'
import { PollenArguments, PollenDataArguments, WidgetArguments } from '@/lib/argument-types'

interface PollenWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: PollenArguments
}

export interface PollenWidgetProps {
  args: WidgetArguments<PollenArguments, PollenDataArguments>
}

export const PollenWidget = ({ skeletonArgs, currentSize }: PollenWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={300000} // 5 minutes
      queryKey={'pollen-data'}
      queryAction={getPollenWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        { component: PollenWidgetView({ days: 1 }), loadingState: PollenWidgetLoading },
        { component: PollenWidgetView({ days: 2 }), loadingState: PollenWidgetLoading },
        { component: PollenWidgetView({ days: 3 }), loadingState: PollenWidgetLoading },
      ]}
      currentSize={currentSize}
    />
  )
}
