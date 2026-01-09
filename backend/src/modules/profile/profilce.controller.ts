import type { Context } from 'hono';
import * as service from '@/modules/profile/profile.service';
import * as response from '@/utils/response';
import { ZodError } from "zod";
import { updateProfileSchema } from "@/modules/profile/profile.validator";

// CONTROLLER ADMIN/TEACHER
export const getProfileAdmin = async (c: Context) => {
    try {
        const user = c.get("user")
        const result = await service.getProfileAdmin(user)
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

export const updateProfileAdmin = async (c: Context) => {
    try {
        const user = c.get("user")
        const body = await c.req.json()
        const data = updateProfileSchema.parse(body)
        const result = await service.updateProfileAdmin(user, data)
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