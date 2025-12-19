import type { Context } from 'hono'
import * as service from '@/modules/materials/material.service'
import * as response from '@/utils/response'
import { createMaterialSchema, updateMaterialSchema } from '@/modules/materials/material.validator'
import { ZodError } from "zod"

export const getAllMaterial = async (c: Context) => {
    try {
        const result = await service.getAllMaterial()
        return c.json(response.successResponse(result))
    } catch (err: any) {
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const getMaterialById = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const result = await service.getMaterialById(materialId)
        return c.json(response.successResponse(result))
    } catch (err: any) {
        const status = err.status ?? 500
        return c.json(response.errorResponse(err), status)
    }
}

export const createMaterial = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = createMaterialSchema.parse(body)
        const result = await service.createMaterial(data)
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

export const updateMaterial = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const body = await c.req.json()
        const data = updateMaterialSchema.parse(body)
        const result = await service.updateMaterial(materialId, data)
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