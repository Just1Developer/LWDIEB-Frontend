import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { NativeRenderAdaptiveCard } from '@/features/dashboard/adaptive-card-renderer'
import { CommonViewWidgetProps } from '@/features/dashboard/formless-widget'
import { AdaptiveCardsWidgetProps } from '@/features/widget/adaptive-cards/view/widget'
import { AdaptiveCardsArguments } from '@/lib/argument-types'

export const AdaptiveCardsWidgetDetail = ({ args }: AdaptiveCardsWidgetProps) => {
  let card: JSON
  let data: JSON | undefined
  const { adaptiveCard, adaptiveCardData } = args.dataFetchArgs

  try {
    card = JSON.parse(adaptiveCard)
    data = adaptiveCardData && adaptiveCardData.length > 2 ? JSON.parse(adaptiveCardData) : undefined // Don't accept {}
  } catch (_) {
    return <Badge className="round-full bg-red-600/80">There was an error reading the adaptive card</Badge>
  }

  return <NativeRenderAdaptiveCard card={card} data={data} />
}

export const AdaptiveCardsDetailLoading = ({}: { args: AdaptiveCardsArguments; commons: CommonViewWidgetProps }) => {
  return (
    <div>
      <Skeleton className="h-8 w-16 rounded-full" />
      <Skeleton className="h-6 w-40 rounded-full" />
      <Skeleton className="h-6 w-56 rounded-full" />
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="m-5 h-full w-full rounded-full" />
    </div>
  )
}
