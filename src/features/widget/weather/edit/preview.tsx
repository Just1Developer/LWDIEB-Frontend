import { Badge } from '@/components/ui/badge'

export const WeatherWidgetPreview = () => (
  <div className="flex h-full w-full flex-col flex-nowrap items-center justify-center gap-1">
    <div>
      {/*first row*/}
      <div className="text-xs font-bold">Weather Today</div>
      <div className="flex items-center">
        <img src={'http://openweathermap.org/img/wn/01d@2x.png'} alt={'Sunny'} className="h-8 w-8" />
        <div className="text-xs">
          Sunny <br />
          {new Date().toLocaleDateString('en-UK')}
        </div>
      </div>
    </div>
    {/*second row*/}
    <div className="flex flex-col flex-nowrap items-center justify-center gap-0">
      <div>
        <Badge variant="default">
          <div className="flex flex-col flex-nowrap items-center justify-center">
            <div className="text-center text-xs font-semibold"> Current Temperature:</div>
            <div className="text-xs font-bold">30°C</div>
          </div>
        </Badge>
      </div>
    </div>
  </div>
)
