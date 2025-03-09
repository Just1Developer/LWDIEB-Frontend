import { AdaptiveCardsWidgetPreview } from '@/features/widget/adaptive-cards/edit/preview'
import { WikipediaWidgetPreviewAlternative } from '@/features/widget/article-of-the-day/edit/preview'
import { MensaWidgetPreview } from '@/features/widget/mensa/edit/preview'
import { NewsWidgetPreview } from '@/features/widget/news/edit/preview'
import { PollenWidgetPreview } from '@/features/widget/pollen/edit/preview'
import { PublicTransportWidgetPreview } from '@/features/widget/public-transport/edit/preview'
import { RoutingWidgetPreview } from '@/features/widget/routing/edit/preview'
import { TimeAndDateWidgetPreview } from '@/features/widget/time-and-date/edit/preview'
import { WeatherWidgetPreview } from '@/features/widget/weather/edit/preview'
import { WidgetPreview } from '@/lib/widget-types'

export const widgetPreviews: WidgetPreview[] = [
  {
    component: <TimeAndDateWidgetPreview />,
    widgetType: 'time',
    widgetName: 'Time and Date',
  },
  {
    component: <WikipediaWidgetPreviewAlternative />,
    widgetType: 'wikipedia',
    widgetName: 'Wikipedia Article of the Day',
  },
  {
    component: <NewsWidgetPreview />,
    widgetType: 'news',
    widgetName: 'News',
  },
  {
    component: <WeatherWidgetPreview />,
    widgetType: 'weather',
    widgetName: 'Weather',
  },
  {
    component: <MensaWidgetPreview />,
    widgetType: 'mensa',
    widgetName: 'Mensa Lines',
  },
  {
    component: <PublicTransportWidgetPreview />,
    widgetType: 'publicTransport',
    widgetName: 'Public Transportation Overview',
  },
  {
    component: <AdaptiveCardsWidgetPreview />,
    widgetType: 'adaptiveCard',
    widgetName: 'Custom Widget: Adaptive Cards',
  },
  {
    component: <PollenWidgetPreview />,
    widgetType: 'pollen',
    widgetName: 'Pollen Overview',
  },
  {
    component: <RoutingWidgetPreview />,
    widgetType: 'routing',
    widgetName: 'Route Traffic Overview',
  },
]
