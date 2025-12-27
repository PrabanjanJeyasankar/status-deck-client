import { Logo } from '@/components/Logo'
import { SignupForm } from '@/pages/authentication/Signup/signup-form'

export default function Signup() {
  return (
    <div className=' flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <a href='#' className='flex items-center gap-2 self-center font-medium'>
          <div className='flex size-6 items-center justify-center rounded-none'>
            <Logo size={10} />
          </div>
          Status Deck.
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
