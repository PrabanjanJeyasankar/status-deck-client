import Server from '@/assets/svg/Server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function ServiceEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center py-32'>
      <Server className='h-12 w-12 text-muted-foreground mb-6' />

      <h2 className='text-2xl font-semibold mb-2'>No services yet</h2>
      <p className='text-muted-foreground mb-8 text-center max-w-xs'>
        Get started by creating your first service. Each service can have its
        own monitors.
      </p>
      <Button onClick={onCreate} size='lg'>
        <Plus className='w-5 h-5 ' />
        Create Service
      </Button>
    </div>
  )
}
