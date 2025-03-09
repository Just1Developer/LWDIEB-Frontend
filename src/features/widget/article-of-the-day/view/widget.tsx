import { getWikipediaWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { WikipediaWidgetView, WikipediaWidgetViewLoading } from '@/features/widget/article-of-the-day/view/view'
import { WidgetArguments, WikipediaArguments, WikipediaDataArguments } from '@/lib/argument-types'

interface WikipediaWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: WikipediaArguments
}

export interface WikipediaWidgetProps {
  args: WidgetArguments<WikipediaArguments, WikipediaDataArguments>
}

export const WikipediaWidget = ({ skeletonArgs, currentSize }: WikipediaWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={25000} // 25 seconds because it's in the habit of failing
      queryKey={'wikipedia-data'}
      queryAction={getWikipediaWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        {
          component: WikipediaWidgetView({ showButton: true, showDescription: true }),
          loadingState: WikipediaWidgetViewLoading({ showButton: true, showDescription: true }),
        },
        {
          component: WikipediaWidgetView({ showButton: true, showDescription: false }),
          loadingState: WikipediaWidgetViewLoading({ showButton: true, showDescription: true }),
        },
        {
          component: WikipediaWidgetView({ showButton: false, showDescription: true }),
          loadingState: WikipediaWidgetViewLoading({ showButton: true, showDescription: true }),
        },
        {
          component: WikipediaWidgetView({ showButton: false, showDescription: false }),
          loadingState: WikipediaWidgetViewLoading({ showButton: true, showDescription: true }),
        },
      ]}
      currentSize={currentSize}
    />
  )
}
