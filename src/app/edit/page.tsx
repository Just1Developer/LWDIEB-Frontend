export const dynamic = 'force-dynamic'

import { EditDashboardClientPage } from '@/app/edit/client-edit-page'

export const metadata = {
  title: 'DIEB - Dashboard - Editing',
  description: 'Customize your own dashboard',
}

export default function EditPage() {
  return <EditDashboardClientPage />
}
