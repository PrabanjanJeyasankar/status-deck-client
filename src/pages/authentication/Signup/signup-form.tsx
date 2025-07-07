import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'

import { useState } from 'react'
import { useSignup } from '@/002-hooks/useAuthentication'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const signupMutation = useSignup()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    signupMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          navigate('/')
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          setError(err.message || 'Signup failed, please try again.')
        },
      }
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create your account</CardTitle>
          <CardDescription>Sign up with your work email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-6'>
            <div className='grid gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' name='name' type='text' placeholder='Your name' required />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' name='email' type='email' placeholder='m@example.com' required />
              </div>
              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' name='password' type='password' required />
              </div>
              {error && <p className='text-sm text-red-500 text-center'>{error}</p>}
              <Button type='submit' className='w-full' disabled={signupMutation.isPending}>
                {signupMutation.isPending ? 'Signing up...' : 'Sign up'}
              </Button>
            </div>
            <div className='text-center text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='underline underline-offset-4'>
                Sign in
              </Link>
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
