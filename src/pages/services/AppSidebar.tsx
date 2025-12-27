import { Logo } from '@/components/Logo'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/authenticationStore'
import { useIncidentNotificationStore } from '@/store/incidentNotificationStore'
import { Activity, Mailbox, Siren } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarFooter } from './SidebarFooter'

const navMain = [
  {
    title: 'Main',
    items: [
      { title: 'Services', url: '/services', key: 'services', icon: Mailbox },
      { title: 'Monitors', url: '/monitor', key: 'monitors', icon: Activity },
      { title: 'Incidents', url: '/incidents', key: 'incidents', icon: Siren },
    ],
  },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((s) => s.user)
  const { pathname } = useLocation()
  const { hasNewIncident, setHasNewIncident } = useIncidentNotificationStore()

  useEffect(() => {
    if (pathname.includes('/incidents') && hasNewIncident) {
      setHasNewIncident(false)
    }
  }, [pathname, hasNewIncident, setHasNewIncident])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className='flex gap-5 items-center px-4 py-3 rounded-t-md'>
          <div className='flex items-center justify-center '>
            <Logo size={10} />
          </div>
          <div className='flex flex-col gap-1 justify-center'>
            <span className='font-bold text-xl tracking-tight leading-none'>
              Status Deck
            </span>
            {user?.organization_name && (
              <span
                className='text-xs ml-0.5 text-muted-foreground font-mono truncate max-w-[140px]'
                title={user.organization_name}>
                {user.organization_name} {'|'} {user.role}
              </span>
            )}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className='flex items-center gap-2'>
                        <item.icon size={18} className='shrink-0' />
                        {item.title}
                        {item.key === 'incidents' && hasNewIncident && (
                          <span className='absolute top-2 left-24 block h-1.5 w-1.5 rounded-none bg-red-500 animate-pulse'></span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className='mt-auto mb-2 px-2'>
          {user && (
            <SidebarFooter
              user={{
                name: user.name,
                email: user.email,
                avatar: undefined,
                organization_name: user.organization_name,
                role: user.role,
              }}
            />
          )}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
