import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ToggleTheme'
import { LoginForm } from '@/pages/authentication/Login/login-form'

export default function Login() {
  return (
    <div className='relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='absolute right-4 top-4'>
        <ThemeToggle />
      </div>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <a href='#' className='flex items-center gap-2 self-center font-medium'>
          <div className='flex size-6 items-center justify-center rounded-none'>
            <Logo size={10} />
          </div>
          Status Deck.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
