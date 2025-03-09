import { Badge } from '@/components/ui/badge'
import { openEditor } from '@/features/widget/adaptive-cards/edit/details-edit'
import { AdaptiveCardsEditWidgetProps } from '@/features/widget/adaptive-cards/edit/widget'
import React, { ChangeEvent } from 'react'

export const AdaptiveCardsWidgetDetailEditData = ({ args, updateFn, setDialog, ...rest }: AdaptiveCardsEditWidgetProps) => {
  const { adaptiveCard, adaptiveCardData } = args
  const templateRef = React.useRef(adaptiveCard)
  const dataRef = React.useRef(adaptiveCardData)

  const onChangeTemplate = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newTemplate = e.target.value
    if (newTemplate) {
      templateRef.current = newTemplate
    } else {
      templateRef.current = ''
    }
  }

  const onChangeData = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newData = e.target.value
    if (newData) {
      dataRef.current = newData
    } else {
      dataRef.current = ''
    }
  }

  const editorCallbackTemplate = () => {
    const newArgs = {
      ...args,
      adaptiveCard: templateRef.current,
    }
    updateFn({ args: newArgs })
  }

  const editorCallbackData = () => {
    const newArgs = {
      ...args,
      adaptiveCardData: dataRef.current,
    }
    updateFn({ args: newArgs })
  }

  return (
    <div className="h-full w-full space-y-2 p-1 pb-12">
      Edit AdaptiveCards Configuration
      <div className="h-full w-full space-y-2 p-1 pb-14 pr-4">
        <Badge className="text-sm">Template JSON:</Badge>
        <textarea
          className="h-[37%] w-full"
          defaultValue={adaptiveCard}
          onClick={() =>
            openEditor({
              setDialog,
              title: 'Edit AdaptiveCards Template',
              defaultValue: adaptiveCard,
              onChange: onChangeTemplate,
              editorCallback: editorCallbackTemplate,
              ...rest,
            })
          }
        />
        <Badge className="text-sm">Data JSON:</Badge>
        <textarea
          className="h-[37%] w-full"
          defaultValue={adaptiveCardData}
          onClick={() =>
            openEditor({
              setDialog,
              title: 'Edit AdaptiveCards Data',
              defaultValue: adaptiveCardData,
              onChange: onChangeData,
              editorCallback: editorCallbackData,
              ...rest,
            })
          }
        />
      </div>
      <div className="min-h-6 w-full -translate-y-[150%] text-sm text-gray-500">
        We cannot guarantee that the rendered adaptive card will fit into the dashboard style.
      </div>
    </div>
  )
}
