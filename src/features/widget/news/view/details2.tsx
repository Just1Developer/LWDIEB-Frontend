import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateScalingFactorPercent, DynamicTextsize } from '@/features/shared/dynamic-textsize'
import { useUserData } from '@/features/shared/user-provider'
import { WidgetStyleContainerNoPadding } from '@/features/shared/widget-container'
import { NewsWidgetProps } from '@/features/widget/news/view/widget'
import { rgba } from '@/lib/theme-helpers'
import { Size } from '@/lib/widget-types'
import { useEffect, useRef, useState } from 'react'

const nativeSize: Size = {
  width: 6,
  height: 6,
}

export const NewsWidgetDetail2 = ({ args }: NewsWidgetProps) => {
  const { data, currentSize } = args
  const { theme } = useUserData()
  const containerRef = useRef<HTMLDivElement>(null)

  const [visibleItems, setVisibleItems] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleItems(2)
      else if (window.innerWidth < 1024) setVisibleItems(3)
      else setVisibleItems(4)
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div ref={containerRef} className="h-full space-y-2 overflow-hidden">
      <div className="flex items-center">
        <img
          src={data.iconUrl}
          alt="Logo"
          className="mr-[2%]"
          style={{
            width: `${calculateScalingFactorPercent({ currentSize, nativeSize }) * 0.11}%`,
            height: `${calculateScalingFactorPercent({ currentSize, nativeSize }) * 0.11}%`,
          }}
        />
        <h2 className="text-[150%] font-bold">
          <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
            {data.sourceName}
          </DynamicTextsize>
        </h2>
      </div>
      <div className="grid h-[82%] w-full grid-cols-1 grid-rows-1 gap-2 lg:grid-cols-2 lg:grid-rows-2">
        {args.data.description.slice(0, visibleItems).map(({ title, url, description }, index) => (
          <div key={index} className="max-h-full max-w-full">
            <WidgetStyleContainerNoPadding>
              <h3 className="p-0.5 text-[120%] font-semibold">
                {!url || url.length < 5 ? (
                  <span className="text-[110%] text-blue-600">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      {title}
                    </DynamicTextsize>
                  </span>
                ) : (
                  <a href={url.length == 0 ? undefined : url} target="_blank" rel="noopener noreferrer" className="bg-link hover:underline">
                    <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                      {title}
                    </DynamicTextsize>
                  </a>
                )}
              </h3>
              <div className="pt-[3%] text-[97%]" style={{ color: rgba(theme.foregroundText, 0.8) }}>
                <DynamicTextsize currentSize={currentSize} nativeSize={nativeSize}>
                  <span style={{ lineHeight: '110%' }}>{description}</span>
                </DynamicTextsize>
              </div>
            </WidgetStyleContainerNoPadding>
          </div>
        ))}
      </div>
    </div>
  )
}

export const NewsWidgetDetail2Loading = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [visibleItems, setVisibleItems] = useState(3)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight)
      }
      if (window.innerWidth < 640) setVisibleItems(2)
      else if (window.innerWidth < 1024) setVisibleItems(3)
      else setVisibleItems(4)
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
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
