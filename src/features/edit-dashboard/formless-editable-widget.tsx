'use client'

import { LocationPickerProps } from '@/features/edit-dashboard/editgrid'
import { WidgetSkeletonArguments } from '@/lib/argument-types'
import { EditableComponent, MinimumSize, Size } from '@/lib/widget-types'
import React, { ComponentType, Dispatch, ReactNode, SetStateAction } from 'react'

export interface WidgetProps<TArgs extends WidgetSkeletonArguments> {
  LevelOfDetail: ComponentType<{
    args: TArgs
    updateFn: ({ args }: { args: TArgs }) => void
    setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
    canFetch: boolean
    currentSize: Size
  }>
}

export interface FormlessEditableComponent<TArgs extends WidgetSkeletonArguments> {
  minimumSize: MinimumSize
  component: ComponentType<{
    args: TArgs
    updateFn: ({ args }: { args: TArgs }) => void
    setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
    canFetch: boolean
    currentSize: Size
  }>
}

export interface CommonEditWidgetProps {
  setDialog: Dispatch<SetStateAction<ReactNode | LocationPickerProps>>
  canFetch: boolean
  currentSize: Size
}

export interface FormlessEditableComponentProps<TArgs extends WidgetSkeletonArguments> extends CommonEditWidgetProps {
  args: TArgs
  updateFn: ({ args }: { args: TArgs }) => void
}

interface FormlessEditableComponentResult<TArgs extends WidgetSkeletonArguments> {
  componentFn: ({ args, updateFn, setDialog, canFetch }: FormlessEditableComponentProps<TArgs>) => React.JSX.Element
}

export const FormlessEditableWidget = <TArgs extends WidgetSkeletonArguments>({
  LevelOfDetail,
}: WidgetProps<TArgs>): FormlessEditableComponentResult<TArgs> => ({
  componentFn: ({ args, updateFn, setDialog, currentSize }: FormlessEditableComponentProps<TArgs>) => {
    return <LevelOfDetail args={args} updateFn={updateFn} setDialog={setDialog} canFetch={false} currentSize={currentSize} />
  },
})

/**
 * Turns a generic FormlessEditableComponentResult<TArgs extends WidgetSkeletonArgs> into a non-generic EditableComponent for
 * the return call to the factory.
 * This function internally uses a `props.args as unknown as TArgs` cast. While this is not statically typesafe, it is typesafe
 * at runtime, since our structure should ensure that widgets of type T always have arguments with the appropriate structure.
 * <br/><br/>
 * If this is not the case, something else has gone wrong and the dashboard configuration is invalid anyway.
 * @param result The result of the FormlessEditableWidget call.
 * @param minimumSize The minimum size.
 * @return A non-generic EditableWidget.
 */
export const toEditableComponent = <TArgs extends WidgetSkeletonArguments>({
  result,
  minimumSize,
}: {
  result: FormlessEditableComponentResult<TArgs>
  minimumSize: MinimumSize
}): EditableComponent => {
  return {
    minimumSize: minimumSize,
    component: ({ args, ...rest }: FormlessEditableComponentProps<WidgetSkeletonArguments>) =>
      result.componentFn({
        ...rest,
        args: args as unknown as TArgs,
      }),
  }
}

export const DefaultEditableWidget = (): EditableComponent[] => {
  return [
    {
      component: DefaultEditableSingleWidget,
      minimumSize: {
        name: 'Minimal Information',
        width: 1,
        height: 1,
      },
    },
  ].map(
    ({ component: DefaultComponent, minimumSize }): EditableComponent =>
      toEditableComponent({
        result: FormlessEditableWidget({
          // Level of detail in args doesn't *need* to be passed here, we're fine to remove it.
          // We only have one level of detail, so whatever number is there, will get clamped to 0 anyway.
          LevelOfDetail: ({ args }: { args: WidgetSkeletonArguments; updateFn: ({ args }: { args: WidgetSkeletonArguments }) => void }) => {
            return <DefaultComponent args={args} />
          },
        }),
        minimumSize: minimumSize,
      }),
  )
}

export const DefaultEditableSingleWidget = ({}: { args: WidgetSkeletonArguments }) => {
  return <div className="text-3xl font-semibold text-red-600">Unknown Widget Type</div>
}
