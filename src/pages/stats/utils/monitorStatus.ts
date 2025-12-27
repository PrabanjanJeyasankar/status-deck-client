interface MonitorStatus {
  label: string
  dot: string
}

export function getMonitorStatus(
  isActive: boolean,
  uptime: number
): MonitorStatus {
  if (!isActive) {
    return {
      label: 'Paused',
      dot: 'bg-slate-500',
    }
  }

  if (uptime >= 99) {
    return {
      label: 'Operational',
      dot: 'bg-emerald-500',
    }
  }

  if (uptime >= 95) {
    return {
      label: 'Degraded',
      dot: 'bg-amber-500',
    }
  }

  return {
    label: 'Down',
    dot: 'bg-rose-500',
  }
}
