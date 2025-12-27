import type { Context } from 'hono'
import * as service from '@/modules/quiz/quiz.service'
import * as response from '@/utils/response'
import { ZodError } from "zod"
import { updateQuizSchema, createQuestionSchema, updateQuestionSchema, updateAnswerQuestionSchema } from "@/modules/quiz/quiz.validator";

export const getQuiz = async (c: Context) => {
    try {
        const result = await service.getQuiz()
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const updateQuiz = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = updateQuizSchema.parse(body)
        const result = await service.updateQuiz(data)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const getAllQuestion = async (c: Context) => {
    try {
        const result = await service.getAllQuestion()
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const getQuestionById = async (c: Context) => {
    try {
        const questionId = Number(c.req.param('id'))
        const result = await service.getQuestionById(questionId)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const createQuestion = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = createQuestionSchema.parse(body)
        const result = await service.createQuestion(data)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const updateQuestion = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = updateQuestionSchema.parse(body)
        const questionId = Number(c.req.param('id'))
        const result = await service.updateQuestion(questionId, data)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const deleteQuestion = async (c: Context) => {
    try {
        const questionId = Number(c.req.param('id'))
        const result = await service.deleteQuestion(questionId)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const getAllAnswer = async (c: Context) => {
    try {
        const questionId = Number(c.req.param('id'))
        const result = await service.getAllAnswer(questionId)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const updateQuestionAnswer = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = updateAnswerQuestionSchema.parse(body)
        const questionId = Number(c.req.param('id'))
        const result = await service.updateQuestionAnswer(questionId, data)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

// CONTROLLER STUDENT
export const getQuizStudent = async (c: Context) => {
    try {
        const result = await service.getQuizStudent()
        return c.json(response.successResponse(result))
    } catch (err: any) {
        if (err instanceof ZodError) {
            return c.json({
                success: false,
                message: "Validasi gagal",
                errors: err.flatten().fieldErrors
            }, 400)
        }
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}