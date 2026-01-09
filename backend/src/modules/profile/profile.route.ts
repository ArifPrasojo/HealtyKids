import { Hono } from 'hono'
import * as controller from '@/modules/profile/profilce.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorize } from '@/middlewares/authorize.middleware';

const profileAdminRoute = new Hono()
profileAdminRoute.use('*', authMiddleware)
profileAdminRoute.get('/', authorize(['teacher']), controller.getProfileAdmin)
profileAdminRoute.put('/', authorize(['teacher']), controller.updateProfileAdmin)

const profileStudentRoute = new Hono()
profileStudentRoute.use('*', authMiddleware)
profileStudentRoute.get('/', authorize(['student']), controller.getProfileStudent)

export { profileAdminRoute, profileStudentRoute }