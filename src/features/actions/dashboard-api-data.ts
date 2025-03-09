'use server'

import { axiosInstance } from '@/configuration/axios-config'
import {
  ExampleArguments,
  ExampleDataArguments,
  LineData,
  MensaArguments,
  MensaDataArguments,
  NewsArguments,
  NewsDataArguments,
  PollenArguments,
  PollenDataArguments,
  PublicTransportArguments,
  PublicTransportDataArguments,
  RoutingArguments,
  RoutingDataArguments,
  StationAnswer,
  TransportType,
  WeatherArguments,
  WeatherDataArguments,
  WikipediaArguments,
  WikipediaDataArguments,
} from '@/lib/argument-types'

// ----------------------------- Data Fetch Server Actions -----------------------------

export const getExampleWidgetData = async ({ args }: { args: ExampleArguments }): Promise<ExampleDataArguments> => {
  await delay(2000)
  return {
    weather: `Weather @ ${args.latitude} and ${args.longitude}`,
  }
}

export const getWikipediaWidgetData = async ({ args }: { args: WikipediaArguments }): Promise<WikipediaDataArguments> => {
  try {
    const response = await axiosInstance.get<WikipediaDataArguments>('api/widgets/article-of-the-day', { params: args })
    return response.data
  } catch (error) {
    return {
      title: 'Error fetching data',
      extract: 'Error fetching data',
      url: '',
      image: '',
    }
  }
}

export const getWeatherWidgetData = async ({ args }: { args: WeatherArguments }): Promise<WeatherDataArguments> => {
  try {
    const response = await axiosInstance.get<WeatherDataArguments>('/api/widgets/weather', {
      params: { ...args, forecastDays: args.levelOfDetail === 0 ? 1 : args.forecastDays + 1 },
    })
    return response.data
  } catch (error) {
    return {
      today: { time: 'Error fetching data 😥', weatherCode: 0, minTemperature: 0, maxTemperature: 0, currentTemperature: 0 },
      future: [],
    }
  }
}
export const getMensaWidgetData = async ({ args }: { args: MensaArguments }): Promise<MensaDataArguments> => {
  try {
    const response = await axiosInstance.get<MensaDataArguments>('api/widgets/mensa', { params: args })
    return response.data
  } catch (error) {
    return { id: 'Error fetching data 😥', name: 'Error fetching data 😥', meals: [] }
  }
}

export const getMensaLines = async ({ canteenType }: { canteenType: string }): Promise<LineData[]> => {
  try {
    const response = await axiosInstance.get<LineData[]>('/api/widgets/mensa-lines', { params: { canteenType } })
    return response.data
  } catch (error) {
    return [] as LineData[]
  }
}

export const getNewsWidgetData = async ({ args }: { args: NewsArguments }): Promise<NewsDataArguments> => {
  try {
    const response = await axiosInstance.get<NewsDataArguments>('/api/widgets/news', { params: args })
    return response.data
  } catch (error) {
    return { sourceName: 'Error fetching data', sourceUrl: '', description: [], iconUrl: '' }
  }
}

export const getPollenWidgetData = async ({ args }: { args: PollenArguments }): Promise<PollenDataArguments> => {
  try {
    const response = await axiosInstance.get<PollenDataArguments>('/api/widgets/pollen', {
      params: {
        region: encodeURIComponent(args.region.toString()),
        pollenTypes: args.pollenTypes.map(encodeURIComponent).join(','),
      },
    })
    return {
      regionName: response.data.regionName,
      pollenDataList: response.data.pollenDataList,
    }
  } catch (error) {
    return { regionName: 'Error fetching data', pollenDataList: [] }
  }
}

export const getPublicTransportWidgetData = async ({ args }: { args: PublicTransportArguments }): Promise<PublicTransportDataArguments> => {
  try {
    const response = await axiosInstance.get<PublicTransportDataArguments>(
      `/api/widgets/publictransport/${args.selectedStation.stopPointName.split('/')[0]}`,
      {
        params: {
          stopPointName: args.selectedStation.stopPointName,
          stopPointRef: args.selectedStation.stopPointRef,
          maxDepartures: args.maxDepartures * 5,
          transportType: Object.values(TransportType).map(encodeURIComponent).join(','), // Encode and join array
        },
      },
    )

    return {
      stopPointName: response.data.stopPointName,
      stopPointRef: response.data.stopPointRef,
      timeTable: response.data.timeTable,
    }
  } catch (error) {
    return { stopPointName: 'Error fetching data', stopPointRef: '', timeTable: { departures: [] } }
  }
}

export const getStations = async ({
  latitude,
  longitude,
  maxStations,
}: {
  latitude: number
  longitude: number
  maxStations: number
}): Promise<{ stations: StationAnswer }> => {
  try {
    const response = await axiosInstance.get<StationAnswer>('/api/widgets/publictransport', {
      params: { latitude, longitude, maxStations },
    })
    return { stations: response.data }
  } catch (error) {
    return { stations: { stations: [] } }
  }
}

export const getRoutingWidgetData = async ({ args }: { args: RoutingArguments }): Promise<RoutingDataArguments> => {
  try {
    const response = await axiosInstance.get<RoutingDataArguments>('/api/widgets/routing', {
      params: {
        originLat: args.origin.latitude,
        originLon: args.origin.longitude,
        destinationLat: args.destination.latitude,
        destinationLon: args.destination.longitude,
      },
    })

    return {
      lengthInMeters: response.data.lengthInMeters,
      travelTimeInSeconds: response.data.travelTimeInSeconds,
      travelTimeWithTrafficInSeconds: response.data.travelTimeWithTrafficInSeconds,
      points: response.data.points,
    }
  } catch (error) {
    return { lengthInMeters: -1, travelTimeInSeconds: -1, travelTimeWithTrafficInSeconds: -1, points: [] }
  }
}
// ----------------------------- Additional Helper Functions -----------------------------

// By GPT, delete later
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))
