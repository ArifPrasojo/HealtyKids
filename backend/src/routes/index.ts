import { Hono } from 'hono'
import { userAdminRoute } from '@/modules/users/users.route'
import { materialAdminRoute } from '@/modules/materials/material.route'
import { quizAdminRoute } from '@/modules/quiz/quiz.route'

const adminRoutes = new Hono()
adminRoutes.route('/users', userAdminRoute)
adminRoutes.route('/materials', materialAdminRoute)
adminRoutes.route('/quiz', quizAdminRoute)
export { adminRoutes }