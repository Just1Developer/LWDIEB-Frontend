import { ResponsiveDialog } from '@/components/responsive-dialog'
import { CommonEditWidgetProps } from '@/features/edit-dashboard/formless-editable-widget'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { AdaptiveCardsEditWidgetProps } from '@/features/widget/adaptive-cards/edit/widget'
import { Size } from '@/lib/widget-types'
import React, { ChangeEvent } from 'react'

interface OpenEditorProps extends CommonEditWidgetProps {
  title: string
  defaultValue: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  editorCallback: () => void
}

const nativeSize: Size = {
  width: 3,
  height: 3,
}

export const openEditor = ({ setDialog, title, defaultValue, onChange, editorCallback }: OpenEditorProps) => {
  setDialog(
    <ResponsiveDialog callbackAction={editorCallback} title={title} type="text" setDialogAction={setDialog}>
      <div className="h-[80%] w-full p-3 pb-12">
        <textarea className="h-full w-full" onResize={(e) => e.preventDefault()} defaultValue={defaultValue} onChange={onChange} />
      </div>
    </ResponsiveDialog>,
  )
}

export const AdaptiveCardsWidgetDetailEdit = ({ args, updateFn, setDialog, currentSize, ...rest }: AdaptiveCardsEditWidgetProps) => {
  const { adaptiveCard } = args
  const contentRef = React.useRef(adaptiveCard)

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    if (newContent) {
      contentRef.current = newContent
    } else {
      contentRef.current = ''
    }
  }

  const editorCallback = () => {
    const newArgs = {
      ...args,
      adaptiveCard: contentRef.current,
    }
    updateFn({ args: newArgs })
  }

  const open = () =>
    openEditor({
      setDialog,
      title: 'Edit AdaptiveCards Configuration',
      defaultValue: adaptiveCard,
      onChange,
      editorCallback,
      currentSize,
      ...rest,
    })

  return (
    <div className="h-full w-full pb-12">
      <div className="flex h-full w-full cursor-pointer flex-col items-center justify-between space-y-2 p-1 pb-12" onClick={open}>
        <div className="text-[110%] font-semibold">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            Edit AdaptiveCards Configuration
          </DynamicTextsize>
        </div>
        <div className="flex h-full w-full flex-col justify-between pb-12">
          <div className="h-full w-full p-1 pr-4">
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              <textarea className="h-[90%] w-full cursor-pointer" defaultValue={adaptiveCard} onResize={(e) => e.preventDefault()} />
            </DynamicTextsize>
          </div>
          {currentSize.height >= 2 && (
            <div className="z-[-1] min-h-6 w-full -translate-y-[150%] text-sm text-gray-500">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                We cannot guarantee that the rendered adaptive card will fit into the dashboard style.
              </DynamicTextsize>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
