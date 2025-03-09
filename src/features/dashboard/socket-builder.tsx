'use client'

import { useUserData } from '@/features/shared/user-provider'
import { AvailableThemes } from '@/lib/types'
import { useEffect, useRef } from 'react'

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
    const socketUrl = `${protocol}//${window.location.host}/ws`
    const socket = new WebSocket(socketUrl)
    socketRef.current = socket

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as SocketMessageProps
        if (message.command === 'refreshDashboard' || message.command === 'refreshSettings') {
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
