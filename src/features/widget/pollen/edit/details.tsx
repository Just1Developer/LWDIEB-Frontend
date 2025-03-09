import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { PollenArguments, PollenType } from '@/lib/argument-types'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { PollenEditWidgetProps } from './widget'

export const regions = [
  {
    value: 'ISLANDS_AND_MARSHES_OF_SH',
    label: 'Islands and marshlands of Schleswig-Holstein',
  },
  {
    value: 'SH_AND_HAMBURG_GEEST',
    label: 'Geest region of Schleswig-Holstein and Hamburg',
  },
  {
    value: 'MECKLENBURG_WESTERN_POMERANIA',
    label: 'Entire region of Mecklenburg–Western Pomerania',
  },
  {
    value: 'LOWER_SAXONY_AND_BREMEN_WEST',
    label: 'Western part of Lower Saxony and Bremen',
  },
  {
    value: 'LOWER_SAXONY_AND_BREMEN_EAST',
    label: 'Eastern part of Lower Saxony and Bremen',
  },
  {
    value: 'NRW_WESTERN_LOWLANDS',
    label: 'Western lowlands of North Rhine-Westphalia',
  },
  {
    value: 'NRW_EAST_WESTPHALIA',
    label: 'East Westphalia region of North Rhine-Westphalia',
  },
  {
    value: 'NRW_LOW_MOUNTAIN_RANGE',
    label: 'Low mountain range region of North Rhine-Westphalia',
  },
  {
    value: 'BRANDENBURG_AND_BERLIN',
    label: 'Entire region of Brandenburg and Berlin',
  },
  {
    value: 'SAXONY_ANHALT_LOWLAND',
    label: 'Lowlands of Saxony-Anhalt',
  },
  {
    value: 'SAXONY_ANHALT_HARZ',
    label: 'Harz mountain region of Saxony-Anhalt',
  },
  {
    value: 'THURINGIA_LOWLANDS',
    label: 'Lowlands of Thuringia',
  },
  {
    value: 'THURINGIA_LOW_MOUNTAIN_RANGE',
    label: 'Low mountain range region of Thuringia',
  },
  {
    value: 'SAXONY_LOWLANDS',
    label: 'Lowlands of Saxony',
  },
  {
    value: 'SAXONY_LOW_MOUNTAIN_RANGE',
    label: 'Low mountain range region of Saxony',
  },
  {
    value: 'HESSE_NORTH_AND_LOW_MOUNTAIN_RANGE',
    label: 'Northern region and low mountain ranges of Hesse',
  },
  {
    value: 'HESSE_RHINE_MAIN',
    label: 'Rhine-Main region of Hesse',
  },
  {
    value: 'RLP_RHINE_PALATINATE_MOSELLE',
    label: 'Rhine-Palatinate and Moselle region of Rhineland-Palatinate',
  },
  {
    value: 'RLP_LOW_MOUNTAIN_RANGE',
    label: 'Low mountain range region of Rhineland-Palatinate',
  },
  {
    value: 'SAARLAND',
    label: 'Entire region of Saarland',
  },
  {
    value: 'BW_UPPER_RHINE_AND_LOWER_NECKAR_VALLEY',
    label: 'Upper Rhine and lower Neckar valley in Baden-Wuerttemberg',
  },
  {
    value: 'BW_HOHENLOHE_MIDDLE_NECKAR_UPPER_SWABIA',
    label: 'Hohenlohe, Middle Neckar, and Upper Swabia regions in Baden-Wuerttemberg',
  },
  {
    value: 'BW_LOW_MOUNTAIN_RANGE',
    label: 'Low mountain range region in Baden-Wuerttemberg',
  },
  {
    value: 'UPPER_BAVARIA_AND_BAVARIAN_FOREST_AND_ALLGAEU',
    label: 'Upper Bavaria, Bavarian Forest, and Allgaeu region in Bavaria',
  },
  {
    value: 'BAVARIA_DANUBE_LOWLANDS',
    label: 'Danube lowlands in Bavaria',
  },
  {
    value: 'BAVARIA_ON_THE_DANUBE',
    label: 'Regions along the Danube in Bavaria',
  },
  {
    value: 'BAVARIA_MAINFRANKEN',
    label: 'Mainfranken region in Bavaria',
  },
  {
    value: 'PREVIEW',
    label: 'Pollen Overview',
  },
]

const nativeSize = {
  width: 3,
  height: 3,
}

/**
 * This component allows users to select the region and pollen type they want information to be displayed for
 *
 */
export const PollenWidgetDetail = ({ args, updateFn, currentSize }: PollenEditWidgetProps) => {
  const [selectedPollen, setSelectedPollen] = useState<PollenType[]>(args.pollenTypes || [])
  const [selectedRegion, setSelectedRegion] = React.useState(args.region)

  // Function to update pollen type array
  const handleCheckboxChange = (type: PollenType, checked: string | boolean) => {
    setSelectedPollen((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
    try {
      const updatedArgs: PollenArguments = {
        ...args,
        pollenTypes: checked ? [...args.pollenTypes, type] : args.pollenTypes.filter((t) => t !== type),
      }
      updateFn({ args: updatedArgs })
    } catch (_) {
      return
    }
  }

  const PollenComboBox = () => {
    const [regionOpen, setRegionOpen] = React.useState(false)

    return (
      <div>
        <Popover open={regionOpen} onOpenChange={setRegionOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={regionOpen} className="w-full justify-between px-2">
              <div className="w-[90%] overflow-hidden truncate">
                {selectedRegion ? regions.find((framework) => framework.value === selectedRegion)?.label : 'Select region...'}
              </div>
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandInput placeholder="Search region..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {regions.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setSelectedRegion(currentValue === selectedRegion ? '' : currentValue)
                        updateFn({
                          args: {
                            ...args,
                            region: currentValue,
                          },
                        })
                        setRegionOpen(false)
                      }}
                    >
                      {framework.label}
                      <Check className={cn('ml-auto', selectedRegion === framework.value ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col space-y-4 p-1">
      {/* region picker */}
      <div className="px-1">
        <PollenComboBox />
      </div>

      {/* pollen type select */}
      <div className="flex flex-col items-center space-y-2">
        <div className="mb-4 text-[95%] font-semibold">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            Enter desired pollen types to be displayed
          </DynamicTextsize>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {Object.values(PollenType).map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={type.toLowerCase()}
                checked={selectedPollen.includes(type)}
                onCheckedChange={(checked) => handleCheckboxChange(type, checked)}
                className="h-4 w-4"
              />
              <label
                htmlFor={type.toLowerCase()}
                className="ml-1 text-[75%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </DynamicTextsize>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
