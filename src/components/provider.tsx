'use client'

import { TokenRefresher } from '@/features/shared/token-refresher'
import { UserProvider } from '@/features/shared/user-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { type PropsWithChildren } from 'react'

export const Provider = ({ children }: Readonly<PropsWithChildren>) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <UserProvider>
          <TokenRefresher />
          {children}
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
