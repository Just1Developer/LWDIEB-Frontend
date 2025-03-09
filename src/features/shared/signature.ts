'use server'

import { DoubleSignedSkeletonDashboard, EditDashboard, Signature, SignedSkeletonDashboard } from '@/lib/types'
import { toSingleSignedDashboard, toUnsignedWidget } from '@/lib/utils'
import { EditWidget, SignedSkeletonWidget } from '@/lib/widget-types'
import Long from 'long'

export const signDashboard = async ({ dashboard }: { dashboard: EditDashboard }): Promise<string> => {
  const skeleton: SignedSkeletonDashboard = {
    gridHeight: dashboard.gridHeight,
    gridWidth: dashboard.gridWidth,
    widgets: await Promise.all(dashboard.widgets.map((widget) => signWidget({ widget }))),
  }
  // Recursively sort properties inside widgets
  const sortedSkeleton = sortObjectRecursively(skeleton)
  const signatureLong = calculateSignature({ data: JSON.stringify(sortedSkeleton) })
  const signature: Signature = { upperHalf: signatureLong.getHighBitsUnsigned(), lowerHalf: signatureLong.getLowBitsUnsigned() }
  return JSON.stringify({
    ...sortedSkeleton,
    signature,
  })
}

// eslint-disable-next-line @typescript-eslint/require-await
export const signWidget = async ({ widget }: { widget: EditWidget }): Promise<SignedSkeletonWidget> => {
  const widgetNoComponents = toUnsignedWidget({ widget })
  const sortedWidget = sortObjectRecursively(widgetNoComponents)
  // Unverified widgets are disabled here
  const signatureLong = widget.enabled ? calculateSignature({ data: JSON.stringify(sortedWidget) }) : Long.fromNumber(0)
  const signature: Signature = { upperHalf: signatureLong.getHighBitsUnsigned(), lowerHalf: signatureLong.getLowBitsUnsigned() }
  return {
    ...widgetNoComponents,
    signature: signature,
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export const verifySignature = async ({ widget }: { widget: SignedSkeletonWidget }) => {
  const skeleton = toUnsignedWidget({ widget })
  const sortedSkeleton = sortObjectRecursively(skeleton)
  const signature = calculateSignature({ data: JSON.stringify(sortedSkeleton) })
  return signature.getLowBitsUnsigned() == widget.signature.lowerHalf && signature.getHighBitsUnsigned() == widget.signature.upperHalf
}

// eslint-disable-next-line @typescript-eslint/require-await
export const verifyDashboardSignature = async ({ dashboard }: { dashboard: DoubleSignedSkeletonDashboard }) => {
  const skeleton = toSingleSignedDashboard({ dashboard })
  const sortedSkeleton = sortObjectRecursively(skeleton)
  const signature = calculateSignature({ data: JSON.stringify(sortedSkeleton) })
  return (
    signature.getLowBitsUnsigned() === dashboard.signature.lowerHalf && signature.getHighBitsUnsigned() === dashboard.signature.upperHalf
  )
}

const calculateSignature = ({ data }: { data: string }) => {
  const first = generateHash({ data: data.substring(0, Math.floor(data.length / 3)) })
  const second = generateHash({ data: data.substring(Math.floor(data.length / 4), Math.round(data.length / 1.5)) })
  const third = generateHash({ data: data.substring(Math.floor(data.length / 2), data.length - Math.floor(data.length / 4)) })
  const fourth = generateHash({ data: data.substring(Math.floor(data.length / 3), data.length - Math.floor(data.length / 5) - 1) })
  const signature = first.mul(second).mul(third).mul(fourth).add(third.mul(fourth))
  return signature.equals(Long.fromNumber(0)) ? Long.fromNumber(1) : signature
}

const generateHash = ({ data }: { data: string }) => {
  const numbers = data.split('').map((char) => Long.fromNumber(char.charCodeAt(0) ?? 0).shiftLeft(2))
  let product = Long.fromInt(1, false)
  let long: Long
  for (long of numbers) {
    product = product.mul(long.add(long.shiftLeft(2)).shiftRight(1))
    product = product.add(long.add(long.shiftLeft(7)).shiftRight(2))
  }
  return product
}

const sortObjectRecursively = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectRecursively)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, any>>((sortedObj, key) => {
        sortedObj[key] = sortObjectRecursively(obj[key])
        return sortedObj
      }, {})
  }
  return obj
}
