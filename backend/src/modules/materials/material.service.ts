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

export const updateMaterial = async (materialId: number, data: updateMaterialInput) => {
    const [existingMaterial] = await db
        .select()
        .from(materials)
        .where(
            and(
                eq(materials.id, materialId),
                eq(materials.isDelete, false)
            )
        )

    if (existingMaterial == null) {
        throw new HttpError(404, "Materi tidak ditemukan")
    }

    const { title, description } = data
    const [result] = await db
        .update(materials)
        .set({
            title: title,
            description: description,
            updatedAt: new Date(Date.now())
        })
        .where(eq(materials.id, existingMaterial.id))
        .returning()

    return result
}

export const deleteMaterial = async (materialId: number) => {
    const [existingMaterial] = await db
        .select()
        .from(materials)
        .where(
            and(
                eq(materials.id, materialId),
                eq(materials.isDelete, false)
            )
        )

    if (existingMaterial == null) {
        throw new HttpError(404, "Materi tidak ditemukan")
    }

    const [result] = await db
        .update(materials)
        .set({
            isDelete: true,
            updatedAt: new Date(Date.now())
        })
        .where(eq(materials.id, existingMaterial.id))
        .returning()

    return
}

export const getAllSubMateri = async (materialId: number) => {
    const [existingMaterial] = await db
        .select()
        .from(materials)
        .where(
            and(
                eq(materials.id, materialId),
                eq(materials.isDelete, false)
            )
        )

    if (existingMaterial == null) {
        throw new HttpError(404, "Materi tidak ditemukan")
    }

    const result = await db
        .select()
        .from(subMaterial)
        .where(
            and(
                eq(subMaterial.materialId, existingMaterial.id),
                eq(subMaterial.isDelete, false)
            )
        )

    return result
}

export const getSubMaterialById = async (materialId: number, subMaterialId: number) => {
    const [existingMaterial] = await db
        .select()
        .from(materials)
        .where(
            and(
                eq(materials.id, materialId),
                eq(materials.isDelete, false)
            )
        )

    if (existingMaterial == null) {
        throw new HttpError(404, "Materi tidak ditemukan")
    }

    const [existingSubMaterial] = await db
        .select()
        .from(subMaterial)
        .where(
            and(
                eq(subMaterial.id, subMaterialId),
                eq(subMaterial.isDelete, false)
            )
        )

    if (existingMaterial == null) {
        throw new HttpError(404, "Sub Materi tidak ditemukan")
    }

    return existingSubMaterial
}