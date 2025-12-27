import { useEffect, useRef } from 'react'

export function useActivityScroll(activityLimit: number) {
  const activityEndRef = useRef<HTMLDivElement | null>(null)
  const shouldScrollToEnd = useRef(false)

  useEffect(() => {
    if (!shouldScrollToEnd.current) {
      return
    }
    shouldScrollToEnd.current = false

    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          activityEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
          })
        })
      })
    }, 300)
  }, [activityLimit])

  const markForScroll = () => {
    shouldScrollToEnd.current = true
  }

  return { activityEndRef, markForScroll }
}
