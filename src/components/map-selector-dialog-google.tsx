'use client'

import { ResponsiveDialog } from '@/components/responsive-dialog'
import { LocationPickerProps } from '@/features/edit-dashboard/editgrid'
import { Map } from '@vis.gl/react-google-maps'
import { Plus } from 'lucide-react'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

export interface LocationUpdateProps {
  latitude: number
  longitude: number
}

interface EmbeddedMapProps {
  latitude?: number
  longitude?: number
  zoom?: number
  onLocationSelectedAction: ({ latitude, longitude }: LocationUpdateProps) => void
  onAnyClose?: () => void
  setDialogAction: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
  movementScale?: number // Sensitivity for lat/lng changes
  trigger?: ReactNode
}

export const EmbeddedMapSelectorDialogGoogle = ({
  latitude = 49.01208,
  longitude = 8.415424,
  zoom = 15,
  onLocationSelectedAction: onLocationSelected,
  onAnyClose,
  setDialogAction: setDialog,
  trigger,
}: EmbeddedMapProps) => {
  // Main lat/lng state
  const [currentLat, setCurrentLat] = useState(latitude)
  const [currentLng, setCurrentLng] = useState(latitude)

  /**
   * Handle confirm press: pass the current center coordinates to callback
   */
  const onConfirmPressed = () => {
    onLocationSelected({ latitude: currentLat, longitude: currentLng })
  }

  return (
    <ResponsiveDialog
      onAnyCloseEvent={onAnyClose ?? (() => {})}
      callbackAction={onConfirmPressed}
      setDialogAction={setDialog}
      title="Choose Location on Map"
      type="maps"
      trigger={trigger}
    >
      <div
        className="h-[90%] w-full"
        onMouseDown={(e) => {
          e.preventDefault()
        }}
      >
        <Map
          defaultZoom={zoom}
          defaultCenter={{ lat: latitude, lng: longitude }}
          onIdle={(e) => {
            const center = e.map.getCenter()
            if (!center) return
            setCurrentLat(center.lat)
            setCurrentLng(center.lng)
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-[4020] flex items-center justify-center text-gray-800">
            <Plus className="-translate-y-1" size={35} />
          </div>
        </Map>
      </div>
    </ResponsiveDialog>
  )
}
