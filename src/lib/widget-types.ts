import { FormlessEditableComponentProps } from '@/features/edit-dashboard/formless-editable-widget'
import { WidgetSkeletonArguments } from '@/lib/argument-types'
import { Signature } from '@/lib/types'
import React from 'react'

export interface SkeletonWidget {
  id: string
  width: number // in grid cells
  height: number // in grid cells
  positionX: number // in cell units (1-based)
  positionY: number // in cell units (1-based)
  type: string
  args: WidgetSkeletonArguments
}

export interface SignedSkeletonWidget extends SkeletonWidget {
  signature: Signature
}

export interface WidgetPreview {
  component: React.ReactNode
  widgetType: string
  widgetName: string
}

export interface Widget {
  id: string
  width: number // in grid cells
  height: number // in grid cells
  positionX: number // in cell units (1-based)
  positionY: number // in cell units (1-based)
  component: React.ReactNode
}

export interface Size {
  width: number
  height: number
}

export interface MinimumSize extends Size {
  name: string // The name, for example "2 Gleise", such that we can display (in dropdown): "2 Gleise (min. 3x2)"
}

export interface EditableComponent {
  minimumSize: MinimumSize
  component: ({ args, updateFn, setDialog, canFetch }: FormlessEditableComponentProps<WidgetSkeletonArguments>) => React.ReactNode
}

export interface EditWidget {
  id: string
  width: number // in grid cells
  height: number // in grid cells
  positionX: number // in cell units (1-based)
  positionY: number // in cell units (1-based)
  type: string
  enabled: boolean
  initiallyValid: boolean
  args: WidgetSkeletonArguments // used for extracting LOD client-side
  components: EditableComponent[]
}
