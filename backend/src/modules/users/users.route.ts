import { Hono } from 'hono'
import * as controller from '@/modules/users/users.controller'

const userAdminRoute = new Hono()

userAdminRoute.get('/', controller.getAll)
userAdminRoute.get('/:id{[0-9]}', controller.getById)
userAdminRoute.post('/', controller.create)
userAdminRoute.put('/:id{[0-9]+}', controller.update)
userAdminRoute.delete('/:id{[0-9]+}', controller.deleteUser)

export { userAdminRoute }
