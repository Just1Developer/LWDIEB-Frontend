import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { ExampleEditWidgetProps } from '@/features/widget/example/edit/widget'

const nativeSize = {
  width: 2,
  height: 2,
}

export const ExampleWidgetDetail2 = ({ args, currentSize }: ExampleEditWidgetProps) => {
  return (
    <div className="text-xl">
      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
        TestLol
      </DynamicTextsize>
      <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
        Hallo2!
        <div>
          <h1>Weather: [LoD: {args.levelOfDetail}]</h1>
          <h1>Longitude: {args.longitude}</h1>
          <h1>Latitude: {args.latitude}</h1>
          <textarea className="h-12 w-40"></textarea>
        </div>
      </DynamicTextsize>
      Hier noch mehr Details
    </div>
  )
}
