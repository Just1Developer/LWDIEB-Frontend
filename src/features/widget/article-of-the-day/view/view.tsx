import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { WikipediaWidgetProps } from '@/features/widget/article-of-the-day/view/widget'
import { rgba } from '@/lib/theme-helpers'
import { useLayoutEffect, useRef, useState } from 'react'

export const WikiArticleWidgetNativeSize = {
  width: 3,
  height: 3,
}

export const WikipediaWidgetView =
  ({ showButton, showDescription }: { showButton: boolean; showDescription: boolean }) =>
  ({ args }: WikipediaWidgetProps) => {
    const { data, currentSize } = args
    const { image, title, extract, url } = data
    const { theme } = useUserData()
    const nativeSize = WikiArticleWidgetNativeSize

    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)

    useLayoutEffect(() => {
      if (containerRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          if (containerRef.current) {
            setContainerHeight(containerRef.current.offsetHeight)
            setContainerWidth(containerRef.current.offsetWidth)
          }
        })
        resizeObserver.observe(containerRef.current)

        return () => resizeObserver.disconnect()
      }
    }, [])

    if (!data) {
      return (
        <div className="mx-auto my-8 max-w-xl p-6 text-center">
          <h2 className="mb-2 text-2xl font-semibold">Article not found</h2>
          <p className="mb-4">We could not find any Wikipedia Article of the day.</p>
          <div className="">😢</div>
        </div>
      )
    }

    return (
      <div ref={containerRef} className="flex h-full w-full flex-col items-center justify-center shadow-lg">
        {image && (
          <img
            src={image}
            alt={title.replace(/_/g, ' ')}
            className="mb-0.5 rounded"
            style={{
              width: `clamp(1px, ${containerWidth * 0.2}px, 300px)`,
              height: `clamp(1px, ${containerHeight * 0.2}px, 300px)`,
              objectFit: 'contain',
            }}
          />
        )}
        <div className="mb-0.5 text-center font-semibold" style={{ fontSize: showDescription ? '100%' : '150%' }}>
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {title.replace(/_/g, ' ')}
          </DynamicTextsize>
        </div>
        {showDescription && (
          <div className="mb-2 text-center text-[75%]" style={{ color: rgba(theme.foregroundText, 0.9) }}>
            <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
              {extract}
            </DynamicTextsize>
          </div>
        )}
        {showButton && (
          <Button onClick={() => window.open(url, '_blank')} className="w-[70%]">
            <div className="text-100%">
              <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                Read more on Wikipedia ↗
              </DynamicTextsize>
            </div>
          </Button>
        )}
      </div>
    )
  }

export const WikipediaWidgetViewLoading =
  ({ showButton, showDescription }: { showButton: boolean; showDescription: boolean }) =>
  () => {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center shadow-lg">
        <Skeleton className="mb-2 h-[15%] w-[80%]" />
        {showDescription && <Skeleton className="mb-2 h-[50%] w-[80%]" />}
        {showButton && <Skeleton className="mb-2 h-[10%] w-[75%]" />}
      </div>
    )
  }
