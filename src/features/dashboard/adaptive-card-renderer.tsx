'use client'

import { AdaptiveCard } from 'adaptivecards-react'
import { FC } from 'react'

interface NativeRenderAdaptiveCardProps {
  card: Record<string, any>
  data?: Record<string, any>
}

const inheritHostConfig = {
  fontFamily: 'inherit',
  containerStyles: {
    default: {
      foregroundColors: {
        default: {
          default: 'inherit',
          subtle: 'inherit',
        },
      },
      backgroundColor: 'transparent',
    },
  },
}

export const NativeRenderAdaptiveCard: FC<NativeRenderAdaptiveCardProps> = ({ card }) => {
  return <AdaptiveCard payload={card} hostConfig={inheritHostConfig} />
}
