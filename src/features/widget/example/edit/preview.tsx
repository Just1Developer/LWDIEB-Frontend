// This can be done however you like.

// You can hardcode the widget, like this:

import { ExampleWidgetDetail1 } from '@/features/widget/example/view/details1'
import { ExampleArguments, ExampleDataArguments } from '@/lib/argument-types'

export const ExampleWidgetPreview = () => (
  <div className="text-[80%]">
    Hallo!
    <div>
      <h1>Weather: [LoD: 0]</h1>
      Weather: Sunny or Something
    </div>
  </div>
)

// Alternatively, you can hardcode the data and render a specific level of detail:

const dataFetchArgs: ExampleArguments = {
  levelOfDetail: 0,
  latitude: 42,
  longitude: 69,
}

const data: ExampleDataArguments = {
  weather: 'nice',
}

// Import from /dashboard/, NOT from /edit-dashboard/
export const ExampleWidgetPreviewAlternative = () => (
  <ExampleWidgetDetail1 args={{ dataFetchArgs, data, currentSize: { width: 1, height: 1 } }} />
)

// Either way, there must be a constant exported here that is of type () => Element
// This can then be used in the component in /adder-sidebar/widget-previews.tsx
