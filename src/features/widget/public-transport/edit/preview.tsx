import { PublicTransportWidgetView } from '@/features/widget/public-transport/view/details'
import { TransportType } from '@/lib/argument-types'

const dataFetchArgs = {
  availableStations: [
    {
      stopPointName: 'Karlsruhe, Studentenhaus',
      stopPointRef: 'de:08212:3002',
    },
    {
      stopPointName: 'Karlsruhe, Durlacher Tor/KIT-Campus Süd',
      stopPointRef: 'de:08212:3',
    },
    {
      stopPointName: 'Karlsruhe, Emil-Gött-Straße',
      stopPointRef: 'de:08212:3014',
    },
    {
      stopPointName: 'Karlsruhe, Durlacher Tor/KIT-Campus Süd (U)',
      stopPointRef: 'de:08212:1001',
    },
  ],
  latitude: 49.01208,
  levelOfDetail: 0,
  longitude: 8.415424,
  maxDepartures: 9,
  selectedStation: {
    stopPointName: 'Karlsruhe, Durlacher Tor/KIT-Campus Süd',
    stopPointRef: 'de:08212:3',
  },
  showPlatform: true,
  transportType: [TransportType.TRAIN, TransportType.OTHER, TransportType.BUS],
}

const data = {
  stopPointName: 'Karlsruhe, Durlacher Tor',
  stopPointRef: 'de:08212:3',
  timeTable: {
    departures: [
      {
        dest: 'Durlach',
        estTime: '2025-02-23T03:49:36',
        name: '1',
        planTime: '2025-02-23T03:49:36',
        platform: 'Gleis 2 (U)',
      },
      {
        dest: 'Rheinbergstraße',
        estTime: '2025-02-23T03:53',
        name: 'S-Bahn S5',
        planTime: '2025-02-23T03:53',
        platform: 'Gleis 1 (U)',
      },
      {
        dest: 'Pforzheim Hbf',
        estTime: 'pue',
        name: 'S-Bahn S5',
        planTime: '2025-02-23T04:03',
        platform: 'Gleis 2 (U)',
      },
      {
        dest: 'Oberreut über Hbf',
        estTime: '2025-02-23T04:08:12',
        name: 'Nightliner NL2',
        planTime: '2025-02-23T04:08:12',
        platform: 'Gleis 1 (U)',
      },
    ],
  },
}

export const PublicTransportWidgetPreview = () => {
  const View = PublicTransportWidgetView('separateDelay')
  return <View args={{ dataFetchArgs, data, currentSize: { width: 1.8, height: 2 } }} />
}
