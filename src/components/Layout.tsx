import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/pages/services/AppSidebar'
import type { JSX } from 'react/jsx-runtime'

export function Layout(): JSX.Element {
  return (
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  )
}

function LayoutInner(): JSX.Element {
  return (
    <div className='min-h-screen w-full flex'>
      <div className={`shrink-0 border-r bg-white transition-all duration-200`}>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
          </header>
        </SidebarInset>
      </div>
      <main className='flex-1 min-w-0 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}
