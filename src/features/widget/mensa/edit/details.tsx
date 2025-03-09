import { Check, ChevronsUpDown } from 'lucide-react'
import { JSX, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { getMensaLines } from '@/features/actions/dashboard-api-data'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { MensaEditWidgetProps } from './widget'

//Sorry but this variable name was suggested by GitHub Copilot and its bloddy hilarious hahaha
//Hello sir, which diningFacility would you like to eat at today?
const diningFacilities = [
  {
    value: 'MENSA_AM_ADENAUERRING',
    label: 'Mensa am Adenauring',
  },
  {
    value: 'MENSA_SCHLOSS_GOTTESAUE',
    label: 'Mensa Schloss Gottesaue',
  },
  {
    value: 'MENSA_MOLTKE',
    label: 'Mensa Moltke',
  },
  {
    value: 'MENSA_MOLTKESTRASSE_30',
    label: 'Mensa Moltkestraße 30',
  },
  {
    value: 'MENSA_ERZBERGERSTRASSE',
    label: 'Mensa Erzbergerstraße',
  },
  {
    value: 'MENSA_TIEFENBRONNERSTRASSE',
    label: 'Mensa Tiefenbronnerstraße',
  },
  {
    value: 'MENSA_HOLZGARTENSTRASSE',
    label: 'Mensa Holzgartenstraße',
  },
]

const priceTypes = [
  {
    value: 'STUDENT',
    label: 'Student',
  },
  {
    value: 'PUPIL',
    label: 'Pupil',
  },
  {
    value: 'EMPLOYEE',
    label: 'Employee',
  },
  {
    value: 'GUEST',
    label: 'Guest',
  },
]

/**
 * MensaWidgetDetail2 component allows users to select a Mensa (or as I like to call it: diningFacility) and a specific line within that Mensa.
 * It uses React hooks and the `useQuery` hook from `react-query` to fetch and manage data.
 *
 * @param {MensaEditWidgetProps} props - The properties for the component.
 * @param {object} props.args - The arguments passed to the component.
 * @param {function} props.updateFn - The function to update the component's state.
 *
 * @returns {Element} The rendered MensaWidgetDetail2 component.
 *
 * @component
 * @example
 * const args = { canteenType: 'MENSA_AM_ADENAUERRING', lineId: 'cf1992cd-ccfa-4a86-9800-7c9d41dfff52' };
 * const updateFn = (newArgs) => console.log(newArgs);
 * return <MensaWidgetDetail2 args={args} updateFn={updateFn} />;
 */
export const MensaWidgetDetail = ({ args, updateFn, currentSize }: MensaEditWidgetProps): JSX.Element => {
  const { canteenType, lineId, priceType } = args

  const linesKey = useMemo(() => ['mensaLines', canteenType], [canteenType])
  const { data: lineData, isFetching: isFetchingLines } = useQuery({
    queryFn: async () => await getMensaLines({ canteenType }),
    queryKey: linesKey,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  })

  const [selectedLine, setSelectedLine] = useState(lineId)
  const [selectedPriceType, setSelectedPriceType] = useState(priceType)

  const LineComboBox = () => {
    const [lineOpen, setLineOpen] = useState(false)

    if (isFetchingLines || !lineData) {
      return (
        <div>
          <Skeleton className="h-10 w-[230px]" />
        </div>
      )
    }

    return (
      <Popover open={lineOpen} onOpenChange={setLineOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={lineOpen} className="w-[230px] justify-between">
            {selectedLine ? lineData.find((availableLines) => availableLines.id === selectedLine)?.name : 'Select line...'}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="h-[150px] w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search line..." />
            <CommandList>
              <CommandEmpty>No Line found 😥</CommandEmpty>
              <CommandGroup>
                {lineData.map((line) => (
                  <CommandItem
                    key={line.id}
                    value={line.name}
                    onSelect={(currentValue) => {
                      const selectedLine = lineData.find((avaliableLines) => avaliableLines.name === currentValue)?.id
                      if (selectedLine) {
                        setSelectedLine(selectedLine)
                        updateFn({
                          args: {
                            ...args,
                            lineId: selectedLine,
                          },
                        })
                      }
                      setLineOpen(false)
                    }}
                  >
                    {line.name}
                    {selectedLine === line.id && <Check className={cn('ml-auto')} />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  const MensaComboBox = () => {
    const [mensaOpen, setMensaOpen] = useState(false)

    return (
      <div>
        <Popover open={mensaOpen} onOpenChange={setMensaOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={mensaOpen} className="w-[230px] justify-between">
              {canteenType ? diningFacilities.find((facility) => facility.value === canteenType)?.label : 'Select mensa...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search Mensa..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {diningFacilities.map((facility) => (
                    <CommandItem
                      key={facility.value}
                      value={facility.label}
                      onSelect={(currentValue) => {
                        const selectedValue = diningFacilities.find((facility) => facility.label === currentValue)?.value
                        if (selectedValue) {
                          updateFn({
                            args: {
                              ...args,
                              canteenType: selectedValue,
                              lineId: '', // reset selected line
                            },
                          })
                        }
                        setMensaOpen(false)
                      }}
                    >
                      {facility.label}
                      <Check className={cn('ml-auto', canteenType === facility.value ? 'opacity-100' : 'opacity-0')} />
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

  const PriceComboBox = () => {
    const [priceOpen, setPriceOpen] = useState(false)

    return (
      <div>
        <Popover open={priceOpen} onOpenChange={setPriceOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={priceOpen} className="w-[230px] justify-between">
              {selectedPriceType ? priceTypes.find((type) => type.value === selectedPriceType)?.label : 'Select price type...'}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search Mensa..." />
              <CommandList>
                <CommandEmpty>No price type found.</CommandEmpty>
                <CommandGroup>
                  {priceTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.label}
                      onSelect={(currentValue) => {
                        const selectedValue = priceTypes.find((type) => type.label === currentValue)?.value
                        if (selectedValue) {
                          setSelectedPriceType(selectedValue)
                          updateFn({
                            args: {
                              ...args,
                              priceType: selectedValue,
                            },
                          })
                        }
                        setPriceOpen(false)
                      }}
                    >
                      {type.label}
                      <Check className={cn('ml-auto', selectedPriceType === type.value ? 'opacity-100' : 'opacity-0')} />
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
    <div className={cn('flex h-full w-full flex-col items-center', currentSize.height > 3 ? 'justify-center' : 'justify-start')}>
      <p>Select a Mensa:</p>
      <MensaComboBox />
      <p className="mt-2">Select a Line:</p>
      <LineComboBox />
      <p className="mt-2">Select a Price Type:</p>
      <PriceComboBox />
    </div>
  )
}
