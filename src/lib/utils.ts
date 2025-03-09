import { DoubleSignedSkeletonDashboard, SignedSkeletonDashboard } from '@/lib/types'
import { EditWidget, SignedSkeletonWidget, SkeletonWidget } from '@/lib/widget-types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const toUnsignedWidget = ({ widget }: { widget: SignedSkeletonWidget | EditWidget }): SkeletonWidget => ({
  id: widget.id,
  width: widget.width,
  height: widget.height,
  positionX: widget.positionX,
  positionY: widget.positionY,
  type: widget.type,
  args: widget.args,
})

export const toSingleSignedDashboard = ({ dashboard }: { dashboard: DoubleSignedSkeletonDashboard }): SignedSkeletonDashboard => ({
  gridWidth: dashboard.gridWidth,
  gridHeight: dashboard.gridHeight,
  widgets: dashboard.widgets,
})
