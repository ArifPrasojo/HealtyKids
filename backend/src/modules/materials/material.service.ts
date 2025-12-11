import z from "zod";
import { db } from "@/db"
import { materials, subMaterial } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
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