import { AdaptiveCardsEditWidget } from '@/features/widget/adaptive-cards/edit/widget'
import { WikipediaEditWidget } from '@/features/widget/article-of-the-day/edit/widget'
import { ExampleEditWidget } from '@/features/widget/example/edit/widget'
import { MensaEditWidget } from '@/features/widget/mensa/edit/widget'
import { NewsEditWidget } from '@/features/widget/news/edit/widget'
import { PollenEditWidget } from '@/features/widget/pollen/edit/widget'
import { PublicTransportEditWidget } from '@/features/widget/public-transport/edit/widget'
import { RoutingEditWidget } from '@/features/widget/routing/edit/widget'
import { TimeAndDateEditWidget } from '@/features/widget/time-and-date/edit/widget'
import { WeatherEditWidget } from '@/features/widget/weather/edit/widget'

export const EditWidgetFactoryRegister = ({ type }: { type: string }) =>
  ({
    example: ExampleEditWidget(),
    wikipedia: WikipediaEditWidget(),
    weather: WeatherEditWidget(),
    mensa: MensaEditWidget(),
    news: NewsEditWidget(),
    time: TimeAndDateEditWidget(),
    pollen: PollenEditWidget(),
    adaptiveCard: AdaptiveCardsEditWidget(),
    publicTransport: PublicTransportEditWidget(),
    routing: RoutingEditWidget(),
  })[type]
