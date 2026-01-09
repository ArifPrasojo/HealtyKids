import type { Context } from 'hono'
import * as service from '@/modules/materials/material.service'
import * as response from '@/utils/response'
import {
    createMaterialSchema,
    updateMaterialSchema,
    createSubMaterialVideoSchema,
    createSubMaterialPhotoSchema,
    updateSubMaterialVideoSchema,
    updateSubMaterialPhotoSchema
} from '@/modules/materials/material.validator'
import { ZodError } from "zod"

// CONTROLLER ADMIN
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

export const deleteMaterial = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const result = await service.deleteMaterial(materialId)
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

export const getAllSubMaterial = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const result = await service.getAllSubMateri(materialId)
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

export const getSubMaterialById = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const subMaterialId = Number(c.req.param('id-sub'))
        const result = await service.getSubMaterialById(materialId, subMaterialId)
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

export const createSubMaterial = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const body = await c.req.json()
        if (body.contentCategory == 'video') {
            const data = createSubMaterialVideoSchema.parse(body)
            const result = await service.createSubMaterialVideo(materialId, data)
            return c.json(response.successResponse(result))
        } else if (body.contentCategory == 'photo') {
            const data = createSubMaterialPhotoSchema.parse(body)
            const result = await service.createSubMaterialPhoto(materialId, data)
            return c.json(response.successResponse(result))
        }

        return c.json({ message: "Unsupported Category Content" }, 415)
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

export const updateSubMaterial = async (c: Context) => {
    try {
        const materialId = Number(c.req.param('id'))
        const subMaterialId = Number(c.req.param('id-sub'))
        const body = await c.req.json()
        if (body.contentCategory == 'video') {
            const data = updateSubMaterialVideoSchema.parse(body)
            const result = await service.updateSubMaterialVideo(materialId, subMaterialId, data)
            return c.json(response.successResponse(result))
        } else if (body.contentCategory == 'photo') {
            const data = updateSubMaterialPhotoSchema.parse(body)
            const result = await service.updateSubMaterialPhoto(materialId, subMaterialId, data)
            return c.json(response.successResponse(result))
        }

        return c.json({ message: "Unsupported Category Content" }, 415)
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

export const deleteSubMaterial = async (c: Context) => {
    try {
        const subMaterialId = Number(c.req.param('id-sub'))
        const result = await service.deleteSubMaterial(subMaterialId)
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
export const getAllMaterialStudent = async (c: Context) => {
    try {
        const user = c.get('user')
        const result = await service.getAllMaterialStudent(user)
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