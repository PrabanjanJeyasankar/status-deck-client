import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import { Server } from 'lucide-react'
import type { Service } from '@/types/serviceTypes'

interface ServiceFilterPopoverProps {
  services: Service[]
  selectedServiceIds: string[]
  onChange: (ids: string[]) => void
}

export function ServiceFilterPopover({ services, selectedServiceIds, onChange }: ServiceFilterPopoverProps) {
  const [open, setOpen] = useState(false)

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      onChange(selectedServiceIds.filter((sid) => sid !== id))
    } else {
      onChange([...selectedServiceIds, id])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='flex items-center gap-2'>
          <Server className='w-4 h-4' />
          Filter Services
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 max-h-64 overflow-y-auto'>
        {services.map((service) => (
          <label key={service.id} className='flex items-center gap-2 py-1'>
            <Checkbox
              checked={selectedServiceIds.includes(service.id)}
              onCheckedChange={() => toggleService(service.id)}
            />
            <span>{service.name}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  )
}
