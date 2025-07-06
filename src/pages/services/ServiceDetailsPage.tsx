import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

import { ServiceHeader } from './ServiceHeader'
import { MonitorPage } from '../monitor/MonitorsPage'

export function ServiceDetailsPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()

  if (!serviceId) {
    return (
      <div className='max-w-4xl py-4 px-4'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold'>Service Not Found</h2>
          <Button variant='secondary' className='mt-4' onClick={() => navigate('/services')}>
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='max-w-4xl py-4 px-4'>
      <ServiceHeader serviceId={serviceId} />
      <Tabs defaultValue='monitors' className='mt-8'>
        <TabsList>
          <TabsTrigger value='monitors'>Monitors</TabsTrigger>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
        </TabsList>
        <TabsContent value='monitors' className='pt-6'>
          <MonitorPage />
        </TabsContent>
        <TabsContent value='overview' className='pt-6'>
          <div className='text-muted-foreground'>Overview and analytics coming soon.</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
