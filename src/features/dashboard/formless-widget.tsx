'use client'
import { WidgetArguments, WidgetDataArguments, WidgetSkeletonArguments } from '@/lib/argument-types'
import { cn } from '@/lib/utils'
import { Size } from '@/lib/widget-types'
import { useQuery } from '@tanstack/react-query'
import { ComponentType, useMemo, useState } from 'react'

export interface CommonViewWidgetProps {
  currentSize: Size
}

interface WidgetLevelOfDetailProps<TArgs extends WidgetSkeletonArguments, TData extends WidgetDataArguments> {
  component: ComponentType<{ args: WidgetArguments<TArgs, TData> }>
  loadingState: ComponentType<{ args: TArgs; commons: CommonViewWidgetProps }>
}

interface WidgetProps<TArgs extends WidgetSkeletonArguments, TData extends WidgetDataArguments> {
  refreshRate?: number
  queryKey?: string
  queryAction?: ({ args }: { args: TArgs }) => Promise<TData>
  arguments: TArgs
  levelsOfDetail: WidgetLevelOfDetailProps<TArgs, TData>[]
  currentSize: Size
}

const FAILED_REFRESH_RATE = 500

export const FormlessWidget = <TArgs extends WidgetSkeletonArguments, TData extends WidgetDataArguments>({
  refreshRate: refreshRateUncapped,
  queryKey,
  queryAction,
  arguments: widgetArgs,
  levelsOfDetail,
  currentSize,
}: WidgetProps<TArgs, TData>) => {
  const lodIndex = Math.max(0, Math.min(widgetArgs.levelOfDetail, levelsOfDetail.length - 1))
  const WidgetRenderComponent = levelsOfDetail[lodIndex]
  const regularRefreshRate = Math.max(1000, refreshRateUncapped ?? 0)
  const [refreshRate, setRefreshRate] = useState(regularRefreshRate)

  if (!WidgetRenderComponent) {
    return DefaultWidget()
  }

  const Component = WidgetRenderComponent.component
  const LoadingComponent = WidgetRenderComponent.loadingState

  const key = useMemo(() => [cn(queryKey, '-', JSON.stringify(widgetArgs))], [queryKey, widgetArgs])
  const { data, isLoading } =
    queryAction && queryKey
      ? useQuery({
          queryFn: async () => {
            const result = await queryAction({ args: widgetArgs })
            if (!result) setRefreshRate(FAILED_REFRESH_RATE)
            else if (refreshRate === FAILED_REFRESH_RATE) setRefreshRate(regularRefreshRate)
            return result
          },
          queryKey: key,
          refetchOnReconnect: true,
          refetchInterval: refreshRate,
          staleTime: refreshRate - 800,
        })
      : ({ data: {}, isLoading: false } as {
          data: TData
          isLoading: boolean
        })

  return (
    <>
      {isLoading || !data ? (
        <LoadingComponent args={widgetArgs} commons={{ currentSize }} />
      ) : (
        <Component args={{ dataFetchArgs: widgetArgs, data, currentSize }} />
      )}
    </>
  )
}

export const DefaultWidget = () => {
  return (
    <>
      <div className="text-6xl font-semibold text-red-800">Error</div>
    </>
  )
}
