import { PollenWidgetView } from '@/features/widget/pollen/view/view'
import { PollenArguments, PollenData, PollenDataArguments, PollenType } from '@/lib/argument-types'

const pollenDataBirch: PollenData = {
  pollenType: 'Birke',
  exposureToday: '0',
  exposureTomorrow: '1',
  exposureDayAfterTomorrow: '2',
}
const pollenDataHazel: PollenData = {
  pollenType: 'Hasel',
  exposureToday: '1',
  exposureTomorrow: '2',
  exposureDayAfterTomorrow: '0',
}
const pollenDataGrass: PollenData = {
  pollenType: 'Graeser',
  exposureToday: '1',
  exposureTomorrow: '0',
  exposureDayAfterTomorrow: '0',
}

const data: PollenDataArguments = {
  pollenDataList: [pollenDataBirch, pollenDataHazel, pollenDataGrass],
  regionName: 'PREVIEW',
}

const dataFetchArgs: PollenArguments = {
  levelOfDetail: 0,
  pollenTypes: [PollenType.BIRCH, PollenType.HAZEL, PollenType.GRASS],
  region: 'PREVIEW',
}

export const PollenWidgetPreview = () => {
  const View = PollenWidgetView({ days: 2 })
  // We need padding, since this is handled by the widget container, which we do not apply here
  return (
    <div className="h-full w-full overflow-hidden p-3">
      <View args={{ dataFetchArgs, data, currentSize: { width: 1.1, height: 1.1 } }} />
    </div>
  )
}
