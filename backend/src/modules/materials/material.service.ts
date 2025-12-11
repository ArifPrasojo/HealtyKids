import z from "zod";
import { db } from "@/db"
import { materials, subMaterial } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";
import { createMaterialSchema, updateMaterialSchema } from '@/modules/materials/material.validator'

type createMaterialInput = z.infer<typeof createMaterialSchema>
type updateMaterialInput = z.infer<typeof updateMaterialSchema>

export const getAllMaterial = async () => {
    const result = await db
        .select()
        .from(materials)
        .where(
            eq(materials.isDelete, false)
        )

    return result
}

export const getMaterialById = async (materialId: number) => {
    const [result] = await db
        .select()
        .from(materials)
        .where(
            and(
                eq(materials.id, materialId),
                eq(materials.isDelete, false)
            )
        )

    if (result == null) {
        throw new HttpError(404, "Materi tidak ditemukan")
    }

    return result
}

export const createMaterial = async (data: createMaterialInput) => {
    const { title, description } = data
    const [result] = await db
        .insert(materials)
        .values({
            title: title,
            description: description
        })
        .returning()

    return result
}