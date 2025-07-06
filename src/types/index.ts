export type User = {
  user_id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  organization_id: string
  organization_name: string
}
