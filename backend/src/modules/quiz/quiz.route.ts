import { Hono } from 'hono'
import * as controller from '@/modules/quiz/quiz.controller'

const quizAdminRoute = new Hono()
quizAdminRoute.get('/', controller.getQuiz)
quizAdminRoute.put('/', controller.updateQuiz)
export { quizAdminRoute }