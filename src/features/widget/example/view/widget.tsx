import { getExampleWidgetData } from '@/features/actions/dashboard-api-data'
import { CommonViewWidgetProps, FormlessWidget } from '@/features/dashboard/formless-widget'
import { ExampleWidgetDetail1, ExampleWidgetDetail1Loading } from '@/features/widget/example/view/details1'
import { ExampleWidgetDetail2, ExampleWidgetDetail2Loading } from '@/features/widget/example/view/details2'
import { ExampleArguments, ExampleDataArguments, WidgetArguments } from '@/lib/argument-types'

interface ExampleWidgetSkeletonProps extends CommonViewWidgetProps {
  skeletonArgs: ExampleArguments
}

export interface ExampleWidgetProps {
  args: WidgetArguments<ExampleArguments, ExampleDataArguments>
}

export const ExampleWidget = ({ skeletonArgs, currentSize }: ExampleWidgetSkeletonProps) => {
  return (
    <FormlessWidget
      refreshRate={950}
      queryKey={'weather-data'}
      queryAction={getExampleWidgetData}
      arguments={skeletonArgs}
      levelsOfDetail={[
        {
          component: ExampleWidgetDetail1,
          loadingState: ExampleWidgetDetail1Loading,
        },
        {
          component: ExampleWidgetDetail2,
          loadingState: ExampleWidgetDetail2Loading,
        },
      ]}
      currentSize={currentSize}
    />
  )
}
