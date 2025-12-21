import { Hono } from 'hono'
import * as controller from '@/modules/quiz/quiz.controller'

const quizAdminRoute = new Hono()
quizAdminRoute.get('/', controller.getQuiz)
quizAdminRoute.put('/', controller.updateQuiz)
quizAdminRoute.get('/questions', controller.getAllQuestion)
quizAdminRoute.get('/questions/:id{[0-9]+}', controller.getQuestionById)
export { quizAdminRoute }