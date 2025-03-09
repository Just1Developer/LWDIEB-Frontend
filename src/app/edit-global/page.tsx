import { GlobalEditDashboardClientPage } from '@/app/edit-global/client-edit-page'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'DIEB - Editing Dashboard',
  description: 'Customize your own dashboard',
}

export default function EditPage() {
  return <GlobalEditDashboardClientPage />
}
