import type { Context } from 'hono'
import * as service from '@/modules/users/user.service'
import * as response from '@/utils/response'
import { createUserSchema, updateUserSchema } from '@/modules/users/users.validator'

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