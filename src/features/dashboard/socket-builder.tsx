'use client'

import { useUserData } from '@/features/shared/user-provider'
import { AvailableThemes } from '@/lib/types'
import { useEffect, useRef } from 'react'
import { COMMAND_REFRESH_DASHBOARD, COMMAND_REFRESH_THEMES } from '@/configuration/ws-communication-commands'
import { env } from '@/env.mjs'

interface SocketMessageProps {
  status?: string
  command?: string
  selectedTheme?: AvailableThemes
}

export const SocketConnection = () => {
  const { setThemeLocally } = useUserData()
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // If we already have a socket, don't create another one
    if (socketRef.current) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const socketUrl = `${protocol}//${env.NEXT_PUBLIC_SOCKET_HOST}/ws`
    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onmessage = (event) => {
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

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [])

  return <></>
}
