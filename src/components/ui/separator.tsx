'use client'

import { useUserData } from '@/features/shared/user-provider'
import { cn } from '@/lib/utils'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'

const Separator = forwardRef<ComponentRef<typeof SeparatorPrimitive.Root>, ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    const { theme } = useUserData()
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn('shrink-0', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
        style={{ borderColor: theme.accent }}
        {...props}
      />
    )
  },
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
