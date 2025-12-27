import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'

export function ThemeToggle() {
  const theme = useThemeStore((store) => store.theme)
  const toggleTheme = useThemeStore((store) => store.toggleTheme)
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      aria-label='Toggle theme'
      className='rounded-none'>
      {theme === 'dark' ? (
        <Sun className='size-5' />
      ) : (
        <Moon className='size-5' />
      )}
    </Button>
  )
}
