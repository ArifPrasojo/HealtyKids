import type { Context } from 'hono'
import * as service from '@/modules/users/user.service'
import * as response from '@/utils/response'
import { createUserSchema, updateUserSchema } from '@/modules/users/users.validator'

export const getAll = async (c: Context) => {
    try {
        const result = await service.getAllUser()
        return c.json(response.successResponse(result))
    } catch (err) {
        return c.json(response.errorResponse(err), 400)
    }
}

export const getById = async (c: Context) => {
    try {
        const userId = Number(c.req.param('id'))
        const result = await service.getUserById(userId)
        return c.json(response.successResponse(result))
    } catch (err) {
        return c.json(response.errorResponse(err), 400)
    }
}

export const create = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = createUserSchema.parse(body)
        const result = await service.createUser(data)
        return c.json(response.successResponse(result))
    } catch (err) {
        return c.json(response.errorResponse(err), 400)
    }
}

export const update = async (c: Context) => {
    try {
        const body = await c.req.json()
        const data = updateUserSchema.parse(body)
        const userId = Number(c.req.param('id'))
        const result = await service.updateUser(userId, data)
        return c.json(response.successResponse(result))
    } catch (err) {
        return c.json(response.errorResponse(err), 400)
    }
}

export const deleteUser = async (c: Context) => {
    try {
        const userId = Number(c.req.param('id'))
        const result = await service.deleteUser(userId)
        return c.json(response.successResponse("Berhasil menghapus data siswa"))
    } catch (err) {
        return c.json(response.errorResponse(err), 400)
    }
}