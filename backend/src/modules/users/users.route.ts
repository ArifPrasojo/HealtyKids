import { Hono } from 'hono'
import * as controller from '@/modules/users/users.controller'

const userAdminRoute = new Hono()

userAdminRoute.get('/', controller.getAll)
userAdminRoute.post('/', controller.create)

export { userAdminRoute }
