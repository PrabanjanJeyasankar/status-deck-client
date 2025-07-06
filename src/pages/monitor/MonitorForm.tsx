import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Link as LinkIcon, Clock, ArrowRightLeft, Plus, X, Activity, Check } from 'lucide-react'
import clsx from 'clsx'
import { FREQUENCY_OPTIONS } from '@/utils'
import {
  type MonitorFormData,
  type MonitorDisplay,
  type MonitorWithLatestResult,
  HTTP_METHODS,
} from '@/types/monitorTypes'
import { validateMonitorForm } from '@/utils/monitorValdiation'
import { useAuthStore } from '@/store/authenticationStore'
import { useCreateMonitor, useUpdateMonitor } from '@/002-hooks/useMonitors'
import { useServicesStore } from '@/store/servicesStore'
import { getServices } from '@/001-services/services'

interface MonitorFormProps {
  serviceId?: string
  onSuccess?: () => void
  onCancel?: () => void
  showCancel?: boolean
  initialData?: MonitorDisplay
  onMonitorCreated?: (monitor: MonitorWithLatestResult) => void
}

export function MonitorForm({
  serviceId: initialServiceId,
  onSuccess,
  onCancel,
  showCancel,
  initialData,
}: MonitorFormProps) {
  const [form, setForm] = useState<MonitorFormData>({
    name: '',
    url: '',
    method: 'GET',
    headers: [],
    active: true,
    interval: 60,
    type: 'HTTP',
    degradedThreshold: 2000,
    timeout: 5000,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof MonitorFormData | string, string>>>({})
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId ?? '')
  const orgId = useAuthStore((s) => s.user?.organization_id)!
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const { mutate: createMonitor, isPending: isCreating } = useCreateMonitor(selectedServiceId, orgId, onSuccess)
  const { mutate: updateMonitor, isPending: isUpdating } = useUpdateMonitor(selectedServiceId, orgId, onSuccess)
  const { services } = useServicesStore()
  const isEditMode = !!initialData

  useEffect(() => {
    const orgId = useAuthStore.getState().user?.organization_id
    const { services, setServices } = useServicesStore.getState()

    if (services.length === 0 && orgId) {
      getServices(orgId)
        .then(setServices)
        .catch((err) => {
          console.error('[MonitorForm] Failed to fetch services for dropdown:', err)
        })
    }
  }, [])

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        url: initialData.url,
        method: initialData.method,
        headers: initialData.headers ?? [],
        active: initialData.active,
        interval: initialData.interval ?? 60,
        type: 'HTTP',
        degradedThreshold: initialData.degradedThreshold ?? 2000,
        timeout: initialData.timeout ?? 5000,
      })
      setSelectedServiceId(initialData.serviceId)
    }
  }, [initialData])

  const updateForm = <K extends keyof MonitorFormData>(field: K, value: MonitorFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleHeaderChange = (idx: number, field: 'key' | 'value', value: string) => {
    const updatedHeaders = [...form.headers]
    updatedHeaders[idx][field] = value
    setForm((prev) => ({ ...prev, headers: updatedHeaders }))
    setErrors((prev) => ({ ...prev, [`header_${idx}`]: undefined }))
  }

  const handleAddHeader = () => {
    setForm((prev) => ({ ...prev, headers: [...prev.headers, { key: '', value: '' }] }))
  }

  const handleRemoveHeader = (idx: number) => {
    const updatedHeaders = form.headers.filter((_, i) => i !== idx)
    setForm((prev) => ({ ...prev, headers: updatedHeaders }))
    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[`header_${idx}`]
      return updated
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isSubmitting || isCreating || isUpdating) {
      return
    }

    setIsSubmitting(true)

    if (!selectedServiceId) {
      setErrors((prev) => ({ ...prev, serviceId: 'Please select a service.' }))
      setIsSubmitting(false)
      return
    }

    const validationErrors = validateMonitorForm(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      const onSuccessWrapper = () => {
        setIsSubmitting(false)
        onSuccess?.()
      }

      if (isEditMode && initialData) {
        updateMonitor(
          { monitorId: initialData.id, payload: form },
          {
            onError: () => setIsSubmitting(false),
            onSuccess: onSuccessWrapper,
          }
        )
      } else {
        createMonitor(form, {
          onError: () => setIsSubmitting(false),
          onSuccess: onSuccessWrapper,
        })
      }
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className='space-y-6 w-full max-h-[80vh] overflow-y-auto px-1 sm:px-2 py-2'>
      {/* Select Service */}
      <div>
        <Label className='text-base font-semibold flex items-center gap-1'>Select Service</Label>
        <Select
          value={selectedServiceId}
          onValueChange={(value) => {
            setSelectedServiceId(value)
            setErrors((prev) => ({ ...prev, serviceId: undefined }))
          }}>
          <SelectTrigger
            className={clsx('mt-2 w-full', errors.serviceId && 'border-red-500 focus-visible:ring-red-500')}>
            <SelectValue placeholder='Select a service' />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceId && <div className='text-xs text-red-500 mt-1'>{errors.serviceId}</div>}
      </div>
      {/* Name */}
      <div>
        <Label htmlFor='name' className='text-base font-semibold flex items-center gap-1'>
          <Activity className='w-4 h-4 text-muted-foreground' /> Monitor Name
        </Label>
        <Input
          id='name'
          value={form.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('name', e.target.value)}
          placeholder='e.g. Main Website'
          className={clsx('mt-2', errors.name && 'border-red-500 focus-visible:ring-red-500/50')}
        />
        {errors.name && <div className='text-xs text-red-500 mt-1'>{errors.name}</div>}
      </div>
      {/* URL */}
      <div>
        <Label htmlFor='url' className='text-base font-semibold flex items-center gap-1'>
          <LinkIcon className='w-4 h-4 text-muted-foreground' /> Endpoint URL
        </Label>
        <Input
          id='url'
          type='url'
          value={form.url}
          onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('url', e.target.value)}
          placeholder='https://yourdomain.com/health'
          className={clsx('mt-2', errors.url && 'border-red-500 focus-visible:ring-red-500/50')}
        />
        {errors.url && <div className='text-xs text-red-500 mt-1'>{errors.url}</div>}
      </div>
      {/* Method, Interval, Degraded Threshold, Timeout */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label className='text-base font-semibold flex items-center gap-1'>
            <ArrowRightLeft className='w-4 h-4 text-muted-foreground' /> Method
          </Label>
          <Select
            value={form.method}
            onValueChange={(value) => updateForm('method', value as MonitorFormData['method'])}>
            <SelectTrigger
              className={clsx('mt-2 w-full', errors.method && 'border-red-500 focus-visible:ring-red-500/50')}>
              <SelectValue placeholder='Select method' />
            </SelectTrigger>
            <SelectContent>
              {HTTP_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.method && <div className='text-xs text-red-500 mt-1'>{errors.method}</div>}
        </div>
        <div>
          <Label className='text-base font-semibold flex items-center gap-1'>
            <Clock className='w-4 h-4 text-muted-foreground' /> Frequency
          </Label>
          <Select value={String(form.interval)} onValueChange={(value) => updateForm('interval', Number(value))}>
            <SelectTrigger
              className={clsx('mt-2 w-full', errors.interval && 'border-red-500 focus-visible:ring-red-500/50')}>
              <SelectValue placeholder='Select frequency' />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.interval && <div className='text-xs text-red-500 mt-1'>{errors.interval}</div>}
        </div>
        <div>
          <Label htmlFor='timeout' className='text-base font-semibold flex items-center gap-1'>
            <Clock className='w-4 h-4 text-red-600' /> Timeout (ms)
          </Label>
          <Input
            id='timeout'
            type='number'
            min={500}
            value={form.timeout}
            onChange={(e) => updateForm('timeout', parseInt(e.target.value, 10) || 0)}
            placeholder='5000'
            className={clsx('mt-2', errors.timeout && 'border-red-500 focus-visible:ring-red-500/50')}
          />
          {errors.timeout && <div className='text-xs text-red-500 mt-1'>{errors.timeout}</div>}
        </div>
        <div>
          <Label htmlFor='degradedThreshold' className='text-base font-semibold flex items-center gap-1'>
            <Clock className='w-4 h-4 text-yellow-600' /> Degraded Threshold (ms)
          </Label>
          <Input
            id='degradedThreshold'
            type='number'
            min={100}
            value={form.degradedThreshold}
            onChange={(e) => updateForm('degradedThreshold', parseInt(e.target.value, 10) || 0)}
            placeholder='2000'
            className={clsx('mt-2', errors.degradedThreshold && 'border-red-500 focus-visible:ring-red-500/50')}
          />
          {errors.degradedThreshold && <div className='text-xs text-red-500 mt-1'>{errors.degradedThreshold}</div>}
        </div>
      </div>

      <div>
        <Label className='text-base font-semibold'>Request Headers</Label>
        <div className='space-y-2 mt-2'>
          {form.headers.map((header, idx) => (
            <div key={idx} className='flex flex-wrap gap-2 items-center'>
              <Input
                placeholder='Key'
                value={header.key}
                onChange={(e) => handleHeaderChange(idx, 'key', e.target.value)}
                className='flex-1 min-w-[100px]'
              />
              <Input
                placeholder='Value'
                value={header.value}
                onChange={(e) => handleHeaderChange(idx, 'value', e.target.value)}
                className='flex-1 min-w-[100px]'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => handleRemoveHeader(idx)}
                className='text-destructive'>
                <X className='w-4 h-4' />
              </Button>
            </div>
          ))}
          <Button type='button' size='sm' variant='secondary' onClick={handleAddHeader}>
            <Plus className='w-4 h-4' /> Add Custom Header
          </Button>
        </div>
      </div>
      {/* Actions */}
      <div className='flex justify-end gap-2 flex-wrap'>
        {showCancel && (
          <Button type='button' variant='ghost' onClick={onCancel}>
            <X className='w-4 h-4' /> Cancel
          </Button>
        )}
        <Button type='submit' disabled={isCreating || isUpdating || isSubmitting}>
          <Check className='w-4 h-4' /> {isCreating || isUpdating ? 'Saving...' : 'Confirm'}
        </Button>
      </div>
    </form>
  )
}
