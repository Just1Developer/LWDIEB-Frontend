import { LocationPicker } from '@/components/location-picker'
import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Unit } from '@/lib/argument-types'
import React from 'react'
import { WeatherEditWidgetProps } from './widget'

import { ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MapInsert } from '@/features/widget/weather/edit/details1'

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
  {
    value: 8,
    label: '8 Days',
  },
  {
    value: 9,
    label: '9 Days',
  },
  {
    value: 10,
    label: '10 Days',
  },
  {
    value: 11,
    label: '11 Days',
  },
  {
    value: 12,
    label: '12 Days',
  },
  {
    value: 13,
    label: '13 Days',
  },
  {
    value: 14,
    label: '14 Days',
  },
]

export const WeatherWidgetDetail3 = ({ args, updateFn, setDialog, currentSize }: WeatherEditWidgetProps) => {
  const { latitude, longitude, unit, forecastDays } = args

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
    <div className="flex h-full w-full flex-col flex-wrap items-center gap-1">
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

      <div className="mb-4">
        <label className="block justify-self-center text-sm font-medium">Select Amount of Days to Display:</label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
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
                  {days.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value.toString()}
                      onSelect={(currentValue) => {
                        updateFn({ args: { ...args, forecastDays: parseInt(currentValue) } })
                        setValue(parseInt(currentValue))
                        setOpen(false)
                      }}
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
