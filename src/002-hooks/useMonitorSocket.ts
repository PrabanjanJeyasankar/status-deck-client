// File: hooks/useMonitorSocket.ts

import { useEffect, useRef } from 'react'
import type { MonitorWithLatestResult } from '@/types/monitorTypes'

interface UseMonitorSocketOptions {
  organizationId: string
  onMonitorUpdate: (monitor: MonitorWithLatestResult) => void
}

/**
 * Establishes and maintains a WebSocket connection for monitor updates per organization.
 * Handles reconnects with exponential backoff.
 * Automatically cleans up on component unmount or organizationId change.
 */
export function useMonitorSocket({ organizationId, onMonitorUpdate }: UseMonitorSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!organizationId) return

    let reconnectAttempts = 0
    let isUnmounted = false

    const connect = () => {
      console.log('[WS] Connecting to monitor updates for organization:', organizationId)
      const ws = new WebSocket(`${import.meta.env.VITE_MONITOR_WS_URL}/${organizationId}`)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[WS] Connection established for organization:', organizationId)
        reconnectAttempts = 0
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'monitor_update' && data.payload.latestResult?.responseTimeMs !== null) {
            onMonitorUpdate(data.payload)
          } else {
            console.log('[WS] Ignored non-update or empty message:', data)
          }
        } catch (error) {
          console.error('[WS] Failed to parse incoming message:', error)
        }
      }

      ws.onclose = () => {
        console.log('[WS] Connection closed for organization:', organizationId)
        if (isUnmounted) return
        reconnectAttempts += 1
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 10000) // max 10s
        console.log(`[WS] Attempting reconnect in ${delay / 1000}s (attempt ${reconnectAttempts})`)
        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }

      ws.onerror = (error) => {
        console.error('[WS] Error encountered, closing socket:', error)
        ws.close()
      }
    }

    connect()

    return () => {
      console.log('[WS] Cleaning up WebSocket for organization:', organizationId)
      isUnmounted = true
      if (wsRef.current && wsRef.current.readyState <= 1) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [organizationId, onMonitorUpdate])
}
