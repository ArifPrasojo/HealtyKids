import { Hono } from 'hono'
import { userAdminRoute } from '@/modules/users/users.route'
import { materialAdminRoute } from '@/modules/materials/material.route'

const adminRoutes = new Hono()
adminRoutes.route('/users', userAdminRoute)
adminRoutes.route('/materials', materialAdminRoute)
export { adminRoutes }