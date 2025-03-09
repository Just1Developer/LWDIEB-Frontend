import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateScalingFactorPercent, DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { cn } from '@/lib/utils'
import { Size } from '@/lib/widget-types'
import { useQuery } from '@tanstack/react-query'
import { WeatherWidgetProps } from './widget'

export const weatherIcons = [
  {
    weatherCode: 0,
    day: {
      description: 'Sunny',
      image: 'http://openweathermap.org/img/wn/01d@2x.png',
    },
    night: {
      description: 'Clear',
      image: 'http://openweathermap.org/img/wn/01n@2x.png',
    },
  },
  {
    weatherCode: 1,
    day: {
      description: 'Mainly Sunny',
      image: 'http://openweathermap.org/img/wn/01d@2x.png',
    },
    night: {
      description: 'Mainly Clear',
      image: 'http://openweathermap.org/img/wn/01n@2x.png',
    },
  },
  {
    weatherCode: 2,
    day: {
      description: 'Partly Cloudy',
      image: 'http://openweathermap.org/img/wn/02d@2x.png',
    },
    night: {
      description: 'Partly Cloudy',
      image: 'http://openweathermap.org/img/wn/02n@2x.png',
    },
  },
  {
    weatherCode: 3,
    day: {
      description: 'Cloudy',
      image: 'http://openweathermap.org/img/wn/03d@2x.png',
    },
    night: {
      description: 'Cloudy',
      image: 'http://openweathermap.org/img/wn/03n@2x.png',
    },
  },
  {
    weatherCode: 45,
    day: {
      description: 'Foggy',
      image: 'http://openweathermap.org/img/wn/50d@2x.png',
    },
    night: {
      description: 'Foggy',
      image: 'http://openweathermap.org/img/wn/50n@2x.png',
    },
  },
  {
    weatherCode: 48,
    day: {
      description: 'Rime Fog',
      image: 'http://openweathermap.org/img/wn/50d@2x.png',
    },
    night: {
      description: 'Rime Fog',
      image: 'http://openweathermap.org/img/wn/50n@2x.png',
    },
  },
  {
    weatherCode: 51,
    day: {
      description: 'Light Drizzle',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Light Drizzle',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 53,
    day: {
      description: 'Drizzle',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Drizzle',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 55,
    day: {
      description: 'Heavy Drizzle',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Heavy Drizzle',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 56,
    day: {
      description: 'Light Freezing Drizzle',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Light Freezing Drizzle',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 57,
    day: {
      description: 'Freezing Drizzle',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Freezing Drizzle',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 61,
    day: {
      description: 'Light Rain',
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      description: 'Light Rain',
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  {
    weatherCode: 63,
    day: {
      description: 'Rain',
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      description: 'Rain',
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  {
    weatherCode: 65,
    day: {
      description: 'Heavy Rain',
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      description: 'Heavy Rain',
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  {
    weatherCode: 66,
    day: {
      description: 'Light Freezing Rain',
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      description: 'Light Freezing Rain',
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  {
    weatherCode: 67,
    day: {
      description: 'Freezing Rain',
      image: 'http://openweathermap.org/img/wn/10d@2x.png',
    },
    night: {
      description: 'Freezing Rain',
      image: 'http://openweathermap.org/img/wn/10n@2x.png',
    },
  },
  {
    weatherCode: 71,
    day: {
      description: 'Light Snow',
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      description: 'Light Snow',
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  {
    weatherCode: 73,
    day: {
      description: 'Snow',
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      description: 'Snow',
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  {
    weatherCode: 75,
    day: {
      description: 'Heavy Snow',
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      description: 'Heavy Snow',
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  {
    weatherCode: 77,
    day: {
      description: 'Snow Grains',
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      description: 'Snow Grains',
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  {
    weatherCode: 80,
    day: {
      description: 'Light Showers',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Light Showers',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 81,
    day: {
      description: 'Showers',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Showers',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 82,
    day: {
      description: 'Heavy Showers',
      image: 'http://openweathermap.org/img/wn/09d@2x.png',
    },
    night: {
      description: 'Heavy Showers',
      image: 'http://openweathermap.org/img/wn/09n@2x.png',
    },
  },
  {
    weatherCode: 85,
    day: {
      description: 'Light Snow Showers',
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      description: 'Light Snow Showers',
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  {
    weatherCode: 86,
    day: {
      description: 'Snow Showers',
      image: 'http://openweathermap.org/img/wn/13d@2x.png',
    },
    night: {
      description: 'Snow Showers',
      image: 'http://openweathermap.org/img/wn/13n@2x.png',
    },
  },
  {
    weatherCode: 95,
    day: {
      description: 'Thunderstorm',
      image: 'http://openweathermap.org/img/wn/11d@2x.png',
    },
    night: {
      description: 'Thunderstorm',
      image: 'http://openweathermap.org/img/wn/11n@2x.png',
    },
  },
  {
    weatherCode: 96,
    day: {
      description: 'Light Thunderstorms With Hail',
      image: 'http://openweathermap.org/img/wn/11d@2x.png',
    },
    night: {
      description: 'Light Thunderstorms With Hail',
      image: 'http://openweathermap.org/img/wn/11n@2x.png',
    },
  },
  {
    weatherCode: 99,
    day: {
      description: 'Thunderstorm With Hail',
      image: 'http://openweathermap.org/img/wn/11d@2x.png',
    },
    night: {
      description: 'Thunderstorm With Hail',
      image: 'http://openweathermap.org/img/wn/11n@2x.png',
    },
  },
]

export const temperatureSymbol = {
  CELSIUS: '°C',
  FAHRENHEIT: '°F',
}

const _nativeSize: Size = {
  width: 2,
  height: 2,
}

export const getWeatherIcon = (weatherCode: number) =>
  weatherIcons.find((icon) => icon.weatherCode === weatherCode)?.day ?? { description: '', image: '' }

export const WeatherWidgetDetail1 = ({ args, nativeSizeOverride }: WeatherWidgetProps) => {
  const { data, dataFetchArgs, currentSize } = args
  const { today } = data
  const { unit, latitude, longitude } = dataFetchArgs
  const { currentTemperature, minTemperature, maxTemperature, weatherCode, time } = today
  const { theme } = useUserData()
  const nativeSize = nativeSizeOverride ?? _nativeSize

  const { data: placeName } = useQuery({
    queryKey: ['place', latitude, longitude],
    queryFn: async () =>
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then((response) => response.json())
        .then((data) => data.address.city || data.address.town || data.address.village),
    staleTime: 13600000,
  })

  const title = `Weather${placeName && placeName.length > 0 ? ` in ${placeName}` : ''} Today`
  const { image, description } = getWeatherIcon(weatherCode)
  const degrees = temperatureSymbol[unit]

  const SideTempDisplay = ({ title, temp }: { title: string; temp: number }) => {
    return (
      <div
        className="flex flex-col items-center space-y-[7%] rounded-lg p-[2%]"
        style={{ backgroundColor: rgba(theme.foregroundText, 0.07) }}
      >
        <div className="text-[72%]">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {title}
          </DynamicTextsize>
        </div>
        <div className="text-[101%] font-semibold">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {temp}
            {degrees}
          </DynamicTextsize>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full max-h-full w-full flex-grow flex-col flex-nowrap items-center justify-between overflow-hidden whitespace-nowrap text-nowrap text-center">
      <div className="text-wrap text-[100%] font-semibold">
        <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
          {title}
        </DynamicTextsize>
      </div>
      <div className="flex scale-[1.1] flex-row items-center justify-center">
        <img
          src={image}
          alt={description}
          className={cn('scale-[0.7]', 'translate-x-[2%] object-contain')}
          style={{
            width: `${calculateScalingFactorPercent({ currentSize, nativeSize })}%`,
            height: `${calculateScalingFactorPercent({ currentSize, nativeSize })}%`,
          }}
        />
        <div className={cn('flex flex-col items-start space-y-[1%]', '-translate-x-[19%]')}>
          <span className="text-[85%] font-semibold">
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              {description}
            </DynamicTextsize>
          </span>
          <span className="text-[70%] text-zinc-400">
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              {new Date(time).toLocaleDateString('en-UK')}
            </DynamicTextsize>
          </span>
        </div>
      </div>
      {nativeSizeOverride ? (
        <div className="flex w-full flex-row justify-center gap-[3%] px-10">
          <SideTempDisplay title={'Lowest Temp.'} temp={minTemperature} />
          <div
            className="flex flex-col items-center rounded-lg border p-[2%]"
            style={{ backgroundColor: rgba(theme.foregroundText, 0.1), borderColor: rgba(theme.accentForeground, 0.3) }}
          >
            <div className="text-[75%]">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                Current Temperature
              </DynamicTextsize>
            </div>
            <div className="text-[105%] font-semibold">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                {currentTemperature}
                {degrees}
              </DynamicTextsize>
            </div>
          </div>
          <SideTempDisplay title={'Highest Temp.'} temp={maxTemperature} />
        </div>
      ) : (
        <div className="pt-0">
          <div
            className="flex flex-col items-center rounded-lg border p-2 px-[2%]"
            style={{ backgroundColor: rgba(theme.foregroundText, 0.1), borderColor: rgba(theme.accentForeground, 0.3) }}
          >
            <div className="text-[75%]">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                Current Temperature
              </DynamicTextsize>
            </div>
            <div className="text-[105%] font-semibold">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                {currentTemperature}
                {degrees}
              </DynamicTextsize>
            </div>
          </div>
          <div className="flex w-full flex-row justify-center gap-[5%] px-10 pt-[1.5%] text-[90%]">
            <SideTempDisplay title={'Lowest Temp.'} temp={minTemperature} />
            <SideTempDisplay title={'Highest Temp.'} temp={maxTemperature} />
          </div>
        </div>
      )}
    </div>
  )
}

export const WeatherWidgetDetail1Loading = () => {
  return (
    <div className="flex h-full w-full flex-col flex-nowrap items-center justify-center gap-1">
      <div>
        <h2 className="mb-2 text-lg font-bold">Weather Today</h2>
        <div className="mb-2 flex items-center">
          <Skeleton className="mr-2 h-12 w-12 md:mr-4 md:h-16 md:w-16" />
          <div>
            <Skeleton className="mb-1 h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-nowrap items-center justify-center gap-6">
        <div>
          <Badge variant="default">
            <div className="flex flex-col flex-nowrap items-center justify-center">
              <div className="text-center text-sm font-semibold"> Current Temperature:</div>
              <div className="text-lg font-bold text-accent-foreground">Loading</div>
            </div>
          </Badge>
        </div>
        <div className="flex flex-row flex-nowrap items-center justify-center gap-6 text-center">
          <div>
            <Skeleton className="mb-1 h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div>
            <Skeleton className="mb-1 h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
