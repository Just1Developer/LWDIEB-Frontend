import { AdaptiveCardsEditWidgetProps } from '@/features/widget/adaptive-cards/edit/widget'
import { AdaptiveCardsWidgetDetail } from '@/features/widget/adaptive-cards/view/details'

export const AdaptiveCardsWidgetDetailPreview = ({ args, currentSize }: AdaptiveCardsEditWidgetProps) => {
  return (
    <div className="pb-10">
      <AdaptiveCardsWidgetDetail args={{ dataFetchArgs: args, data: {}, currentSize }} />
    </div>
  )
}
