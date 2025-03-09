import { LocationPicker } from '@/components/location-picker'
import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { getStations } from '@/features/actions/dashboard-api-data'
import { useUserData } from '@/features/shared/user-provider'
import { PublicTransportEditWidgetProps } from '@/features/widget/public-transport/edit/widget'
import { PublicTransportArguments, TransportType } from '@/lib/argument-types'
import { rgba } from '@/lib/theme-helpers'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'

const MAX_DEPARTURES = 10

export const PublicTransportWidgetDetail = ({ args, updateFn, setDialog, canFetch }: PublicTransportEditWidgetProps) => {
  const [maxDepartures, setMaxDepartures] = useState<number>(args.maxDepartures)
  const { latitude, longitude } = args
  const { theme } = useUserData()

  const {
    data: stationData,
    refetch: refetchStations,
    isLoading: isRefetchingStations,
  } = useQuery({
    queryFn: async () => (await getStations({ latitude, longitude, maxStations: 20 })).stations.stations,
    queryKey: [cn('station-fetch-', latitude, '+', longitude)],
  })

  const handleDeparturesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    let value = parseInt(event.target.value)
    if (isNaN(value)) value = 0
    setMaxDepartures(Math.min(MAX_DEPARTURES, Math.max(0, value)))
  }

  const updateMaxDepartures = () => {
    try {
      const updatedArgs = { ...args, maxDepartures: Math.max(1, maxDepartures) }
      updateFn({ args: updatedArgs })
    } catch (_) {
      return
    }
  }

  const updatePlatform = (checked: boolean) => {
    try {
      const updatedArgs: PublicTransportArguments = { ...args, showPlatform: checked }
      updateFn({ args: updatedArgs })
    } catch (_) {
      return
    }
  }

  const [selectedTransport, setSelectedTransport] = useState<TransportType[]>(args.transportType || [])

  const handleCheckboxChange = (type: TransportType, checked: string | boolean) => {
    setSelectedTransport((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
    try {
      const updatedArgs: PublicTransportArguments = {
        ...args,
        transportType: checked ? [...args.transportType, type] : args.transportType.filter((t) => t !== type),
      }
      updateFn({ args: updatedArgs })
    } catch (_) {
      return
    }
  }

  const handleLocationPicked = ({ latitude, longitude }: LocationUpdateProps) => {
    const updateArgs: PublicTransportArguments = {
      ...args,
      latitude,
      longitude,
    }
    updateFn({ args: updateArgs })
  }

  useEffect(() => {
    if (latitude === 49.01208 && longitude === 8.415424) return
    if (!canFetch) return
    // Fetch when the object has existed for 1s
    const timer = setTimeout(() => void refetchStations(), 100)
    return () => clearTimeout(timer)
  }, [latitude, longitude])

  const StationComboBox = () => {
    const [stopOpen, setStopOpen] = React.useState(false)

    if (!stationData || !Array.isArray(stationData) || isRefetchingStations) {
      return (
        <div>
          <Skeleton className="h-10 w-[230px]" />
        </div>
      )
    }

    return (
      <Popover open={stopOpen} onOpenChange={setStopOpen}>
        <PopoverTrigger asChild>
          <div
            style={{ backgroundColor: 'transparent', color: theme.foregroundText, borderColor: rgba(theme.accent, 0.6) }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = rgba(theme.foregroundText, 0.04)
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            role="combobox"
            aria-controls="stop-popover-content"
            aria-expanded={stopOpen}
            className="inline-flex h-full min-h-10 w-full items-center justify-between gap-1 truncate whitespace-nowrap rounded-md border-[1px] px-3 py-2 ring-offset-background transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <p className="w-full truncate">{args.selectedStation.stopPointName}</p>
            <ChevronsUpDown className="opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="h-auto w-[100%] p-0" id="stop-popover-content">
          <Command>
            <CommandInput placeholder="Search stop..." />
            <CommandList>
              <CommandEmpty>No stops found 😥</CommandEmpty>
              <CommandGroup>
                {stationData?.map(({ stopPointRef, stopPointName }) => (
                  <CommandItem
                    key={stopPointRef}
                    value={stopPointName}
                    onSelect={() => {
                      updateFn({
                        args: {
                          ...args,
                          selectedStation: {
                            stopPointName: stopPointName,
                            stopPointRef: stopPointRef,
                          },
                        },
                      })
                      setStopOpen(false)
                    }}
                  >
                    {stopPointName}
                    <Check className={cn('ml-auto', args.selectedStation.stopPointRef === stopPointRef ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  const typeNames = {
    BUS: 'Busses',
    TRAIN: 'Local trains',
    OTHER: 'Interregio & Other',
  }

  const num = {
    TRAIN: 1,
    OTHER: 2,
    BUS: 3,
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full -translate-y-[10%] flex-col items-center justify-center space-y-4">
        {/* Location Picker */}
        <div className="w-full space-y-2 px-8">
          <div className="text-[120%] font-semibold">Select Platform</div>
          <div className="flex w-full flex-row items-center justify-between space-x-2">
            <StationComboBox />
            <div>
              <LocationPicker onLocationPicked={handleLocationPicked} setDialog={setDialog} />
            </div>
          </div>
        </div>

        {/* Platform Toggle */}
        <div className="flex flex-col items-center justify-center space-x-2">
          <p>Show Platforms</p>
          <Switch checked={args.showPlatform} onCheckedChange={updatePlatform} className="mb-4" />
        </div>

        {/* Max Departures Input */}
        <div className="flex flex-col items-center">
          <p>Amount of Departures</p>
          <textarea
            className="h-8 w-10 resize-none overflow-hidden rounded border p-1 text-center"
            value={maxDepartures}
            onChange={handleDeparturesChange}
            onBlur={updateMaxDepartures}
          />
        </div>

        {/* Transport Type Select */}
        <div className="flex flex-col items-center space-y-2">
          <p>Display these:</p>
          <div className="flex flex-col space-y-1">
            {Object.values(TransportType)
              .sort((a, b) => num[a] - num[b])
              .map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.toLowerCase()}
                    checked={selectedTransport.includes(type)}
                    onCheckedChange={(checked) => handleCheckboxChange(type, checked)}
                  />
                  <label
                    htmlFor={type.toLowerCase()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {typeNames[type]}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
