import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
)

export { Skeleton }
