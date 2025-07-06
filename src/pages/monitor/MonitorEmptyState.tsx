import { Activity } from 'lucide-react'

interface MonitorsEmptyStateProps {
  onCreate: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MonitorsEmptyState({ onCreate }: MonitorsEmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-20'>
      <Activity className='h-10 w-10 text-muted-foreground mb-4' />
      <h2 className='text-xl font-semibold mb-1'>No monitors yet</h2>
      <p className='text-muted-foreground mb-6 text-center'>
        Add your first monitor to start tracking uptime and response time for any URL or endpoint.
      </p>
      {/* <Button onClick={() => setShowCreateMonito(true)} size='lg' className='flex items-center gap-2'>
        <Plus className='w-4 h-4' /> Create your first monitor
      </Button> */}
    </div>
  )
}
