import { LogOut, ChevronsUpDown, Building, UserCircle2, Sun, Moon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/authenticationStore'
import { useThemeStore } from '@/store/themeStore'

export function SidebarFooter({
  user,
}: {
  user: {
    name: string
    email: string
    avatar?: string
    organization_name?: string
    role?: string
  }
}) {
  const { isMobile } = useSidebar()
  const logout = useAuthStore((s) => s.logout)
  const { theme, toggleTheme } = useThemeStore()

  function initials(name?: string) {
    return name
      ? name
          .split(' ')
          .map((n) => n[0]?.toUpperCase())
          .join('')
          .slice(0, 2)
      : 'US'
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-lg'>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'top'}
            align='center'
            sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            {user.organization_name && (
              <DropdownMenuItem asChild>
                <div className='flex items-center gap-2 text-xs text-muted-foreground cursor-default select-text'>
                  <Building className='w-4 h-4 opacity-70' />
                  <span className='font-semibold'>Org:</span>
                  <span className='max-w-[120px] truncate font-mono' title={user.organization_name}>
                    {user.organization_name}
                  </span>
                </div>
              </DropdownMenuItem>
            )}
            {user.role && (
              <DropdownMenuItem asChild>
                <div className='flex items-center gap-2 text-xs text-muted-foreground cursor-default select-text'>
                  <UserCircle2 className='w-4 h-4 opacity-70' />
                  <span className='font-semibold'>Role:</span>
                  <span className='capitalize'>{user.role.toLowerCase()}</span>
                </div>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className='mr-2 size-4' /> : <Moon className='mr-2 size-4' />}
              Switch Theme
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className='mr-2 size-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
