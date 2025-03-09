import {
  CommonEditWidgetProps,
  FormlessEditableComponent,
  FormlessEditableWidget,
  toEditableComponent,
} from '@/features/edit-dashboard/formless-editable-widget'
import { PublicTransportWidgetDetail } from '@/features/widget/public-transport/edit/details'
import { PublicTransportArguments, Station, TransportType } from '@/lib/argument-types'
import { EditableComponent } from '@/lib/widget-types'

export interface PublicTransportEditWidgetProps extends CommonEditWidgetProps {
  args: PublicTransportArguments
  updateFn: ({ args }: { args: PublicTransportArguments }) => void
}

const station: Station = {
  stopPointName: 'Karlsruhe, Durlacher Tor/KIT-Campus Süd',
  stopPointRef: 'de:08212:3',
}

export const DefaultPublicTransportArgumentValues: PublicTransportArguments = {
  levelOfDetail: 0,
  latitude: 49.01208,
  longitude: 8.415424,
  maxDepartures: 9,
  selectedStation: station,
  transportType: [TransportType.BUS, TransportType.TRAIN, TransportType.OTHER],
  showPlatform: false,
  availableStations: [
    { stopPointName: 'Karlsruhe, Studentenhaus', stopPointRef: 'de:08212:3002' },
    { stopPointName: 'Karlsruhe, Durlacher Tor/KIT-Campus Süd', stopPointRef: 'de:08212:3' },
    { stopPointName: 'Karlsruhe, Emil-Gött-Straße', stopPointRef: 'de:08212:3014' },
    { stopPointName: 'Karlsruhe, Durlacher Tor/KIT-Campus Süd (U)', stopPointRef: 'de:08212:1001' },
  ],
}

export const PublicTransportEditWidget = (): EditableComponent[] => {
  const LevelOfDetails: FormlessEditableComponent<PublicTransportArguments>[] = [
    {
      component: PublicTransportWidgetDetail,
      minimumSize: {
        name: 'Planned departure time + delay',
        width: 4,
        height: 5,
      },
    },
    {
      component: PublicTransportWidgetDetail,
      minimumSize: {
        name: 'Estimated departure time',
        width: 4,
        height: 5,
      },
    },
  ]

  return LevelOfDetails.map(
    ({ component, minimumSize }): EditableComponent =>
      toEditableComponent({
        result: FormlessEditableWidget({
          LevelOfDetail: component,
        }),
        minimumSize: minimumSize,
      }),
  )
}

export const validatePublicTransportArgumentValues = ({ args }: { args: PublicTransportArguments }): boolean => {
  return args.selectedStation && args.selectedStation.stopPointName.length > 0 && args.selectedStation.stopPointName.length > 0
}
