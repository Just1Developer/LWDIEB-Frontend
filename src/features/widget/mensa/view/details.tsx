import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { MensaWidgetProps } from '@/features/widget/mensa/view/widget'
import { rgba } from '@/lib/theme-helpers'
import { Size } from '@/lib/widget-types'
import { Star } from 'lucide-react'

export const mealTypeIcons: Record<string, string> = {
  VEGAN: 'https://www.sw-ka.de/layout/icons/veganes-gericht.svg',
  VEGETARIAN: 'https://www.sw-ka.de/layout/icons/vegetarisches-gericht.svg',
  BEEF: 'https://www.sw-ka.de/layout/icons/rindfleisch.svg',
  BEEF_AW: 'https://www.sw-ka.de/layout/icons/regionales-rindfleisch.svg',
  PORK: 'https://www.sw-ka.de/layout/icons/schweinefleisch.svg',
  PORK_AW: 'https://www.sw-ka.de/layout/icons/regionales-schweinefleisch.svg',
  FISH: 'https://www.sw-ka.de/layout/icons/msc.svg',
  POULTRY: 'https://www.sw-ka.de/layout/icons/gefluegel.svg',
  UNKNOWN: 'https://placehold.co/25x28',
  undefined: 'https://placehold.co/25x28',
}

const nativeSize: Size = {
  width: 4,
  height: 4,
}

const MINIMUM_MENSA_ROWS = 3

export const MensaWidgetDetail =
  ({ showPrices, showIndividualStars }: { showPrices: boolean; showIndividualStars: boolean }) =>
  ({ args }: MensaWidgetProps) => {
    const { data, currentSize } = args
    const { meals, name } = data
    const { theme } = useUserData()

    const actingMealSize = Math.max(MINIMUM_MENSA_ROWS, meals?.length ?? 3)
    const starSize = Math.round((15 * (currentSize.width + currentSize.height)) / (2 * actingMealSize) + 1)

    const Card = ({ image, name, price, rating }: { image: string | undefined; name: string; price: number; rating: number }) => (
      <div className="flex h-full w-full items-center justify-between pl-3 pr-3">
        <div className="flex flex-row items-center text-[110%]">
          <img src={image} alt={name} className="aspect-square object-contain pr-3" style={{ width: '14%', height: '14%' }} /* or 13% */ />
          <div className="pr-3">
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              {name}
            </DynamicTextsize>
          </div>
        </div>
        {showPrices && (
          <div className="flex-col items-end text-[120%]">
            <div className="font-bold">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                {price.toFixed(2)}€
              </DynamicTextsize>
            </div>
            <div className="flex items-center">
              {showIndividualStars ? (
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`star-${index}`}
                      size={starSize}
                      style={{
                        color: rgba(theme.foregroundText, index < Math.round(rating) ? 1 : 0.1),
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <Star size={starSize} className="mr-1" />
                  <span className="font-medium">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      {rating.toFixed(1)}/5
                    </DynamicTextsize>
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    )

    const AdaptiveDivs = () => (
      <div className="grid h-full w-full grid-cols-1 gap-2" style={{ gridTemplateRows: `repeat(${actingMealSize}, minmax(0, 1fr))` }}>
        {meals.map(({ mealType, name, price, rating }, index) => (
          <div
            key={`mensa-${name}-${mealType}-${index}`}
            className="col-span-1 row-span-1 w-full overflow-hidden rounded-lg sm:rounded-md md:rounded-lg lg:rounded-xl"
            style={{ backgroundColor: rgba(theme.accentForeground, 0.2) }}
          >
            <Card image={mealTypeIcons[mealType]} name={name} price={price} rating={rating}></Card>
          </div>
        ))}
      </div>
    )

    return (
      <div className="flex h-full w-full flex-col">
        <div className="line-clamp-2 pb-3 text-[180%] font-bold">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {name}
          </DynamicTextsize>
        </div>
        <div className="h-full">
          {!meals || meals.length === 0 ? (
            <div className="w-full">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                <Badge className="text-[90%]" variant="destructive">
                  There is no food on this line today 🙅
                </Badge>
              </DynamicTextsize>
            </div>
          ) : (
            <div className="h-full w-full p-1">
              <AdaptiveDivs />
            </div>
          )}
        </div>
      </div>
    )
  }

export const MensaWidgetDetailLoading = () => {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="h-8 w-10/12" />
      </div>
      <div className="flex flex-col gap-2">
        <div
          className="items-cente flex justify-between overflow-hidden rounded-lg pb-2"
          style={{ height: 'clamp(40px, 8vh, 160px)', fontSize: 'clamp(10px, 2vh, 16px)' }}
        >
          <Skeleton className="h-full w-full"></Skeleton>
        </div>
        <div
          className="items-cente flex justify-between overflow-hidden rounded-lg pb-2"
          style={{ height: 'clamp(40px, 8vh, 160px)', fontSize: 'clamp(10px, 2vh, 16px)' }}
        >
          <Skeleton className="h-full w-full"></Skeleton>
        </div>
      </div>
    </div>
  )
}
