import { Skeleton } from '@/components/ui/skeleton'
import { ExampleWidgetProps } from '@/features/widget/example/view/widget'
import { ExampleArguments } from '@/lib/argument-types'

export const ExampleWidgetDetail2 = ({ args }: ExampleWidgetProps) => {
  return (
    <div className="text-xl">
      <div className="text-[40%]">Hallo!</div>
      <div>
        <h1>Weather: [LoD: {args.dataFetchArgs.levelOfDetail}]</h1>
        <h1>Longitude: {args.dataFetchArgs.longitude}</h1>
        <h1>Latitude: {args.dataFetchArgs.latitude}</h1>
        <h2>{args.data.weather}</h2>
      </div>
      Hier noch mehr Details Example
    </div>
  )
}

export const ExampleWidgetDetail2Loading = ({ args }: { args: ExampleArguments }) => {
  return (
    <div className="text-xl">
      Hallo!
      <div>
        <h1>Weather: [LoD: {args.levelOfDetail}]</h1>
        <h1>Longitude: {args.longitude}</h1>
        <h1>Latitude: {args.latitude}</h1>
        Loading Data...
        <br />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-6 w-56 rounded-full" />
        </div>
      </div>
    </div>
  )
}
