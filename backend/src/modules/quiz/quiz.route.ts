import { Hono } from 'hono'
import * as controller from '@/modules/quiz/quiz.controller'

const quizAdminRoute = new Hono()
quizAdminRoute.get('/', controller.getQuiz)
quizAdminRoute.put('/', controller.updateQuiz)
quizAdminRoute.get('/questions', controller.getAllQuestion)
quizAdminRoute.get('/questions/:id{[0-9]+}', controller.getQuestionById)
quizAdminRoute.post('/questions', controller.createQuestion)
quizAdminRoute.put('/questions/:id{[0-9]+}', controller.updateQuestion)
export { quizAdminRoute }