import { Hono } from 'hono'
import * as controller from '@/modules/users/users.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { authorize } from '@/middlewares/authorize.middleware'

const userAdminRoute = new Hono()
userAdminRoute.use('*', authMiddleware)
userAdminRoute.get('/', authorize(['teacher']), controller.getAll)
userAdminRoute.get('/:id{[0-9]}', authorize(['teacher']), controller.getById)
userAdminRoute.post('/', authorize(['teacher']), controller.create)
userAdminRoute.put('/:id{[0-9]+}', authorize(['teacher']), controller.update)
userAdminRoute.delete('/:id{[0-9]+}', authorize(['teacher']), controller.deleteUser)

export { userAdminRoute }
