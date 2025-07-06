import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MonitorStatsHeader() {
  return (
    <div className='flex justify-between items-center'>
      <h1 className='text-2xl font-bold'>Monitor Stats</h1>
      <Button variant='outline' size='sm'>
        <Calendar className='w-4 h-4 mr-2' /> Last Day
      </Button>
    </div>
  )
}
