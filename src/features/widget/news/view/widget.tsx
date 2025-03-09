import { getNewsWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { NewsWidgetDetail1, NewsWidgetDetail1Loading } from '@/features/widget/news/view/details1'
import { NewsWidgetDetail2, NewsWidgetDetail2Loading } from '@/features/widget/news/view/details2'
import { NewsArguments, NewsDataArguments, WidgetArguments } from '@/lib/argument-types'

interface NewsWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: NewsArguments
}

export interface NewsWidgetProps {
  args: WidgetArguments<NewsArguments, NewsDataArguments>
}

export const NewsWidget = ({ skeletonArgs, currentSize }: NewsWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={300000} // 5 minutes
      queryKey={'News-data'}
      queryAction={getNewsWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        {
          component: NewsWidgetDetail1,
          loadingState: NewsWidgetDetail1Loading,
        },
        {
          component: NewsWidgetDetail2,
          loadingState: NewsWidgetDetail2Loading,
        },
      ]}
      currentSize={currentSize}
    />
  )
}
