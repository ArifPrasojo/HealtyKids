import type { Context } from 'hono'
import * as service from '@/modules/materials/material.service'
import * as response from '@/utils/response'

export const getAllMaterial = async (c: Context) => {
    try {
        const result = await service.getAllMaterial()
        return c.json(response.successResponse(result))
    } catch (err) {
        return c.json(response.errorResponse(err))
    }
}

export const getMaterialById = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const result = await service.getMaterialById(materialId)
        return c.json(response.successResponse(result))
    } catch (err) {
        return c.json(response.errorResponse(err))
    }
}