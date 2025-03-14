'use client'

import Loading from '@/components/loading'
import { EmbeddedMapSelectorDialogGoogle } from '@/components/map-selector-dialog-google'
import { ResponsiveDialog } from '@/components/responsive-dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { localStorageDashboardKey } from '@/configuration/local-storage-settings'
import { validateWidgetArguments } from '@/configuration/widget-register/widget-validators'
import { env } from '@/env.mjs'
import { eraseDashboard, postDashboard, postGlobalDashboard } from '@/features/actions/dashboard-load'
import AdderHoverSidebar from '@/features/edit-dashboard/sidebar'
import { signDashboard } from '@/features/shared/signature'
import { useUserData } from '@/features/shared/user-provider'
import { constructDefaultEditWidget } from '@/features/shared/widget-client-factories'
import { WidgetStyleContainer } from '@/features/shared/widget-container'
import { WidgetSkeletonArguments } from '@/lib/argument-types'
import { getEditDashboard } from '@/lib/dashboard-helpers'
import { rgba } from '@/lib/theme-helpers'
import { EditDashboard } from '@/lib/types'
import { cn } from '@/lib/utils'
import { EditWidget } from '@/lib/widget-types'
import { APIProvider } from '@vis.gl/react-google-maps'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'

export interface LocationPickerProps {
  type: 'location picker'
  onLocationPicked: ({ latitude, longitude }: { latitude: number; longitude: number }) => void
  onAnyClose?: () => void
  latitude?: number
  longitude?: number
  zoom?: number
}

interface UpdateWidgetProps {
  currentId: string
  newId?: string
  newX?: number
  newY?: number
  newWidth?: number
  newHeight?: number
  newArgs?: WidgetSkeletonArguments
}

interface EditGridProps {
  dashboard: EditDashboard
  type?: 'admin' | 'user'
}

interface GhostProps {
  color: string
  width: number
  height: number
  posX: number
  posY: number
}

const rectanglesOverlap = ({
  candidatePositionX,
  candidatePositionY,
  candidateWidth,
  candidateHeight,
  other,
}: {
  candidatePositionX: number
  candidatePositionY: number
  candidateWidth: number
  candidateHeight: number
  other: EditWidget
}) => {
  return !(
    candidatePositionX + candidateWidth <= other.positionX ||
    other.positionX + other.width <= candidatePositionX ||
    candidatePositionY + candidateHeight <= other.positionY ||
    other.positionY + other.height <= candidatePositionY
  )
}

export const time = () => Date.now()

const GHOST_COLOR_NORMAL = 'bg-zinc-400/40'
const GHOST_COLOR_RED = 'bg-red-600/40'
const GHOST_SCALE_FACTOR = 0.985
const GHOST_OFFSET_FACTOR = 1
// How long it takes for the sidebar open to trigger temp widget deletion after creation.
const SIDEBAR_CLOSE_COOLDOWN = 500

export const EditGrid = ({ dashboard, type = 'user' }: EditGridProps) => {
  const router = useRouter()
  const { theme } = useUserData()
  const [gridWidth, setGridWidth] = useState(dashboard.gridWidth)
  const [gridHeight, setGridHeight] = useState(dashboard.gridHeight)
  const [widgets, setWidgets] = useState<EditWidget[]>(dashboard.widgets)
  const [ghost, setGhost] = useState<GhostProps>()
  const [dialog, setDialog] = useState<ReactNode | LocationPickerProps>()

  const [canWidgetsFetch, setCanWidgetsFetch] = useState(false)
  const [ghostAlive, setGhostAlive] = useState(false)

  const updateWidgetState = ({ currentId, newId, newX, newY, newWidth, newHeight, newArgs }: UpdateWidgetProps) => {
    setWidgets(
      widgets.map((w) =>
        w.id === currentId
          ? {
              ...w,
              id: newId ?? w.id,
              positionX: newX ?? w.positionX,
              positionY: newY ?? w.positionY,
              width: newWidth ?? w.width,
              height: newHeight ?? w.height,
              args: newArgs ?? w.args,
              initiallyValid: true,
            }
          : w,
      ),
    )
  }

  const [newTempWidget, setNewTempWidget] = useState<{
    editWidget: EditWidget
    collides: boolean
    pixelWidth: number
    pixelHeight: number
    pixelX: number
    pixelY: number
    creationTime: number
  }>()
  // newTempWidget doesn't immediately update in events
  const newTempWidgetRef = useRef(newTempWidget)
  // Using existence of newTempWidget causes issues
  const [isCurrentlyAddingWidget, setIsCurrentlyAddingWidget] = useState<boolean>(false)
  const [isTempWidgetSnappingToGrid, setIsTempWidgetSnappingToGrid] = useState<boolean>(false)
  const isTempWidgetSnappingToGridRef = useRef(isTempWidgetSnappingToGrid)

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const gridRef = useRef<HTMLDivElement>(null) // null unavoidable

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('')

  // Hooks to update values so that the events for adding new widgets have up-to-date data

  useEffect(() => {
    newTempWidgetRef.current = newTempWidget
  }, [newTempWidget])

  useEffect(() => {
    isTempWidgetSnappingToGridRef.current = isTempWidgetSnappingToGrid
  }, [isTempWidgetSnappingToGrid])

  useEffect(() => {
    if (newTempWidgetRef.current && time() - newTempWidgetRef.current.creationTime > SIDEBAR_CLOSE_COOLDOWN && sidebarOpen)
      setNewTempWidget(undefined)
  }, [sidebarOpen])

  useEffect(() => {
    const newCanWidgetsFetch = !ghost && !newTempWidget
    if (canWidgetsFetch != newCanWidgetsFetch) setCanWidgetsFetch(newCanWidgetsFetch)
  }, [newTempWidget, ghost])

  useEffect(() => {
    const newGhostAlive = !!ghost
    if (ghostAlive != newGhostAlive) setGhostAlive(newGhostAlive)
  }, [ghost])

  useEffect(() => {
    if (!dialog || React.isValidElement(dialog) || (dialog as LocationPickerProps).type !== 'location picker') return
    const { onLocationPicked, longitude, latitude, zoom, onAnyClose } = dialog as LocationPickerProps
    if (googleMapsApiKey === '') setGoogleMapsApiKey(env.NEXT_PUBLIC_GOOGLE_MAPS_JS_API_KEY)
    setDialog(
      <EmbeddedMapSelectorDialogGoogle
        onLocationSelectedAction={onLocationPicked}
        setDialogAction={setDialog}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        onAnyClose={onAnyClose}
      />,
    )
  }, [dialog])

  const GetComponent = ({ widget }: { widget: EditWidget }) => {
    const { args, width, height } = widget
    const lodIndex = Math.max(0, Math.min(widget.args.levelOfDetail, widget.components.length - 1))
    const updateFn = getUpdateFunction({ widget })
    // If clamped lod index yields undefined, there is nothing to display, so no fallback is required (usually)
    const Component = widget.components[lodIndex]?.component({
      args: args,
      updateFn,
      setDialog,
      canFetch: canWidgetsFetch,
      currentSize: { width, height },
    })
    return (
      <WidgetStyleContainer>
        {Component}
        {widget.components.length > 1 ? <LevelOfDetailSwitcher widget={widget} /> : null}
      </WidgetStyleContainer>
    )
  }

  const getUpdateFunction = ({ widget: w }: { widget: EditWidget }): (({ args }: { args: WidgetSkeletonArguments }) => void) => {
    return ({ args }) =>
      updateWidgetState({
        currentId: w.id,
        newArgs: args,
      })
  }

  const handleWidgetAddition = ({ widget }: { widget: EditWidget }) => {
    setWidgets((prevWidgets) => [...prevWidgets, widget])
  }

  const handleWidgetDeletion = ({ widget }: { widget: EditWidget }) => {
    setWidgets((prevWidgets) => prevWidgets.filter((w) => w.id !== widget.id))
  }

  const widgetCollides = ({
    candidateId,
    candidatePositionX,
    candidatePositionY,
    candidateWidth,
    candidateHeight,
  }: {
    candidateId: string
    candidatePositionX: number
    candidatePositionY: number
    candidateWidth: number
    candidateHeight: number
  }) => {
    return (
      candidatePositionX < 0 ||
      candidatePositionX + candidateWidth - 1 > gridWidth ||
      candidatePositionY < 0 ||
      candidatePositionY + candidateHeight - 1 > gridHeight ||
      widgets.some((other) => {
        if (other.id === candidateId) return false // skip itself
        return rectanglesOverlap({
          candidatePositionX,
          candidatePositionY,
          candidateWidth,
          candidateHeight,
          other,
        })
      })
    )
  }

  const handleDrag = ({ widget, clampedX, clampedY }: { widget: EditWidget; clampedX: number; clampedY: number }) => {
    const { id } = widget
    updateWidgetState({
      currentId: id,
      newId: `w@${clampedX}-${clampedY}`,
      newX: clampedX,
      newY: clampedY,
    })
  }

  const currentClampedX = useRef(-1)
  const currentClampedY = useRef(-1)

  const handleDragDropMovement = ({ e, widget }: { e: React.MouseEvent; widget: EditWidget }) => {
    // Only prevent default when the primary mouse button is pressed
    if (e.button === 0) {
      // Check if the target is not a text input, textarea, or other interactive element
      const target = e.target as HTMLElement

      // Block all shadcn / Radix Elements
      if (target.id.startsWith('radix')) return

      const nonDraggableIds = ['LOCATION_PICKER']
      if (nonDraggableIds.includes(target.id)) return
      const nonDraggableElements = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'path', 'svg', 'P']
      if (nonDraggableElements.includes(target.tagName)) return
    }
    e.preventDefault()
    if (newTempWidget) return

    const widgetElement = e.currentTarget.parentElement
    if (!widgetElement) return
    const rect = e.currentTarget.getBoundingClientRect()
    const gridElement = widgetElement.parentElement
    const gridRect = gridElement?.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY

    // Calculate cell size based on the widget's size and grid span
    const cellWidth = rect.width / widget.width
    const cellHeight = rect.height / widget.height

    // Calculate the initial offset within the widget where the mouse was pressed
    const offsetX = startX - rect.left
    const offsetY = startY - rect.top

    const initialPositionX = widget.positionX - 1
    const initialPositionY = widget.positionY - 1

    currentClampedX.current = widget.positionX
    currentClampedY.current = widget.positionY

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaXPixels = moveEvent.clientX - startX
      const deltaYPixels = moveEvent.clientY - startY

      // Calculate delta in grid cells
      const deltaX = Math.round(deltaXPixels / cellWidth)
      const deltaY = Math.round(deltaYPixels / cellHeight)

      let newPositionX = initialPositionX + deltaX
      let newPositionY = initialPositionY + deltaY

      // Clamp the new positions within grid boundaries
      newPositionX = Math.min(gridWidth - widget.width, Math.max(0, newPositionX)) + 1
      newPositionY = Math.min(gridHeight - widget.height, Math.max(0, newPositionY)) + 1

      const clampedX = Math.min(gridWidth - widget.width + 1, Math.max(1, newPositionX))
      const clampedY = Math.min(gridHeight - widget.height + 1, Math.max(1, newPositionY))

      const collides = widgetCollides({
        candidateId: widget.id,
        candidatePositionX: clampedX,
        candidatePositionY: clampedY,
        candidateHeight: widget.height,
        candidateWidth: widget.width,
      })

      setGhost({
        color: collides ? GHOST_COLOR_RED : GHOST_COLOR_NORMAL,
        posX: moveEvent.clientX - (gridRect?.left ?? 0) - offsetX,
        posY: moveEvent.clientY - (gridRect?.top ?? 0) - offsetY,
        width: widget.width * cellWidth,
        height: widget.height * cellHeight,
      })

      if (currentClampedX.current === clampedX && currentClampedY.current === clampedY) return
      currentClampedX.current = clampedX

      currentClampedY.current = clampedY

      if (!collides) handleDrag({ widget, clampedX, clampedY })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setGhost(undefined)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeMovement = ({ e, widget }: { e: React.MouseEvent; widget: EditWidget }) => {
    e.preventDefault()
    if (newTempWidget) return

    const widgetElement = e.currentTarget.parentElement
    if (!widgetElement) return

    const gridElement = widgetElement.parentElement
    if (!gridElement) return

    const gridRect = gridElement.getBoundingClientRect()
    const widgetRect = widgetElement.getBoundingClientRect()

    const startX = e.clientX
    const startY = e.clientY

    // Calculate cell size based on the grid's dimensions
    const cellWidth = gridRect.width / gridWidth
    const cellHeight = gridRect.height / gridHeight

    // Capture the initial width and height
    const initialWidth = widget.width
    const initialHeight = widget.height

    // Calculate the initial offset within the widget where the mouse was pressed
    const offsetX = startX - widgetRect.right
    const offsetY = startY - widgetRect.bottom

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaXPixels = moveEvent.clientX - startX
      const deltaYPixels = moveEvent.clientY - startY

      // Calculate delta in grid cells
      const deltaX = Math.round(deltaXPixels / cellWidth)
      const deltaY = Math.round(deltaYPixels / cellHeight)

      let newWidth = initialWidth + deltaX
      let newHeight = initialHeight + deltaY

      // Clamp the new size within grid boundaries
      newWidth = Math.min(gridWidth - widget.positionX + 1, Math.max(1, newWidth))
      newHeight = Math.min(gridHeight - widget.positionY + 1, Math.max(1, newHeight))

      const minimumSize = getLevelOfDetail({ widget }).component?.minimumSize ?? { width: 1, height: 1 }

      const clampedWidth = Math.min(gridWidth - widget.positionX + 1, Math.max(minimumSize.width, newWidth))
      const clampedHeight = Math.min(gridHeight - widget.positionY + 1, Math.max(minimumSize.height, newHeight))

      const collides = widgetCollides({
        candidateId: widget.id,
        candidatePositionX: widget.positionX,
        candidatePositionY: widget.positionY,
        candidateWidth: clampedWidth,
        candidateHeight: clampedHeight,
      })

      setGhost({
        color: collides ? GHOST_COLOR_RED : GHOST_COLOR_NORMAL,
        // Position the ghost relative to the grid's top-left corner
        posX: (widget.positionX - 1) * cellWidth - offsetX * GHOST_OFFSET_FACTOR,
        posY: (widget.positionY - 1) * cellHeight - offsetY * GHOST_OFFSET_FACTOR,
        width: clampedWidth * cellWidth,
        height: clampedHeight * cellHeight,
      })

      if (!collides)
        handleResize({
          widget,
          newWidth: clampedWidth,
          newHeight: clampedHeight,
        })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setGhost(undefined)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResize = ({ widget, newWidth, newHeight }: { widget: EditWidget; newWidth: number; newHeight: number }) => {
    const clampedWidth = Math.min(newWidth, gridWidth - widget.positionX + 1)
    const clampedHeight = Math.min(newHeight, gridHeight - widget.positionY + 1)
    const { id } = widget

    updateWidgetState({
      currentId: id,
      newWidth: clampedWidth,
      newHeight: clampedHeight,
    })
  }

  const getLevelOfDetail = ({ widget }: { widget: EditWidget }) => {
    const clampedIndex = Math.max(0, Math.min(widget.args.levelOfDetail, widget.components.length - 1))
    return { clampedIndex, component: widget.components[clampedIndex] }
  }

  const LevelOfDetailSwitcher = ({ widget }: { widget: EditWidget }) => {
    const levelOfDetail = getLevelOfDetail({ widget })
    if (!levelOfDetail.component) return undefined
    const textSizePreview = 'text-[90%]'
    const textSizeEntries = 'text-[95%]'
    return (
      <div className="inset-0 bottom-0 left-0 h-[20%] max-h-12 w-full items-center bg-transparent pb-[-1]">
        <div
          className="z-auto flex h-full w-full -translate-y-[100%] items-center justify-end overflow-hidden border-t border-gray-500 pl-[25%] pr-2"
          onMouseDown={(e) => {
            e.preventDefault()
          }}
        >
          <div
            className="absolute z-[-1] h-full w-[80%] -translate-y-[15%] justify-center blur-md"
            style={{ backgroundColor: rgba(theme.accent, 0.1) }}
          ></div>
          <Select
            value={`${levelOfDetail.clampedIndex}`}
            onValueChange={(value: string) => onSwitchLevelOfDetail({ widget, newIndex: parseInt(value) })}
            disabled={false}
          >
            <SelectTrigger className={cn('h-9 w-[120%]', textSizePreview)}>
              <SelectValue placeholder={levelOfDetail.clampedIndex} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {widget.components.map((component, index) =>
                  widget.height < component.minimumSize.height || widget.width < component.minimumSize.width ? (
                    <SelectItem
                      key={index}
                      className={textSizeEntries}
                      value={`${index}`}
                      disabled={widget.height < component.minimumSize.height || widget.width < component.minimumSize.width}
                    >
                      {component.minimumSize.name}
                      <br />
                      <div className="text-red-500">
                        (Minimum {component.minimumSize.width}x{component.minimumSize.height})
                      </div>
                    </SelectItem>
                  ) : (
                    <SelectItem key={index} className={textSizeEntries} value={`${index}`}>
                      {component.minimumSize.name}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const onSwitchLevelOfDetail = ({ widget, newIndex }: { widget: EditWidget; newIndex: number }) => {
    const { id } = widget
    updateWidgetState({
      currentId: id,
      newArgs: {
        ...widget.args,
        levelOfDetail: newIndex,
      },
    })
  }

  const injectNewWidget = ({ triggerEvent, widgetType }: { triggerEvent: React.MouseEvent<HTMLDivElement>; widgetType: string }) => {
    // Reject if no grid, or we already have one attached
    if (isCurrentlyAddingWidget || !gridRef?.current) return
    setIsCurrentlyAddingWidget(true)
    const grid = gridRef.current
    const rect = grid.getBoundingClientRect()

    const removeTempWidget = () => {
      setGhost(undefined)
      setIsCurrentlyAddingWidget(false)
      setIsTempWidgetSnappingToGrid(false)
      setNewTempWidget(undefined)
    }
    removeTempWidget() // Reset states. If this is missing, the first widget added doesn't snap until mousemove, so its data is corrupt.

    const cellWidth = rect.width / dashboard.gridWidth
    const cellHeight = rect.height / dashboard.gridHeight

    const constructedTempWidget = constructDefaultEditWidget({ widgetType })
    const initialWidth = constructedTempWidget.components[0]?.minimumSize.width ?? 1
    const initialHeight = constructedTempWidget.components[0]?.minimumSize.height ?? 1

    const initialWidthPx = initialWidth * cellWidth
    const initialHeightPx = initialHeight * cellHeight

    const initialPositionX = triggerEvent.clientX - rect.left - (initialWidth * cellWidth) / 2
    const initialPositionY = triggerEvent.clientY - rect.top - (initialHeight * cellHeight) / 2

    // This will be interpreted as exact position as long as snap is false
    constructedTempWidget.positionX = initialPositionX
    constructedTempWidget.positionY = initialPositionY
    constructedTempWidget.width = initialWidth
    constructedTempWidget.height = initialHeight
    const collidesInitially = widgetCollides({
      candidateId: '-',
      candidatePositionX: constructedTempWidget.positionX,
      candidatePositionY: constructedTempWidget.positionY,
      candidateWidth: constructedTempWidget.width,
      candidateHeight: constructedTempWidget.height,
    })

    setIsTempWidgetSnappingToGrid(false)
    const tempWidget = {
      editWidget: constructedTempWidget,
      collides: collidesInitially,
      pixelWidth: initialWidthPx,
      pixelHeight: initialHeightPx,
      pixelX: initialPositionX, //triggerEvent.clientX - rect.x - (initialWidth * cellWidth) / 2,
      pixelY: initialPositionY, //triggerEvent.clientY - rect.y - (initialHeight * cellHeight) / 2,
      creationTime: time(),
    }
    setNewTempWidget(tempWidget)

    const updatePositionAndSize = ({ clientX, clientY, shouldSnap }: { clientX: number; clientY: number; shouldSnap: boolean }) => {
      const tempWidget = newTempWidgetRef.current
      if (!tempWidget) return // To assert it's there, in context we don't need it

      const x = clientX - rect.left - initialWidthPx / 2
      const y = clientY - rect.top - initialHeightPx / 2

      const { snappedX, snappedY } = convertPxCoordsToGridCoords({
        x,
        y,
        cellWidth,
        cellHeight,
        widgetWidth: tempWidget.editWidget.width,
        widgetHeight: tempWidget.editWidget.height,
      })
      const { positionX: currentPositionX, positionY: currentPositionY, width: currentWidth, height: currentHeight } = tempWidget.editWidget
      const collides = widgetCollides({
        candidateId: '-',
        candidatePositionX: currentPositionX,
        candidatePositionY: currentPositionY,
        candidateWidth: currentWidth,
        candidateHeight: currentHeight,
      })

      if (shouldSnap) {
        setGhost({
          color: collides ? GHOST_COLOR_RED : GHOST_COLOR_NORMAL,
          posX: x,
          posY: y,
          width: tempWidget.pixelWidth,
          height: tempWidget.pixelHeight,
        })
      }

      setNewTempWidget({
        ...tempWidget,
        collides,
        editWidget: {
          ...tempWidget.editWidget,
          id: `tw-${tempWidget.editWidget.type}@${snappedX}-${snappedY}`,
          positionX: snappedX,
          positionY: snappedY,
        },
        pixelX: x,
        pixelY: y,
      })
    }

    const gridMouseMove = (e: MouseEvent) => {
      const tempWidget = newTempWidgetRef.current
      if (!tempWidget) {
        removeTempWidget()
        return
      }
      e.preventDefault()
      updatePositionAndSize({
        clientX: e.clientX,
        clientY: e.clientY,
        shouldSnap: isTempWidgetSnappingToGridRef.current,
      })
    }

    const gridMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const tempWidget = newTempWidgetRef.current
      if (!tempWidget) return
      e.preventDefault()
      setIsTempWidgetSnappingToGrid(true)
      updatePositionAndSize({
        clientX: e.clientX,
        clientY: e.clientY,
        shouldSnap: true,
      })
      grid.addEventListener('mouseup', gridMouseUp)
    }

    const gridMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return
      const tempWidget = newTempWidgetRef.current
      if (!tempWidget) return
      e.preventDefault()
      if (!tempWidget.collides) {
        const snapped = isTempWidgetSnappingToGridRef.current
        const coords = snapped
          ? {
              snappedX: tempWidget.editWidget.positionX,
              snappedY: tempWidget.editWidget.positionY,
            }
          : convertPxCoordsToGridCoords({
              x: tempWidget.editWidget.positionX,
              y: tempWidget.editWidget.positionY,
              cellWidth,
              cellHeight,
              widgetWidth: tempWidget.editWidget.width,
              widgetHeight: tempWidget.editWidget.height,
            })
        const newWidget = {
          ...tempWidget.editWidget,
          id: `w@${coords.snappedX}-${coords.snappedY}`,
          positionX: coords.snappedX,
          positionY: coords.snappedY,
        }
        handleWidgetAddition({ widget: newWidget })
      }
      removeTempWidget()
      removeGridEvents()
    }

    const removeGridEvents = () => {
      grid.removeEventListener('mousemove', gridMouseMove)
      grid.removeEventListener('mousedown', gridMouseDown)
      grid.removeEventListener('mouseup', gridMouseUp)
    }

    updatePositionAndSize({
      clientX: triggerEvent.clientX,
      clientY: triggerEvent.clientY,
      shouldSnap: false,
    })
    grid.addEventListener('mousemove', (e) => gridMouseMove(e))
    grid.addEventListener('mousedown', (e) => gridMouseDown(e))
  }

  const convertPxCoordsToGridCoords = ({
    x,
    y,
    cellWidth,
    cellHeight,
    widgetWidth,
    widgetHeight,
  }: {
    x: number
    y: number
    cellWidth: number
    cellHeight: number
    widgetWidth: number
    widgetHeight: number
  }) => {
    let snappedX = Math.round(x / cellWidth) + 1
    let snappedY = Math.round(y / cellHeight) + 1
    // Snap to bounds:
    snappedX = Math.min(dashboard.gridWidth + 1 - widgetWidth, Math.max(1, snappedX))
    snappedY = Math.min(dashboard.gridHeight + 1 - widgetHeight, Math.max(1, snappedY))
    return { snappedX, snappedY }
  }

  const [saveStatus, setSaveStatus] = React.useState<{ status: 'none' | 'pending' | 'yes'; setSaving?: Dispatch<SetStateAction<boolean>> }>(
    { status: 'none' },
  )

  const [discardStatus, setDiscardStatus] = React.useState<{ status: 'none' | 'pending' | 'yes' }>({ status: 'none' })

  const getCurrentReadyDashboard = ({
    setSaving,
    prompt,
    setSidebarStatus,
  }: {
    setSaving: Dispatch<SetStateAction<boolean>> | undefined
    prompt: boolean
    setSidebarStatus?: Dispatch<SetStateAction<boolean>>
  }): EditDashboard | undefined => {
    const enabledWidgets = widgets.filter((widget) => widget.enabled).map((w) => w)
    const verifiedWidgets = enabledWidgets.filter(({ type, args, width, height }) =>
      validateWidgetArguments({ type: type, args: args, size: { width, height } }),
    )
    const signableWidgets = enabledWidgets.map((widget) => ({
      ...widget,
      enabled:
        widget.enabled &&
        validateWidgetArguments({ type: widget.type, args: widget.args, size: { width: widget.width, height: widget.height } }),
    }))

    setWidgets(
      widgets.map((widget) => ({
        ...widget,
        initiallyValid:
          widget.enabled &&
          validateWidgetArguments({ type: widget.type, args: widget.args, size: { width: widget.width, height: widget.height } }),
      })),
    )

    if (prompt && enabledWidgets.length != verifiedWidgets.length) {
      if (setSidebarStatus) setSidebarStatus(false)
      setDialog(
        <ResponsiveDialog
          callbackAction={() => setSaveStatus({ status: 'pending', setSaving: setSaving ?? saveStatus.setSaving })}
          title={'Invalid Widgets'}
          setDialogAction={setDialog}
          confirmButtonText={'Save anyway'}
          open={true}
        >
          {enabledWidgets.length - verifiedWidgets.length}{' '}
          {enabledWidgets.length - verifiedWidgets.length === 1
            ? 'widget is invalid. It will be saved, but it will'
            : 'widgets are invalid. They will be saved, but they will'}{' '}
          not show up on the dashboard.
        </ResponsiveDialog>,
      )
      return undefined
    }

    // Widgets are signed when signing the dashboard
    return {
      gridWidth: dashboard.gridWidth,
      gridHeight: dashboard.gridHeight,
      widgets: signableWidgets, // widgets are still saved, just not signed and loaded further down the line
    }
  }

  const saveDashboard = async ({
    setSaving,
    setSidebarStatus,
  }: {
    setSaving: Dispatch<SetStateAction<boolean>>
    setSidebarStatus: Dispatch<SetStateAction<boolean>>
  }) => {
    setSaving(true)
    const dashboard = getCurrentReadyDashboard({ setSaving, prompt: true, setSidebarStatus })
    if (!dashboard) return
    await attemptSaveDashboard({ setSaving })
  }

  useEffect(() => {
    if (!saveStatus) return
    if (saveStatus.status == 'pending') void attemptSaveDashboard({ setSaving: saveStatus.setSaving })
  }, [saveStatus])

  useEffect(() => {
    if (dialog) return
    if (saveStatus.status != 'none') setSaveStatus({ status: 'none' })
  }, [dialog])

  const isLoggedIn = async () => (await fetch('api/auth/login-valid', { credentials: 'include' }).then((res) => res.json())).status === 200

  const saveDashboardLocally = ({ signedDashboard }: { signedDashboard: string }) => {
    try {
      localStorage.setItem(localStorageDashboardKey, signedDashboard)
      return undefined
    } catch (e) {
      return 'Failed to save dashboard locally'
    }
  }

  const attemptSaveDashboard = async ({ setSaving }: { setSaving: Dispatch<SetStateAction<boolean>> | undefined }) => {
    const signedIn = await isLoggedIn()
    const dashboard = getCurrentReadyDashboard({ setSaving, prompt: false })
    if (!dashboard) return // Does not happen, because we do not prompt
    const signedDashboard = await signDashboard({ dashboard })

    let error: string | undefined = undefined

    if (signedIn || type === 'admin') {
      const response = await (type === 'admin' ? postGlobalDashboard : postDashboard)({ doubleSignedDashboard: signedDashboard })
      if (response.status !== 200) {
        error = response.error
      }
    } else {
      error = saveDashboardLocally({ signedDashboard })
    }

    if (setSaving) setSaving(false)
    if (!error) {
      router.push('/')
    } else {
      // Show error
      setDialog(
        <ResponsiveDialog
          callbackAction={() => {
            const error = saveDashboardLocally({ signedDashboard })
            if (error) {
              setDialog(
                <ResponsiveDialog
                  callbackAction={() => {}}
                  title={'An error occurred while saving the dashboard'}
                  confirmButtonText={'Ok'}
                  cancelButtonText={''}
                  onAnyCloseEvent={resetSaveDialog}
                >
                  {error}
                </ResponsiveDialog>,
              )
            } else {
              router.push('/')
            }
          }}
          title={'An error occurred while saving the dashboard'}
          confirmButtonText={'Try saving locally'}
          cancelButtonText={'Cancel'}
          onAnyCloseEvent={resetSaveDialog}
        >
          {error}
          <br />
          Try saving locally? You can view your changes on this device when not logged in.
        </ResponsiveDialog>,
      )
    }
  }

  const resetSaveDialog = () => {
    setDialog(undefined)
    if (saveStatus.setSaving) saveStatus.setSaving(false)
    setSaveStatus({ status: 'none' })
  }

  const discardChanges = () => {
    setDialog(
      <ResponsiveDialog callbackAction={() => router.push('/')} setDialogAction={setDialog} title={'Discard all changes?'}>
        Are you sure? All changes will be lost.
      </ResponsiveDialog>,
    )
  }

  const eraseDashboardButtonFn = () => {
    setDialog(
      <div className="bg-red-700 text-gray-50">
        <ResponsiveDialog
          callbackAction={() => setDiscardStatus({ status: 'pending' })}
          setDialogAction={setDialog}
          title={'Erase your dashboard?'}
          confirmButtonText="I understand. Erase my Dashboard"
          cancelButtonText="Nevermind"
        >
          This deletes your custom dashboard and will reset it to the default dashboard.
          <br />
          <div className="text-[115%] font-semibold text-red-400">This action cannot be undone.</div>
        </ResponsiveDialog>
      </div>,
    )
  }

  useEffect(() => {
    switch (discardStatus.status) {
      case 'yes':
        completeEraseDashboard()
        return
      case 'pending':
        callEraseDashboard().then((result) => result && setSaveStatus({ status: 'yes' }))
        return
    }
  }, [discardStatus])

  const callEraseDashboard = async () => {
    // Erase dashboard locally if not logged in
    const signedIn = await isLoggedIn()
    if (!signedIn) {
      localStorage.removeItem(localStorageDashboardKey)
    }

    const newDashboard = await eraseDashboard()
    const { gridHeight, gridWidth } = getEditDashboard({ signedSkeletonDashboard: newDashboard })
    setGridHeight(gridHeight)
    setGridWidth(gridWidth)
    setDiscardStatus({ status: 'yes' })
    router.push('/')
    return true
  }

  const completeEraseDashboard = () => {
    setGhost(undefined)
    setNewTempWidget(undefined)
    setDialog(undefined)
    setSaveStatus({ status: 'none' })
    setDiscardStatus({ status: 'none' })
    router.push('/')
  }

  const DeleteTrigger = () => (
    <div className="absolute -left-2.5 -top-2.5 z-[98] flex h-5 w-5 cursor-pointer items-center justify-center justify-items-center rounded-full bg-red-500/80 align-middle text-accent-foreground text-gray-200">
      <X size={14} />
    </div>
  )

  return (
    <div
      style={{
        background: theme.backgroundBoard,
        color: theme.foregroundText,
        accentColor: theme.accent,
      }}
    >
      <div className="h-full w-full" ref={gridRef}>
        {googleMapsApiKey === '' ? (
          React.isValidElement(dialog) && dialog
        ) : (
          <APIProvider apiKey={googleMapsApiKey}>{React.isValidElement(dialog) && dialog}</APIProvider>
        )}
        {newTempWidget && !isTempWidgetSnappingToGridRef.current ? (
          <div
            className={cn('pointer-events-none absolute z-[99] overflow-hidden rounded-md')}
            style={{
              top: newTempWidget.pixelY,
              left: newTempWidget.pixelX + (gridRef.current?.getBoundingClientRect()?.left ?? 0),
              width: newTempWidget.pixelWidth,
              height: newTempWidget.pixelHeight,
            }}
          >
            <GetComponent widget={newTempWidget.editWidget} />
          </div>
        ) : null}
        {ghost ? (
          <div
            className={cn('pointer-events-none absolute z-[100] border border-gray-400/20', ghost.color)}
            style={{
              top: ghost.posY,
              left: ghost.posX + (gridRef.current?.getBoundingClientRect()?.x ?? 0),
              width: ghost.width * GHOST_SCALE_FACTOR,
              height: ghost.height * GHOST_SCALE_FACTOR,
              opacity: 0.8,
              transition: 'background-color 0.3s',
            }}
          ></div>
        ) : null}
        <div id="relative grid-parent" className="h-full w-full">
          <div
            className="grid h-screen gap-3 p-4"
            style={{
              gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
            }}
          >
            {newTempWidget && isTempWidgetSnappingToGridRef.current ? (
              <div
                className={cn('pointer-events-none relative z-[99] overflow-hidden rounded-md border-2')}
                style={{
                  gridColumn: `${newTempWidget.editWidget.positionX} / span ${newTempWidget.editWidget.width}`,
                  gridRow: `${newTempWidget.editWidget.positionY} / span ${newTempWidget.editWidget.height}`,
                  borderColor: rgba(theme.accentForeground, 0.4),
                }}
              >
                <GetComponent widget={newTempWidget.editWidget} />
              </div>
            ) : null}
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={cn('relative rounded-md', widget.initiallyValid ? '' : 'rounded-md border border-red-500/80')}
                style={{
                  gridColumn: `${widget.positionX} / span ${widget.width}`,
                  gridRow: `${widget.positionY} / span ${widget.height}`,
                }}
              >
                <ResponsiveDialog
                  callbackAction={() => handleWidgetDeletion({ widget })}
                  title={'Delete Widget?'}
                  trigger={<DeleteTrigger />}
                >
                  Are you sure you want to delete this widget?
                </ResponsiveDialog>
                <div
                  onMouseDown={(e) => handleDragDropMovement({ e, widget })}
                  className={cn('-z-10 h-full w-full overflow-hidden', ghost ? 'cursor-grabbing' : 'cursor-grab')} // alternatively: cursor-move
                >
                  <GetComponent widget={widget} />
                </div>
                <div
                  onMouseDown={(e) => handleResizeMovement({ e, widget })}
                  className="z-110 absolute -bottom-2.5 -right-2.5 flex h-5 w-5 cursor-se-resize items-center justify-center rounded-full"
                  style={{ backgroundColor: rgba(theme.accentForeground, 0.05) }}
                >
                  {/* Resize icon */}
                  &#x2198;
                </div>
              </div>
            ))}
          </div>
          <AdderHoverSidebar
            saveButtonPressedAction={saveDashboard}
            discardButtonPressedAction={discardChanges}
            eraseButtonPressedAction={eraseDashboardButtonFn}
            setSidebarOpenAction={setSidebarOpen}
            injectWidgetAction={injectNewWidget}
            type={type}
          />
        </div>
      </div>
      {discardStatus.status === 'pending' && (
        <div className="absolute inset-0 z-[111] h-full w-full bg-background/70">
          <Loading text="Erasing Dashboard..." />
        </div>
      )}
    </div>
  )
}
