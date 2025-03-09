import { EditWidget, SignedSkeletonWidget, SkeletonWidget } from '@/lib/widget-types'

export type AvailableThemes = 'dark' | 'light'

export interface UserData {
  user: User | undefined
  selectedTheme: AvailableThemes
  darkTheme: Theme // is string in response, just parse / stringify JSON
  lightTheme: Theme // is string in response, just parse / stringify JSON
}

export interface User {
  name: string
  id: string
  email: string
  admin: boolean
  language: string
}

export interface Theme {
  // Hex
  backgroundBoard: string
  backgroundWidget: string
  backgroundButton: string
  foregroundButton: string
  foregroundText: string
  foregroundOther: string
  accent: string
  accentForeground: string
}

export interface SkeletonDashboard {
  gridWidth: number
  gridHeight: number
  widgets: SkeletonWidget[]
}

export interface Signature {
  upperHalf: number
  lowerHalf: number
}

export interface SignedSkeletonDashboard extends SkeletonDashboard {
  widgets: SignedSkeletonWidget[]
}

export interface DoubleSignedSkeletonDashboard extends SignedSkeletonDashboard {
  signature: Signature
}

export interface EditDashboard {
  gridWidth: number
  gridHeight: number
  widgets: EditWidget[]
}
