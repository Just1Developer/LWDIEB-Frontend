'use client'

import { useUserData } from '@/features/shared/user-provider'
import { AvailableThemes } from '@/lib/types'
import { useEffect, useRef } from 'react'
import { COMMAND_REFRESH_DASHBOARD, COMMAND_REFRESH_THEMES } from '@/configuration/ws-communication-commands'
import { env } from '@/env.mjs'
import { hasDBDashboard } from '@/lib/dashboard-db-access'

interface SocketMessageProps {
  status?: string
  command?: string
  selectedTheme?: AvailableThemes
}

export const SocketConnection = () => {
  const { setThemeLocally, userId } = useUserData()
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // If we already have a socket, don't create another one
    if (socketRef.current) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    hasDBDashboard({ userId }).then((hasDashboard) => {
      const socketUrl = `${protocol}//${env.NEXT_PUBLIC_SOCKET_HOST}/ws?uuid=${encodeURIComponent(userId)}&connectDefault=${hasDashboard}`
      const socket = new WebSocket(socketUrl)
      socketRef.current = socket

      socket.onmessage = (event) => {
        console.log('Received message', event.data)
        try {
          const message = JSON.parse(event.data) as SocketMessageProps
          if (message.command === COMMAND_REFRESH_DASHBOARD || message.command === COMMAND_REFRESH_THEMES) {
            window.location.reload()
          }
          if (message.selectedTheme) {
            try {
              setThemeLocally(message.selectedTheme)
            } catch (_) {}
          }
        } catch (_) {}
      }

      socket.onclose = () => {
        socketRef.current = null
      }
    })

    return () => {
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [])

  return <></>
}
