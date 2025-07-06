import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Info, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import type { ServiceStatus } from '@/types/serviceTypes'
import { validateServiceForm } from '@/utils/serviceValidation'
import { serviceStatusOptions } from '@/utils'

interface ServiceCreateFormProps {
  onCreate: (data: { name: string; status: ServiceStatus; description?: string }) => void
  onCancel?: () => void
}

export function ServiceCreateForm({ onCreate, onCancel }: ServiceCreateFormProps) {
  const [form, setForm] = useState<{ name: string; status: ServiceStatus; description?: string }>({
    name: '',
    status: 'OPERATIONAL',
  })
  const [errors, setErrors] = useState<Partial<Record<'name' | 'status', string>>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateServiceForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length === 0) {
      onCreate(form)
    }
  }

  return (
    <form
      className='flex flex-col gap-6  w-full bg-white border border-neutral-200 rounded-2xl p-8'
      onSubmit={handleSubmit}
      noValidate>
      <div>
        <h2 className='text-2xl font-semibold mb-1 flex items-center gap-2'>
          <Info className='w-5 h-5 text-primary' />
          Create Service
        </h2>
        <p className='text-sm text-muted-foreground'>Fill in details to add a new service to your status page.</p>
      </div>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='name' className='font-medium'>
          Name <span className='text-red-500'>*</span>
        </Label>
        <Input
          id='name'
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value })
            setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          placeholder='e.g. Main Website'
          required
          className={clsx('text-base', errors.name && 'border-red-500 focus-visible:ring-red-500/50')}
        />
        {errors.name && (
          <span className='text-xs text-red-600 flex items-center gap-1 mt-0.5'>
            <AlertCircle className='w-4 h-4' /> {errors.name}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='status' className='font-medium'>
          Status <span className='text-red-500'>*</span>
        </Label>
        <Select
          value={form.status}
          onValueChange={(status) => {
            setForm({ ...form, status: status as ServiceStatus })
            setErrors((prev) => ({ ...prev, status: undefined }))
          }}>
          <SelectTrigger
            id='status'
            className={clsx('w-full text-base', errors.status && 'border-red-500 focus-visible:ring-red-500/50')}>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {serviceStatusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <span className='text-xs text-red-600 flex items-center gap-1 mt-0.5'>
            <AlertCircle className='w-4 h-4' /> {errors.status}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='description' className='font-medium'>
          Description
        </Label>
        <Textarea
          id='description'
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder='Optional — Add more details about this service'
          className='text-base min-h-[80px] resize-none'
        />
      </div>
      <div className='flex gap-2 justify-end pt-2'>
        {onCancel && (
          <Button type='button' variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type='submit'>Create</Button>
      </div>
    </form>
  )
}
