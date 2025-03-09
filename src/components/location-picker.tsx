import { LocationUpdateProps } from '@/components/map-selector-dialog-google'
import { LocationPickerProps } from '@/features/edit-dashboard/editgrid'
import { useUserData } from '@/features/shared/user-provider'
import { rgba } from '@/lib/theme-helpers'
import { Map } from 'lucide-react'
import { Dispatch, ReactNode, SetStateAction } from 'react'

interface LocationPickerPropsInternal {
  latitude?: number
  longitude?: number
  zoom?: number
  onLocationPicked: ({ latitude, longitude }: LocationUpdateProps) => void
  onAnyClose?: () => void
  setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
  iconSize?: number
}

export const LocationPicker = ({
  latitude = 49.01208,
  longitude = 8.415424,
  zoom = 15,
  onLocationPicked,
  onAnyClose,
  setDialog,
  iconSize: iconSizeArg = 12,
}: LocationPickerPropsInternal) => {
  const { theme } = useUserData()
  const iconSize = Math.max(8, iconSizeArg)
  return (
    <div
      id="LOCATION_PICKER"
      className="flex h-full w-full items-center justify-center rounded-full"
      onClick={() =>
        setDialog({
          type: 'location picker',
          onLocationPicked,
          latitude,
          longitude,
          zoom,
          onAnyClose,
        })
      }
    >
      <Map
        size={iconSize}
        style={{
          backgroundColor: rgba(theme.foregroundText, 0.15),
          color: rgba(theme.foregroundText, 0.9),
          width: `${Math.round(iconSize / 4)}rem`,
          height: `${Math.round(iconSize / 4)}rem`,
        }}
        className="rounded-full p-2"
      />
    </div>
  )
}
