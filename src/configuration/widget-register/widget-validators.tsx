import { validateAdaptiveCardsArgumentValues } from '@/features/widget/adaptive-cards/edit/widget'
import { validateWikipediaArgumentValues } from '@/features/widget/article-of-the-day/edit/widget'
import { validateExampleArgumentValues } from '@/features/widget/example/edit/widget'
import { validateMensaArgumentValues } from '@/features/widget/mensa/edit/widget'
import { validateNewsArgumentValues } from '@/features/widget/news/edit/widget'
import { validatePublicTransportArgumentValues } from '@/features/widget/public-transport/edit/widget'
import { validateWeatherArgumentValues } from '@/features/widget/weather/edit/widget'
import {
  AdaptiveCardsArguments,
  ExampleArguments,
  MensaArguments,
  NewsArguments,
  PublicTransportArguments,
  WeatherArguments,
  WidgetSkeletonArguments,
  WikipediaArguments,
} from '@/lib/argument-types'
import { Size } from '@/lib/widget-types'

export const validateWidgetArguments = ({ type, args, size }: { type: string; args: WidgetSkeletonArguments; size: Size }): boolean => {
  switch (type) {
    // Add to the switch case here, and perform your custom validation function
    case 'example':
      return validateExampleArgumentValues({ args: args as ExampleArguments })
    case 'weather':
      return validateWeatherArgumentValues({ args: args as WeatherArguments, size })
    case 'wikipedia':
      return validateWikipediaArgumentValues({ args: args as WikipediaArguments })
    case 'mensa':
      return validateMensaArgumentValues({ args: args as MensaArguments })
    case 'time':
      return true
    case 'news':
      return validateNewsArgumentValues({ args: args as NewsArguments })
    case 'publicTransport':
      return validatePublicTransportArgumentValues({ args: args as PublicTransportArguments })
    case 'adaptiveCard':
      return validateAdaptiveCardsArgumentValues({ args: args as AdaptiveCardsArguments })
    case 'pollen':
      return true
    case 'routing':
      return true
    default:
      return false
  }
}
