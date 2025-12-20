import type { Context } from 'hono'
import * as service from '@/modules/quiz/quiz.service'
import * as response from '@/utils/response'
import { ZodError } from "zod"

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