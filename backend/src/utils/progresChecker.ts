import { db } from "@/db"
import { subMaterial, progresses } from "@/db/schema"
import { eq, and, sql } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";

export const checkProgres = async (studentId: number) => {
    const [progress] = await db
        .select({
            total: sql<number>`COUNT(DISTINCT ${subMaterial.id})`,
            done: sql<number>`COUNT(DISTINCT ${progresses.subMaterialId})`
        })
        .from(subMaterial)
        .leftJoin(
            progresses,
            and(
                eq(progresses.subMaterialId, subMaterial.id),
                eq(progresses.studentId, studentId)
            )
        )
        .where(eq(subMaterial.isDelete, false))

    if (progress.done < progress.total) {
        throw new HttpError(403, `Selesaikan semua materi terlebih dahulu (${progress.done}/${progress.total})`)
    }

    return progress
} 