import { CommonViewWidgetProps } from '@/features/dashboard/formless-widget'

export interface WidgetArguments<TArgs extends WidgetSkeletonArguments, TData extends WidgetDataArguments> extends CommonViewWidgetProps {
  dataFetchArgs: TArgs
  data: TData
}

export interface WidgetSkeletonArguments {
  levelOfDetail: number
}

export interface WikipediaArguments extends WidgetSkeletonArguments {
  language: string
}

export interface ExampleArguments extends WidgetSkeletonArguments {
  longitude: number
  latitude: number
}

export interface WeatherArguments extends WidgetSkeletonArguments {
  unit: Unit
  forecastDays: number
  latitude: number
  longitude: number
}

export interface MensaArguments extends WidgetSkeletonArguments {
  canteenType: string
  lineId: string
  priceType: string
}

export interface NewsArguments extends WidgetSkeletonArguments {
  sourceLink: string
}

export interface TimeAndDateArguments extends WidgetSkeletonArguments {
  timeFormat: TimeFormat
}

export interface PublicTransportArguments extends WidgetSkeletonArguments {
  latitude: number
  longitude: number
  selectedStation: Station
  availableStations: Station[]
  maxDepartures: number
  transportType: TransportType[]
  showPlatform: boolean
}

export interface AdaptiveCardsArguments extends WidgetSkeletonArguments {
  adaptiveCard: string
  adaptiveCardData: string
}

export interface PollenArguments extends WidgetSkeletonArguments {
  region: string
  pollenTypes: PollenType[]
}

export interface RoutingArguments extends WidgetSkeletonArguments {
  origin: LocationData
  destination: LocationData
}

// --------- Data Argument Types ---------

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WidgetDataArguments {
  // Type needs to extend this
}

export interface WikipediaDataArguments extends WidgetDataArguments {
  title: string
  url: string
  extract: string
  image: string
}

export interface ExampleDataArguments extends WidgetDataArguments {
  weather: string
}

export interface WeatherDataArguments extends WidgetDataArguments {
  today: WeatherToday
  future: WeatherDaily[]
}

export interface MensaDataArguments extends WidgetDataArguments {
  id: string
  name: string
  meals: MealData[]
}

export interface NewsDataArguments extends WidgetDataArguments {
  sourceName: string
  sourceUrl: string
  description: NewsDescription[]
  iconUrl: string
}

export interface PollenDataArguments extends WidgetDataArguments {
  regionName: string
  pollenDataList: PollenData[]
}

export interface PublicTransportDataArguments extends WidgetDataArguments {
  stopPointName: string
  stopPointRef: string
  timeTable: TimeTable
}

export interface RoutingDataArguments extends WidgetDataArguments {
  lengthInMeters: number
  travelTimeInSeconds: number
  travelTimeWithTrafficInSeconds: number
  points: LocationData[]
}

// --------- Data Helper-Argument Types ---------

export interface WeatherToday {
  time: string
  weatherCode: number
  minTemperature: number
  maxTemperature: number
  currentTemperature: number
}

export interface WeatherDaily {
  time: string
  weatherCode: number
  minTemperature: number
  maxTemperature: number
}

export enum Unit {
  CELSIUS = 'CELSIUS',
  FAHRENHEIT = 'FAHRENHEIT',
}

export interface NewsDescription {
  title: string
  url: string
  description: string
}

export enum PollenType {
  /** Pollen type: Ambrosia. */
  AMBROSIA = 'AMBROSIA',
  /** Pollen type: Mugwort (german: Beifuss). */
  MUGWORT = 'MUGWORT',
  /** Pollen type: Birch (german: Birke). */
  BIRCH = 'BIRCH',
  /** Pollen type: Alder (german: Erle). */
  ALDER = 'ALDER',
  /** Pollen type: Ash (german: Esche). */
  ASH = 'ASH',
  /** Pollen type: Grass (german: Graeser). */
  GRASS = 'GRASS',
  /** Pollen type: Hazel (german: Hasel). */
  HAZEL = 'HAZEL',
  /** Pollen type: Rye (german: Roggen). */
  RYE = 'RYE',
}

export interface PollenData {
  pollenType: string
  exposureToday: string
  exposureTomorrow: string
  exposureDayAfterTomorrow: string
}

export interface LineData {
  id: string
  name: string
}

export interface Station {
  stopPointName: string
  stopPointRef: string
}

export interface MealData {
  name: string
  price: number
  rating: number
  mealType: string
}

export interface TimeTable {
  departures: VehicleStopData[]
}

export interface VehicleStopData {
  name: string
  dest: string
  platform: string
  planTime: string
  estTime: string
}

export enum TransportType {
  BUS = 'BUS',
  TRAIN = 'TRAIN',
  OTHER = 'OTHER',
}

export enum TimeFormat {
  MINUTES = 'minutes',
  SECONDS = 'seconds',
}

export interface StationAnswer {
  stations: Station[]
}

export interface LocationData {
  longitude: number
  latitude: number
}
