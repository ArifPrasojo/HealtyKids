import z from "zod";
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { hash } from 'bcryptjs'
import { createUserSchema, updateUserSchema } from '@/modules/users/users.validator'

type createUserInput = z.infer<typeof createUserSchema>
type updateUserInput = z.infer<typeof updateUserSchema>

export const createUser = async (data: createUserInput) => {
    const { name, username, password } = data
    const [existingUsername] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))

    if (existingUsername) {
        throw new Error('Username sudah digunakan')
    }

    const hashedPassword = await hash(password, 10)
    const result = await db
        .insert(users)
        .values({
            name: name,
            username: username,
            password: hashedPassword
        })
        .returning()

    return result
}