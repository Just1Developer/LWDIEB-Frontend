import { AdaptiveCardsWidget } from '@/features/widget/adaptive-cards/view/widget'
import { WikipediaWidget } from '@/features/widget/article-of-the-day/view/widget'
import { ExampleWidget } from '@/features/widget/example/view/widget'
import { MensaWidget } from '@/features/widget/mensa/view/widget'
import { NewsWidget } from '@/features/widget/news/view/widget'
import { PollenWidget } from '@/features/widget/pollen/view/widget'
import { PublicTransportWidget } from '@/features/widget/public-transport/view/widget'
import { RoutingWidget } from '@/features/widget/routing/view/widget'
import { TimeAndDateWidget } from '@/features/widget/time-and-date/view/widget'
import { WeatherWidget } from '@/features/widget/weather/view/widget'
import {
  AdaptiveCardsArguments,
  ExampleArguments,
  MensaArguments,
  NewsArguments,
  PollenArguments,
  PublicTransportArguments,
  RoutingArguments,
  TimeAndDateArguments,
  WeatherArguments,
  WidgetSkeletonArguments,
  WikipediaArguments,
} from '@/lib/argument-types'
import { Size } from '@/lib/widget-types'

export const ViewWidgetFactoryRegister =
  ({ type }: { type: string }) =>
  ({ args, size }: { args: WidgetSkeletonArguments; size: Size }) =>
    ({
      example: <ExampleWidget skeletonArgs={args as ExampleArguments} currentSize={size} />,
      weather: <WeatherWidget skeletonArgs={args as WeatherArguments} currentSize={size} />,
      wikipedia: <WikipediaWidget skeletonArgs={args as WikipediaArguments} currentSize={size} />,
      mensa: <MensaWidget skeletonArgs={args as MensaArguments} currentSize={size} />,
      news: <NewsWidget skeletonArgs={args as NewsArguments} currentSize={size} />,
      time: <TimeAndDateWidget skeletonArgs={args as TimeAndDateArguments} currentSize={size} />,
      pollen: <PollenWidget skeletonArgs={args as PollenArguments} currentSize={size} />,
      adaptiveCard: <AdaptiveCardsWidget skeletonArgs={args as AdaptiveCardsArguments} currentSize={size} />,
      publicTransport: <PublicTransportWidget skeletonArgs={args as PublicTransportArguments} currentSize={size} />,
      routing: <RoutingWidget skeletonArgs={args as RoutingArguments} currentSize={size} />,
    })[type]
