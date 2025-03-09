import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateScalingFactorPercent, DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { WidgetStyleContainerNoPadding } from '@/features/shared/widget-container'
import { NewsWidgetProps } from '@/features/widget/news/view/widget'
import { Size } from '@/lib/widget-types'
import { Dispatch, RefObject, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react'

const nativeSize: Size = {
  width: 4,
  height: 4,
}

const handleResize = (
  containerRef: RefObject<HTMLDivElement | null>,
  setContainerHeight: Dispatch<SetStateAction<number>>,
  setVisibleItems: Dispatch<SetStateAction<number>>,
) => {
  if (containerRef.current) {
    setContainerHeight(containerRef.current.offsetHeight)
  }
  if (window.innerWidth < 640) setVisibleItems(2)
  else if (window.innerWidth < 1024) setVisibleItems(3)
  else setVisibleItems(4)
}

export const NewsWidgetDetail1 = ({ args }: NewsWidgetProps) => {
  const { data, currentSize } = args
  const containerRef = useRef<HTMLDivElement>(null)

  const [visibleItems, setVisibleItems] = useState(3)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const resize = () => handleResize(containerRef, setContainerHeight, setVisibleItems)
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [])

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight)
    }
  }, [])

  return (
    <div ref={containerRef} className="h-full overflow-hidden">
      <div className="mb-4 flex items-center">
        <img
          src={data.iconUrl}
          alt="Logo"
          className="mr-[2%]"
          style={{
            width: `${calculateScalingFactorPercent({ currentSize, nativeSize }) * 0.14}%`,
            height: `${calculateScalingFactorPercent({ currentSize, nativeSize }) * 0.14}%`,
          }}
        />
        <h2 className="font-bold">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {data.sourceName}
          </DynamicTextsize>
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 overflow-hidden lg:grid-cols-2">
        {data.description.slice(0, visibleItems).map(({ title, url }, index) => (
          <div key={index} style={{ height: `${(containerHeight * 0.35) / ((visibleItems % 4) * 0.4 + 1)}px` }}>
            <WidgetStyleContainerNoPadding>
              <h3 className="p-0.5 text-[120%] font-semibold">
                {!url || url.length < 5 ? (
                  <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                    {title}
                  </DynamicTextsize>
                ) : (
                  <a href={url.length == 0 ? undefined : url} target="_blank" rel="noopener noreferrer" className="bg-link hover:underline">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      {title}
                    </DynamicTextsize>
                  </a>
                )}
              </h3>
            </WidgetStyleContainerNoPadding>
          </div>
        ))}
      </div>
    </div>
  )
}

export const NewsWidgetDetail1Loading = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [visibleItems, setVisibleItems] = useState(3)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const resize = () => handleResize(containerRef, setContainerHeight, setVisibleItems)
    window.addEventListener('resize', resize)
    resize()
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div ref={containerRef} className="w-full p-4">
      <div className="mb-4 flex items-center">
        <Skeleton className="mr-2 h-8 w-8" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: visibleItems }).map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden shadow-md"
            style={{ height: `${(containerHeight * 0.35) / ((visibleItems % 2) * 0.4 + 1)}px` }}
          >
            <CardContent className="p-4">
              <Skeleton className="mb-2 h-6" />
              <Skeleton className="h-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
