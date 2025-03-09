import { ThemesClientPage } from '@/app/profile/client-profile-page'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'DIEB - Editing User Profile',
  description: 'Customize your profile and themes',
}

export default function Profile() {
  return <ThemesClientPage />
}
