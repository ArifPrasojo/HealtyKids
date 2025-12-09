import { Hono } from 'hono'
import { userAdminRoute } from '@/modules/users/users.route'

const adminRoutes = new Hono()
adminRoutes.route('/users', userAdminRoute)
export { adminRoutes }