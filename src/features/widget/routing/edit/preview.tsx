import { RoutingWidgetPlannedArrival } from '@/features/widget/routing/view/planned-arrival'
import { LocationData, RoutingArguments, RoutingDataArguments } from '@/lib/argument-types'

const data: RoutingDataArguments = {
  travelTimeInSeconds: 717,
  travelTimeWithTrafficInSeconds: 848,
  lengthInMeters: 32103,
  points: [],
}

const destination: LocationData = {
  latitude: 49.090743,
  longitude: 8.42805,
}

const origin: LocationData = {
  latitude: 49.01208,
  longitude: 8.415424,
}

const dataFetchArgs: RoutingArguments = {
  levelOfDetail: 0,
  origin: origin,
  destination: destination,
}

export const RoutingWidgetPreview = () => (
  <RoutingWidgetPlannedArrival args={{ dataFetchArgs, data, currentSize: { width: 1.1, height: 1.1 } }} />
)
