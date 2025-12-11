import z from "zod";
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { HttpError } from '@/utils/httpError'
import { hash } from 'bcryptjs'
import { createUserSchema, updateUserSchema } from '@/modules/users/users.validator'

type createUserInput = z.infer<typeof createUserSchema>
type updateUserInput = z.infer<typeof updateUserSchema>

export const getAllUser = async () => {
    const result = await db
        .select({
            id: users.id,
            name: users.name,
            username: users.username,
            createdAt: users.createdAt
        })
        .from(users)
        .where(
            and(
                eq(users.isActive, true),
                eq(users.role, 'student')
            )
        )

    return result
}

export const getUserById = async (userId: number) => {
    const [existingUser] = await db
        .select({
            id: users.id,
            name: users.name,
            username: users.username,
            createdAt: users.createdAt
        })
        .from(users)
        .where(
            and(
                eq(users.id, userId),
                eq(users.role, 'student'),
                eq(users.isActive, true)
            )
        )

    if (existingUser == null) {
        throw new HttpError(404, 'User tidak ditemukan')
    }

    return existingUser
}

export const createUser = async (data: createUserInput) => {
    const { name, username, password } = data
    const [existingUsername] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))

    if (existingUsername) {
        throw new HttpError(409, 'Username sudah digunakan')
    }

    const hashedPassword = await hash(password, 10)
    const [result] = await db
        .insert(users)
        .values({
            name: name,
            username: username,
            password: hashedPassword
        })
        .returning({
            id: users.id,
            name: users.name,
            username: users.username,
            role: users.role,
            createdAt: users.createdAt
        })

    return result
}

export const updateUser = async (userId: number, data: updateUserInput) => {
    const [existingUser] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.id, userId),
                eq(users.role, 'student'),
                eq(users.isActive, true)
            )
        )

    if (existingUser == null) {
        throw new HttpError(404, 'User tidak ditemukan')
    }

    const { name, username, password } = data
    const [existingUsername] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.username, username),
                ne(users.id, existingUser.id)
            )
        )

    if (existingUsername) {
        throw new HttpError(409, 'Username sudah digunakan')
    }

    const userUpdateData: Partial<updateUserInput> = {
        name,
        username
    }

    if (password && password.trim() !== '') {
        const hashedPassword = await hash(password, 10)
        userUpdateData.password = hashedPassword
    }

    const [result] = await db
        .update(users)
        .set({
            ...userUpdateData,
            updatedAt: new Date(Date.now())
        })
        .where(
            and(
                eq(users.id, userId),
                eq(users.isActive, true)
            )
        )
        .returning({
            name: users.name,
            username: users.username
        })

    return result

}

export const deleteUser = async (userId: number) => {
    const [existingUser] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.id, userId),
                eq(users.role, 'student'),
                eq(users.isActive, true)
            )
        )

    if (existingUser == null) {
        throw new HttpError(404, 'User tidak ditemukan')
    }

    const result = await db
        .update(users)
        .set({
            isActive: false,
            updatedAt: new Date(Date.now())
        })
        .where(eq(users.id, existingUser.id))

    return result
}