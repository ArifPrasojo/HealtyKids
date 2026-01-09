import { Hono } from 'hono'
import * as controller from '@/modules/quiz/quiz.controller'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { authorize } from '@/middlewares/authorize.middleware'

const quizAdminRoute = new Hono()
quizAdminRoute.use('*', authMiddleware)
quizAdminRoute.get('/', authorize(['teacher']), controller.getQuiz)
quizAdminRoute.put('/', authorize(['teacher']), controller.updateQuiz)
quizAdminRoute.get('/questions', authorize(['teacher']), controller.getAllQuestion)
quizAdminRoute.get('/questions/:id{[0-9]+}', controller.getQuestionById)
quizAdminRoute.post('/questions', authorize(['teacher']), controller.createQuestion)
quizAdminRoute.put('/questions/:id{[0-9]+}', authorize(['teacher']), controller.updateQuestion)
quizAdminRoute.delete('/questions/:id{[0-9]+}', authorize(['teacher']), controller.deleteQuestion)
quizAdminRoute.get('/questions/:id{[0-9]+}/answer', authorize(['teacher']), controller.getAllAnswer)
quizAdminRoute.put('/questions/:id{[0-9]+}/answer', authorize(['teacher']), controller.updateQuestionAnswer)
quizAdminRoute.get('/result', authorize(['teacher']), controller.getQuizAttempt)

const quizStudentRoute = new Hono()
quizStudentRoute.use('*', authMiddleware)
quizStudentRoute.get('/', authorize(['student']), controller.getQuizStudent)
quizStudentRoute.post('/', authorize(['student']), controller.quizStudentPost)
quizStudentRoute.get('/result', authorize(['student']), controller.getQuizAttemptStudent)

export { quizAdminRoute, quizStudentRoute }