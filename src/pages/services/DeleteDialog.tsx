import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export function ServiceDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  serviceName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  serviceName: string
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-md sm:max-w-lg p-0 overflow-hidden border-0 bg-background shadow-2xl'>
        {/* Header with close button */}

        {/* Content */}
        <div className='max-w-lg flex flex-col items-center px-6 py-6 text-center space-y-4'>
          {/* Icon with subtle animation */}
          <div className='mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center'>
            <AlertTriangle className='w-8 h-8 text-destructive animate-pulse' />
          </div>

          {/* Title */}
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-foreground'>Delete "{serviceName}"?</h3>
            <p className='text-sm text-muted-foreground'>This action will permanently remove this service</p>
          </div>

          {/* Warning section with better visual hierarchy */}
          <div className='bg-destructive/5 border border-destructive/20 rounded-md p-3 text-left space-y-2'>
            <div className='flex flex-col items-center space-y-1.5 text-sm'>
              <div className='flex items-center gap-1.5 font-medium text-destructive'>
                <AlertTriangle className='w-4 h-4 flex-shrink-0' />
                <span>This action cannot be undone</span>
              </div>
              <p className='text-muted-foreground text-xs text-center'>
                All associated data will be permanently deleted, including:
              </p>
              <ul className='text-muted-foreground text-xs space-y-0.5 text-left list-disc list-inside'>
                <li>Monitors and alerts</li>
                <li>Historical metrics and logs</li>
                <li>Service configurations</li>
              </ul>
            </div>
          </div>

          {/* Action buttons with better spacing */}
          <div className='flex gap-3 pt-2'>
            <Button variant='outline' className='flex-1' onClick={() => onOpenChange(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant='destructive' className='flex-1 font-medium' onClick={handleConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Deleting...
                </div>
              ) : (
                'Delete Service'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
