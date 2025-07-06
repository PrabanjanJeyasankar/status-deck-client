import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAddIncidentUpdate } from '@/002-hooks/useIncidents'

interface IncidentUpdateFormProps {
  incidentId: string
  onSuccess?: () => void
}

export function IncidentUpdateForm({ incidentId, onSuccess }: IncidentUpdateFormProps) {
  const [message, setMessage] = useState('')
  const addUpdate = useAddIncidentUpdate(() => {
    setMessage('')
    onSuccess?.()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    addUpdate.mutate({
      incidentId,
      payload: { message },
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Add an update...' rows={3} />
      <Button type='submit' disabled={addUpdate.isPending || message.trim() === ''}>
        {addUpdate.isPending ? 'Adding...' : 'Add Update'}
      </Button>
    </form>
  )
}
