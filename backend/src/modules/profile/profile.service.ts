import z from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, ne } from 'drizzle-orm';
import { HttpError } from "@/utils/httpError";
import { getDataAdmin, getDataStudent } from '@/utils/userData';
import { updateProfileSchema } from "@/modules/profile/profile.validator";
import { hash } from "bcryptjs";

type updateProfileInput = z.infer<typeof updateProfileSchema>

// SERVICE ADMIN/TEACHER
export const getProfileAdmin = async (user: any) => {
    const { sub } = user
    const adminData = await getDataAdmin(sub)

    return {
        name: adminData.name,
        username: adminData.username
    }
}

export const updateProfileAdmin = async (user: any, data: updateProfileInput) => {
    const { sub } = user
    const adminData = await getDataAdmin(sub)
    const { name, username, password } = data

    const [existingUsername] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.username, username),
                ne(users.id, adminData.id)
            )
        )

    if (existingUsername) {
        throw new HttpError(409, 'Username sudah digunakan')
    }

    const profileUpdateData: Partial<updateProfileInput> = {
        name,
        username
    }

    if (password && password.trim() !== '') {
        const hashedPassword = await hash(password, 10)
        profileUpdateData.password = hashedPassword
    }

    const [result] = await db
        .update(users)
        .set({
            ...profileUpdateData,
            updatedAt: new Date(Date.now())
        })
        .where(eq(users.id, adminData.id))
        .returning({
            name: users.name,
            username: users.username
        })

    return result
}

// SERVICE STUDENT
export const getProfileStudent = async (user: any) => {
    const { sub } = user
    const studentData = await getDataStudent(sub)

    return {
        name: studentData.name,
        username: studentData.username
    }
}

export const updateProfileStudent = async (user: any, data: updateProfileInput) => {
    const { sub } = user
    const studentData = await getDataStudent(sub)
    const { name, username, password } = data

    const [existingUsername] = await db
        .select()
        .from(users)
        .where(
            and(
                eq(users.username, username),
                ne(users.id, studentData.id)
            )
        )

    if (existingUsername) {
        throw new HttpError(409, 'Username sudah digunakan')
    }

    const profileUpdateData: Partial<updateProfileInput> = {
        name,
        username
    }

    if (password && password.trim() !== '') {
        const hashedPassword = await hash(password, 10)
        profileUpdateData.password = hashedPassword
    }

    const [result] = await db
        .update(users)
        .set({
            ...profileUpdateData,
            updatedAt: new Date(Date.now())
        })
        .where(eq(users.id, studentData.id))
        .returning({
            name: users.name,
            username: users.username
        })

    return result
}