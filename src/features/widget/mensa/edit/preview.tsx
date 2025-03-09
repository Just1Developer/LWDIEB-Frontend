import { MensaWidgetDetail } from '@/features/widget/mensa/view/details'

const data = {
  id: '42',
  name: '[kœri]werk',
  meals: [
    {
      mealType: 'BEEF',
      name: 'Reine Kalbsbratwurst mit Currysoße',
      price: 3.2,
      rating: 4,
    },
    {
      mealType: 'VEGAN',
      name: 'Vegane Wurst',
      price: 2.3,
      rating: 3,
    },
    {
      mealType: 'VEGAN',
      name: 'Pommes',
      price: 1.5,
      rating: 5,
    },
  ],
}

const dataFetchArgs = {
  levelOfDetail: 0,
  canteenType: 'koeri',
  lineId: '42',
  priceType: '€',
}

export const MensaWidgetPreview = () => {
  const View = MensaWidgetDetail({ showPrices: true, showIndividualStars: false })
  return <View args={{ data, dataFetchArgs, currentSize: { width: 2, height: 2 } }} />
}
