import { cn } from '@/lib/utils'
import Image from 'next/image'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLImageElement> {
  px?: number
  priority?: boolean
}

export const CompanyLogo = ({ px = 100, className, priority = false, ...props }: Props) => {
  return (
    <div className={cn('f-box', className)} style={{ width: px, height: px }} {...props}>
      <Image className={cn(className)} src="/dieb-logo-glow.png" width={px} height={px} alt="Logo" priority={priority} />
    </div>
  )
}
