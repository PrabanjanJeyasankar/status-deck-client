import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { MonitorStatsPage } from './MonitorStatsPage'

export default function MonitorStatsPageWrapper() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    root.classList.add('stats-dark')
    body.classList.add('stats-dark')
    return () => {
      root.classList.remove('stats-dark')
      body.classList.remove('stats-dark')
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const atBottom = scrollTop + clientHeight >= scrollHeight
      setShowBackToTop(atBottom)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <main className='flex flex-col min-h-screen w-full bg-black text-white relative'>
      <MonitorStatsPage />
      {showBackToTop ? (
        <button
          type='button'
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label='Back to top'
          className='fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-black/80 text-white/70 hover:text-white hover:bg-black'>
          <ArrowUp className='h-4 w-4' />
        </button>
      ) : null}
    </main>
  )
}
