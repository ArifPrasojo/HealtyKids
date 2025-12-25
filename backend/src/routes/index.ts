import { Hono } from 'hono'
import { authRoute } from '@/modules/auth/auth.route'
import { userAdminRoute } from '@/modules/users/users.route'
import { materialAdminRoute } from '@/modules/materials/material.route'
import { quizAdminRoute, quizStudentRoute } from '@/modules/quiz/quiz.route'

const adminRoutes = new Hono()
adminRoutes.route('/users', userAdminRoute)
adminRoutes.route('/materials', materialAdminRoute)
adminRoutes.route('/quiz', quizAdminRoute)

const authRoutes = new Hono()
authRoutes.route('/', authRoute)

const studentRoutes = new Hono()
studentRoutes.route('/quiz', quizStudentRoute)

export { adminRoutes, authRoutes, studentRoutes }
