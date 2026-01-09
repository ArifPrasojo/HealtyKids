import { Hono } from 'hono'
import * as controller from '@/modules/profile/profilce.controller'
import { authMiddleware } from '@/middlewares/auth.middleware';
import { authorize } from '@/middlewares/authorize.middleware';

const profileAdminRoute = new Hono()
profileAdminRoute.use('*', authMiddleware)
profileAdminRoute.get('/', authorize(['teacher']), controller.getProfileAdmin)

export { profileAdminRoute }