import { useEffect, useRef } from 'react'
import type { MonitorWithLatestResult } from '@/types/monitorTypes'

interface UseMonitorSocketOptions {
  organizationId: string
  onMonitorUpdate: (monitor: MonitorWithLatestResult) => void
}

export function useMonitorSocket({ organizationId, onMonitorUpdate }: UseMonitorSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!organizationId) return

    let reconnectAttempts = 0
    let isUnmounted = false

    const connect = () => {
      // console.log('[WS] Attempting to connect with organizationId:', organizationId)
      const ws = new WebSocket(`ws://localhost:8001/ws/monitors/${organizationId}`)
      wsRef.current = ws

      ws.onopen = () => {
        // console.log('[WS] Connected for monitor updates')
        reconnectAttempts = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'monitor_update' && data.payload.latestResult?.responseTimeMs !== null) {
            // console.log('[WS] Monitor update received:', data.payload.latestResult?.responseTimeMs)
            onMonitorUpdate(data.payload)
          } else {
            // console.log('[WS] Ignored message (null payload or non-update type):', data)
          }
        } catch (error) {
          console.error('[WS] Error parsing message:', error)
        }
      }

      ws.onclose = () => {
        // console.log('[WS] Connection closed')
        if (isUnmounted) return
        reconnectAttempts += 1
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000) // max 10s
        // console.log(`[WS] Reconnecting in ${delay / 1000}s...`)
        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }

      ws.onerror = (error) => {
        console.error('[WS] Error:', error)
        ws.close()
      }
    }

    connect()

    return () => {
      isUnmounted = true
      wsRef.current?.close()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [organizationId, onMonitorUpdate])
}
