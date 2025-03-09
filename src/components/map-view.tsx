interface MapViewProps {
  latitude: number
  longitude: number
  zoom?: number
  overrideZIndex?: boolean
}

export const MapView = ({ latitude, longitude, zoom = 14, overrideZIndex = false }: MapViewProps) => {
  // The key is authorized for the free api only, so we're good
  return (
    <div
      className={overrideZIndex ? '' : 'z-[2]'} // on top
      onMouseDown={() => {}}
      onMouseMove={() => {}}
      onMouseUp={() => {}}
      style={{ pointerEvents: 'none' }}
    >
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAhZ5saeVKtgxPEdgvpzMYAa-bb2NTpJ50&q=${latitude},${longitude}&zoom=${zoom}`}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  )
}
