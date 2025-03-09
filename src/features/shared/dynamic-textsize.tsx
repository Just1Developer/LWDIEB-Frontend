import { Size } from '@/lib/widget-types'
import { ReactNode, useEffect, useState } from 'react'

const maxCareOffset = 0.2

const nativeScreenSize = {
  width: 1920,
  height: 1080,
}

export const calculateScalingFactor = ({
  currentSize,
  nativeSize,
  careLimit = maxCareOffset,
}: {
  currentSize: Size
  nativeSize: Size
  careLimit?: number
}) => {
  let screenWidthRatio = 1
  let screenHeightRatio = 1
  if (typeof window !== 'undefined') {
    screenWidthRatio = window.outerWidth / nativeScreenSize.width
    screenHeightRatio = window.outerHeight / nativeScreenSize.height
  }

  const widthScale = (currentSize.width / nativeSize.width) * screenWidthRatio
  const heightScale = (currentSize.height / nativeSize.height) * screenHeightRatio
  const averageScale = (widthScale + heightScale) / 2

  // Use the smaller of the two as a “base” (the dimension that is less exaggerated)
  const baseScale = Math.min(widthScale, heightScale)

  // Clamp the average so that it never exceeds the base by more than maxCareOffset.
  // In other words, even if one axis grows huge, the effective scale for text
  // will not be more than (1 + maxCareOffset) times the less-scaled (base) axis.
  return Math.max(baseScale, Math.min(averageScale, baseScale * (1 + careLimit)))
}

export const calculateScalingFactorPercent = ({
  currentSize,
  nativeSize,
  careLimit = maxCareOffset,
}: {
  currentSize: Size
  nativeSize: Size
  careLimit?: number
}) => {
  return Math.round(calculateScalingFactor({ currentSize, nativeSize, careLimit }) * 100)
}

export const DynamicTextsize = ({
  children,
  currentSize,
  nativeSize,
  careLimit = maxCareOffset,
}: {
  children: ReactNode
  currentSize: Size
  nativeSize: Size
  careLimit?: number
}) => {
  const [textScalePercentage, setTextScalePercentage] = useState(
    calculateScalingFactorPercent({
      currentSize,
      nativeSize,
      careLimit,
    }),
  )

  // Update the windowSize state whenever the window is resized.
  useEffect(() => {
    const handleResize = () => {
      const newPerc = calculateScalingFactorPercent({
        currentSize,
        nativeSize,
        careLimit,
      })
      if (Math.abs(newPerc / textScalePercentage - 1) > 0.02) setTextScalePercentage(newPerc)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="space-y-2" style={{ fontSize: `${textScalePercentage}%`, lineHeight: '100%' }}>
      {children}
    </div>
  )
}
