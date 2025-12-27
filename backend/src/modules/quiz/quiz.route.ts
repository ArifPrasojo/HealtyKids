import { Hono } from 'hono'
import * as controller from '@/modules/quiz/quiz.controller'

const quizAdminRoute = new Hono()
quizAdminRoute.get('/', controller.getQuiz)
quizAdminRoute.put('/', controller.updateQuiz)
quizAdminRoute.get('/questions', controller.getAllQuestion)
quizAdminRoute.get('/questions/:id{[0-9]+}', controller.getQuestionById)
quizAdminRoute.post('/questions', controller.createQuestion)
quizAdminRoute.put('/questions/:id{[0-9]+}', controller.updateQuestion)
quizAdminRoute.delete('/questions/:id{[0-9]+}', controller.deleteQuestion)
quizAdminRoute.get('/questions/:id{[0-9]+}/answer', controller.getAllAnswer)
quizAdminRoute.put('/questions/:id{[0-9]+}/answer', controller.updateQuestionAnswer)

const quizStudentRoute = new Hono()
quizStudentRoute.get('/', controller.getQuizStudent)

export { quizAdminRoute, quizStudentRoute }