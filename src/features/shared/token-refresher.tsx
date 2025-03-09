'use client'

import { cookieRefreshTime } from '@/configuration/cookie-settings'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { v4 } from 'uuid'

export const TokenRefresher = () => {
  const { refetch } = useQuery({
    queryFn: async () => {
      const res = await fetch('/api/auth/refresh', {
        credentials: 'include',
      })
      return res.json()
    },
    queryKey: [cn('token', v4())],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      void refetch()
    }, cookieRefreshTime * 1000)

    return () => clearInterval(interval)
  })

  return <></>
}
