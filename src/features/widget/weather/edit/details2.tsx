import { LocationPicker } from '@/components/location-picker'
import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Unit } from '@/lib/argument-types'
import React from 'react'
import { shouldWeatherForecastDayBeEnabled, WeatherEditWidgetProps } from './widget'

import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MapInsert } from '@/features/widget/weather/edit/details1'
import { cn } from '@/lib/utils'

const days = [
  {
    value: 1,
    label: '1 Day',
  },
  {
    value: 2,
    label: '2 Days',
  },
  {
    value: 3,
    label: '3 Days',
  },
  {
    value: 4,
    label: '4 Days',
  },
  {
    value: 5,
    label: '5 Days',
  },
  {
    value: 6,
    label: '6 Days',
  },
  {
    value: 7,
    label: '7 Days',
  },
]

export const WeatherWidgetDetail2 = ({ args, updateFn, setDialog, currentSize }: WeatherEditWidgetProps) => {
  const { latitude, longitude, unit, forecastDays } = args
  const { width } = currentSize

  const shouldBeEnabled = (dayIndex: number) => shouldWeatherForecastDayBeEnabled({ dayIndex, width })

  const error = forecastDays > 7 || !shouldBeEnabled(forecastDays - 1)

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(forecastDays)

  const updateCoordsChange = ({ latitude, longitude }: LocationUpdateProps) => {
    try {
      const updatedArgs = {
        ...args,
        latitude: latitude,
        longitude: longitude,
      }
      updateFn({ args: updatedArgs })
    } catch (error) {
      return
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center gap-1">
      <MapInsert latitude={latitude} longitude={longitude} currentSize={currentSize} />
      <div className="mb-4">
        <label className="block justify-self-center text-sm font-medium">Pick Location:</label>
        <div className="justify-items-center">
          <LocationPicker onLocationPicked={updateCoordsChange} latitude={latitude} longitude={longitude} setDialog={setDialog} />
        </div>
      </div>
      <div className="mb-4">
        <label className="block justify-self-center text-sm font-medium">Select a Unit:</label>
        <Select value={unit} onValueChange={(value: Unit) => updateFn({ args: { ...args, unit: value } })} disabled={false}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={unit} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={Unit.CELSIUS}>Celsius</SelectItem>
              <SelectItem value={Unit.FAHRENHEIT}>Fahrenheit</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex flex-col items-center space-y-1">
        <label className="block justify-self-center text-sm font-medium">Select Amount of Days to Display:</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn('w-[200px] justify-between', error ? 'border border-red-500' : '')}
            >
              {value ? days.find((framework) => framework.value === value)?.label : 'Select Days...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {days.map((framework, index) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value.toString()}
                      onSelect={(currentValue) => {
                        updateFn({ args: { ...args, forecastDays: parseInt(currentValue) } })
                        setValue(parseInt(currentValue))
                        setOpen(false)
                      }}
                      disabled={!shouldBeEnabled(index)}
                    >
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
