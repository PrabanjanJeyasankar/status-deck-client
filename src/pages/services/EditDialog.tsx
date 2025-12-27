import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import type { Service, ServiceStatus } from '@/types/serviceTypes'
import { statusColorMap } from '@/utils'
import { useEffect, useState, type FormEvent } from 'react'

export function ServiceEditDialog({
  open,
  onOpenChange,
  service,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service
  onSubmit: (payload: {
    name: string
    status: ServiceStatus
    description?: string
  }) => void
}) {
  const [name, setName] = useState(service.name)
  const [status, setStatus] = useState<ServiceStatus>(service.status)
  const [description, setDescription] = useState(service.description ?? '')

  useEffect(() => {
    if (open) {
      setName(service.name)
      setStatus(service.status)
      setDescription(service.description ?? '')
    }
  }, [open, service.name, service.status, service.description])

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({
      name: trimmed,
      status,
      description: description.trim() || undefined,
    })
    onOpenChange(false)
  }

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md w-full p-6 space-y-6'>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={onFormSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='service-name'>Service Name</Label>
            <Input
              id='service-name'
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter service name'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='service-description'>Description</Label>
            <Textarea
              id='service-description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Describe this service (optional)'
              rows={3}
            />
          </div>

          <fieldset className='space-y-2'>
            <Label>Status</Label>
            <RadioGroup
              value={status}
              onValueChange={(val) => setStatus(val as ServiceStatus)}
              className='flex flex-wrap gap-3'>
              {(Object.keys(statusColorMap) as ServiceStatus[]).map(
                (status) => (
                  <div
                    key={status}
                    className={`flex items-center space-x-2 p-2 border rounded-none ${statusColorMap[status].text}/80 border-muted bg-muted/20`}>
                    <RadioGroupItem
                      value={status}
                      id={`status-${status.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={`status-${status.toLowerCase()}`}
                      className={statusColorMap[status].text}>
                      {status}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </fieldset>

          <DialogFooter className='pt-2'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={name.trim().length === 0}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
