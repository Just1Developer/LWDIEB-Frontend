import { Skeleton } from '@/components/ui/skeleton'
import { ExampleWidgetProps } from '@/features/widget/example/view/widget'
import { ExampleArguments } from '@/lib/argument-types'

export const ExampleWidgetDetail1 = ({ args }: ExampleWidgetProps) => {
  return (
    <div className="text-xl">
      Hallo!
      <div>
        <h1>Weather: [LoD: {args.dataFetchArgs.levelOfDetail}]</h1>
        {args.data.weather}
      </div>
    </div>
  )
}

export const ExampleWidgetDetail1Loading = ({ args }: { args: ExampleArguments }) => {
  return (
    <div className="text-xl">
      Hallo!
      <div>
        <h1>Weather: [LoD: {args.levelOfDetail}]</h1>
        Loading Data...
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>
    </div>
  )
}
