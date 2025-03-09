'use client'

import { LeafletMapViewProps } from '@/features/widget/routing/view/map'
import { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet'

const ROUTE_COLORS = ['#0B3D0B', '#147A39', '#3F6B3A', '#6c6e24', '#b37013', '#6E5034', '#753704', '#8D2C2C', '#7D2A46', '#5C2361']

export const LeafletMapView = ({ deltaTime, locations }: LeafletMapViewProps) => {
  const bounds = new LatLngBounds(locations.map((loc) => [loc.latitude, loc.longitude]))
  const FitBounds = () => {
    const map = useMap()
    map.fitBounds(bounds)
    map.dragging.disable()
    map.touchZoom.disable()
    map.doubleClickZoom.disable()
    map.scrollWheelZoom.disable()
    map.boxZoom.disable()
    map.keyboard.disable()
    return undefined
  }

  const index = deltaTime > 2.2 ? 9 : Math.max(0, Math.min(8, Math.round(1.9 * deltaTime * deltaTime - 1.2)))
  return (
    <MapContainer className="h-full w-full overflow-hidden rounded-lg" zoomControl={false} attributionControl={true}>
      {/* Base Map Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Fit map to bounds */}
      <FitBounds />

      {/* Draw Route */}
      <Polyline
        positions={locations.map((loc) => [loc.latitude, loc.longitude])}
        color="#ffffff"
        pathOptions={{ weight: 12, opacity: 0.9 }}
      />
      <Polyline
        positions={locations.map((loc) => [loc.latitude, loc.longitude])}
        color={ROUTE_COLORS[index]}
        pathOptions={{ weight: 9, opacity: 0.3 }}
      />
      <Polyline positions={locations.map((loc) => [loc.latitude, loc.longitude])} color={ROUTE_COLORS[index]} pathOptions={{ weight: 3 }} />
    </MapContainer>
  )
}
