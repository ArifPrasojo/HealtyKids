import { db } from "@/db"
import { users } from "@/db/schema"
import { eq, and } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";

export const getDataAdmin = async (adminId: number) => {
    const [result] = await db
        .select({
            id: users.id,
            name: users.name,
            username: users.username,
        })
        .from(users)
        .where(
            and(
                eq(users.role, 'teacher'),
                eq(users.isActive, true),
                eq(users.id, adminId)
            )
        )

    if (!result) throw new HttpError(500, "Kesalahan Sistem")
    return result
}

export const getDataStudent = async (studentId: number) => {
    const [result] = await db
        .select({
            id: users.id,
            name: users.name,
            username: users.username,
        })
        .from(users)
        .where(
            and(
                eq(users.role, 'student'),
                eq(users.isActive, true),
                eq(users.id, studentId)
            )
        )
    if (!result) throw new HttpError(500, "Kesalahan Sistem")
    return result
}