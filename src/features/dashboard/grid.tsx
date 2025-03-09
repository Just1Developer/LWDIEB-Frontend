'use client'

import { constructWidget } from '@/features/shared/widget-client-factories'
import { WidgetStyleContainer } from '@/features/shared/widget-container'
import { SkeletonDashboard } from '@/lib/types'

interface GridProps {
  dashboard: SkeletonDashboard
}

export const Grid = ({ dashboard }: GridProps) => {
  const { gridWidth, gridHeight, widgets: skeletonWidgets } = dashboard
  const widgets = skeletonWidgets.map((widget) => constructWidget({ widget }))

  return (
    <div className="h-screen p-5">
      <div
        className="max-w-screen grid h-full w-full gap-3 p-4"
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
        }}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              gridColumn: `${widget.positionX} / span ${widget.width}`,
              gridRow: `${widget.positionY} / span ${widget.height}`,
            }}
          >
            <WidgetStyleContainer>{widget.component}</WidgetStyleContainer>
          </div>
        ))}
      </div>
    </div>
  )
}
