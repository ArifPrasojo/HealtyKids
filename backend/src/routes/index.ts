import { Hono } from 'hono'
import { authRoute } from '@/modules/auth/auth.route'
import { userAdminRoute } from '@/modules/users/users.route'
import { materialAdminRoute, materialStudentRoute } from '@/modules/materials/material.route'
import { quizAdminRoute, quizStudentRoute } from '@/modules/quiz/quiz.route'
import { profileAdminRoute } from '@/modules/profile/profile.route'

const adminRoutes = new Hono()
adminRoutes.route('/users', userAdminRoute)
adminRoutes.route('/materials', materialAdminRoute)
adminRoutes.route('/quiz', quizAdminRoute)
adminRoutes.route('/profile', profileAdminRoute)

const authRoutes = new Hono()
authRoutes.route('/', authRoute)

const studentRoutes = new Hono()
studentRoutes.route('/quiz', quizStudentRoute)
studentRoutes.route('/material', materialStudentRoute)

export { adminRoutes, authRoutes, studentRoutes }
