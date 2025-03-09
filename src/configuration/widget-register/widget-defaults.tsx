import { AdaptiveCardsEditWidget, DefaultAdaptiveCardsArgumentValues } from '@/features/widget/adaptive-cards/edit/widget'
import { DefaultWikipediaArgumentValues, WikipediaEditWidget } from '@/features/widget/article-of-the-day/edit/widget'
import { DefaultExampleArgumentValues, ExampleEditWidget } from '@/features/widget/example/edit/widget'
import { DefaultMensaArgumentValues, MensaEditWidget } from '@/features/widget/mensa/edit/widget'
import { DefaultNewsArgumentValues, NewsEditWidget } from '@/features/widget/news/edit/widget'
import { DefaultPollenArgumentValues, PollenEditWidget } from '@/features/widget/pollen/edit/widget'
import { DefaultPublicTransportArgumentValues, PublicTransportEditWidget } from '@/features/widget/public-transport/edit/widget'
import { DefaultRoutingArgumentValues, RoutingEditWidget } from '@/features/widget/routing/edit/widget'
import { DefaultTimeAndDateArgumentValues, TimeAndDateEditWidget } from '@/features/widget/time-and-date/edit/widget'
import { DefaultWeatherArgumentValues, WeatherEditWidget } from '@/features/widget/weather/edit/widget'

export const DefaultEditWidgetFactoryRegister = ({ widgetType }: { widgetType: string }) =>
  ({
    example: {
      components: ExampleEditWidget(),
      args: DefaultExampleArgumentValues,
    },
    weather: {
      components: WeatherEditWidget(),
      args: DefaultWeatherArgumentValues,
    },
    wikipedia: {
      components: WikipediaEditWidget(),
      args: DefaultWikipediaArgumentValues,
    },
    mensa: {
      components: MensaEditWidget(),
      args: DefaultMensaArgumentValues,
    },
    news: {
      components: NewsEditWidget(),
      args: DefaultNewsArgumentValues,
    },
    time: {
      components: TimeAndDateEditWidget(),
      args: DefaultTimeAndDateArgumentValues,
    },
    pollen: {
      components: PollenEditWidget(),
      args: DefaultPollenArgumentValues,
    },
    adaptiveCard: {
      components: AdaptiveCardsEditWidget(),
      args: DefaultAdaptiveCardsArgumentValues,
    },
    publicTransport: {
      components: PublicTransportEditWidget(),
      args: DefaultPublicTransportArgumentValues,
    },
    routing: {
      components: RoutingEditWidget(),
      args: DefaultRoutingArgumentValues,
    },
  })[widgetType]
