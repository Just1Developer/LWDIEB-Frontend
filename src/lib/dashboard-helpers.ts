import { constructEditWidget } from '@/features/shared/widget-client-factories'
import { EditDashboard, SignedSkeletonDashboard } from '@/lib/types'

export const getEditDashboard = ({ signedSkeletonDashboard }: { signedSkeletonDashboard: SignedSkeletonDashboard }) => {
  const editDashboard: EditDashboard = {
    gridHeight: signedSkeletonDashboard.gridHeight,
    gridWidth: signedSkeletonDashboard.gridWidth,
    widgets: signedSkeletonDashboard.widgets.map((widget) => constructEditWidget({ widget })),
  }
  return editDashboard
}
