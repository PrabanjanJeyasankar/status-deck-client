import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '@/002-hooks/useAuthentication'
import { Loader2 } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const login = useLogin()
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = form.email.value
    const password = form.password.value

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          const redirectTo = localStorage.getItem('redirectTo') || '/services'
          localStorage.removeItem('redirectTo')
          navigate(redirectTo, { replace: true })
        },
      }
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='grid gap-6'>
              <div className='grid gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' type='email' placeholder='m@example.com' required />
                </div>
                <div className='grid gap-3'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <a href='#' className='ml-auto text-sm underline-offset-4 hover:underline'>
                      Forgot your password?
                    </a>
                  </div>
                  <Input id='password' type='password' required />
                </div>
                <Button type='submit' className='w-full' disabled={login.status === 'pending'}>
                  {login.status === 'pending' ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link to='/signup' className='underline underline-offset-4'>
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  )
}
