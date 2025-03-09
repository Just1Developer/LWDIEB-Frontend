'use client'

import { DefaultEditWidgetFactoryRegister } from '@/configuration/widget-register/widget-defaults'
import { EditWidgetFactoryRegister } from '@/configuration/widget-register/widget-edits'
import { validateWidgetArguments } from '@/configuration/widget-register/widget-validators'
import { ViewWidgetFactoryRegister } from '@/configuration/widget-register/widget-views'
import { DefaultWidget } from '@/features/dashboard/formless-widget'
import { DefaultEditableWidget } from '@/features/edit-dashboard/formless-editable-widget'
import { EditWidget, Size, SkeletonWidget, Widget } from '@/lib/widget-types'

interface WidgetFactoryProps {
  widget: SkeletonWidget
}

export const constructWidget = ({ widget }: WidgetFactoryProps): Widget => {
  const { type, args, width, height } = widget
  const size: Size = { width, height }

  const ReactComponent = ViewWidgetFactoryRegister({ type })
  const component = ReactComponent ? <ReactComponent args={args} size={size} /> : <DefaultWidget />

  return {
    ...widget,
    component,
  }
}

export const constructEditWidget = ({ widget }: WidgetFactoryProps): EditWidget => {
  const { type, args, width, height } = widget

  const components = EditWidgetFactoryRegister({ type }) ?? DefaultEditableWidget()

  return {
    ...widget,
    enabled: true,
    initiallyValid: validateWidgetArguments({ type, args, size: { width, height } }),
    components: components,
  }
}

export const constructDefaultEditWidget = ({ widgetType }: { widgetType: string }): EditWidget => {
  const { components, args } = DefaultEditWidgetFactoryRegister({ widgetType }) ?? {
    components: DefaultEditableWidget(),
    args: { levelOfDetail: 0 },
  }

  return {
    type: widgetType,
    args,
    components: components,
    // These 5 properties will be ignored (overridden), but they need to exist
    id: widgetType,
    positionX: 0,
    positionY: 0,
    width: 0,
    height: 0,
    enabled: true,
    initiallyValid: true, // only has effect when edit dashboard is loaded
  }
}
