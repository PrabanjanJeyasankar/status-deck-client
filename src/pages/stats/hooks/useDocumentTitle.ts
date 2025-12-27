import { useEffect } from 'react'

export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (title) {
      const previousTitle = document.title
      document.title = `${title} | Status Deck`
      return () => {
        document.title = previousTitle
      }
    }
  }, [title])
}
