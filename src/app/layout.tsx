import { Provider } from '@/components/provider'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DIEB - Dashboard',
  description: 'Dashboard for Insights and Everyday Briefing',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'transition-colors duration-300')}>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
