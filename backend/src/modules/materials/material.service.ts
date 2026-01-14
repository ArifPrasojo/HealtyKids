import z from "zod";
import { db } from "@/db";
import { materials, progresses, subMaterial } from "@/db/schema";
import { eq, and, sql } from 'drizzle-orm';
import { HttpError } from "@/utils/httpError";
import { saveFileBase64 } from "@/utils/fileUpload";
import {
    createMaterialSchema,
    updateMaterialSchema,
    createSubMaterialVideoSchema,
    createSubMaterialPhotoSchema,
    updateSubMaterialVideoSchema,
    updateSubMaterialPhotoSchema
} from '@/modules/materials/material.validator';
import { getDataStudent } from '@/utils/userData';

type createMaterialInput = z.infer<typeof createMaterialSchema>
type updateMaterialInput = z.infer<typeof updateMaterialSchema>
type createSubMaterialVideoInput = z.infer<typeof createSubMaterialVideoSchema>
type createSubMaterialPhotoInput = z.infer<typeof createSubMaterialPhotoSchema>
type updateSubMaterialVideoInput = z.infer<typeof updateSubMaterialVideoSchema>
type updateSubMaterialPhotoInput = z.infer<typeof updateSubMaterialPhotoSchema>

// SERVICE ADMIN/TEACHER
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

    const result = await db.transaction(async (tx) => {
        const [materialData] = await tx
            .update(materials)
            .set({
                isDelete: true,
                updatedAt: new Date(Date.now())
            })
            .where(eq(materials.id, existingMaterial.id))
            .returning()

        const subMaterialData = await tx
            .update(subMaterial)
            .set({
                isDelete: true,
                updatedAt: new Date(Date.now())
            })
            .where(eq(subMaterial.materialId, materialData.id))

        return materialData
    })

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

    if (existingSubMaterial == null) {
        throw new HttpError(404, "Sub Materi tidak ditemukan")
    }

    return existingSubMaterial
}

export const createSubMaterialVideo = async (materialId: number, data: createSubMaterialVideoInput) => {
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

    const { title, contentCategory, contentUrl, content } = data
    const [result] = await db
        .insert(subMaterial)
        .values({
            materialId: existingMaterial.id,
            title: title,
            contentCategory: contentCategory,
            contentUrl: contentUrl,
            content: content
        })
        .returning()

    return result
}

export const createSubMaterialPhoto = async (materialId: number, data: createSubMaterialPhotoInput) => {
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

    const { title, contentCategory, contentUrl, content } = data
    const urlContent = await saveFileBase64(contentUrl, "material-photos")
    const [result] = await db
        .insert(subMaterial)
        .values({
            materialId: existingMaterial.id,
            title: title,
            contentCategory: contentCategory,
            contentUrl: urlContent,
            content: content
        })
        .returning()

    return result
}

export const updateSubMaterialVideo = async (materialId: number, subMaterialId: number, data: updateSubMaterialVideoInput) => {
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
                eq(subMaterial.materialId, existingMaterial.id),
                eq(subMaterial.id, subMaterialId),
                eq(subMaterial.isDelete, false)
            )
        )

    if (existingSubMaterial == null) {
        throw new HttpError(404, "Sub Materi tidak ditemukan")
    }

    const { title, contentCategory, contentUrl, content } = data
    const [result] = await db
        .update(subMaterial)
        .set({
            title: title,
            contentCategory: contentCategory,
            contentUrl: contentUrl,
            content: content,
            updatedAt: new Date(Date.now())
        })
        .where(eq(subMaterial.id, existingSubMaterial.id))
        .returning()

    return result
}

export const updateSubMaterialPhoto = async (materialId: number, subMaterialId: number, data: updateSubMaterialPhotoInput) => {
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
                eq(subMaterial.materialId, existingMaterial.id),
                eq(subMaterial.id, subMaterialId),
                eq(subMaterial.isDelete, false)
            )
        )

    if (existingSubMaterial == null) {
        throw new HttpError(404, "Sub Materi tidak ditemukan")
    }

    const { title, contentCategory, contentUrl, content } = data
    const subMaterialUpdateData: Partial<updateSubMaterialPhotoInput> = {
        title,
        contentCategory,
        content
    }

    if (contentUrl && contentUrl.trim() !== '') {
        const urlContent = await saveFileBase64(contentUrl, "material-photos")
        subMaterialUpdateData.contentUrl = urlContent
    }

    const [result] = await db
        .update(subMaterial)
        .set({
            ...subMaterialUpdateData,
            updatedAt: new Date(Date.now())
        })
        .where(eq(subMaterial.id, existingSubMaterial.id))
        .returning()

    return result
}

export const deleteSubMaterial = async (materialId: number, subMaterialId: number) => {
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
                eq(subMaterial.materialId, existingMaterial.id),
                eq(subMaterial.id, subMaterialId),
                eq(subMaterial.isDelete, false)
            )
        )

    if (existingSubMaterial == null) {
        throw new HttpError(404, "Sub Materi tidak ditemukan")
    }

    await db
        .update(subMaterial)
        .set({
            isDelete: true,
            updatedAt: new Date(Date.now())
        })
        .where(eq(subMaterial.id, existingSubMaterial.id))
        .returning()

    return
}

// SERVICE STUDENT
export const getAllMaterialStudent = async (user: any) => {
    const { sub } = user
    const studentData = await getDataStudent(sub)
    const materialData = await db
        .select({
            id: materials.id,
            title: materials.title,
            description: materials.description,
            totalSubMaterial: sql<number>`COUNT(DISTINCT ${subMaterial.id})`,
            totalSubMaterialRead: sql<number>`COUNT(DISTINCT ${progresses.id})`
        })
        .from(materials)
        .leftJoin(subMaterial,
            and(
                eq(subMaterial.materialId, materials.id),
                eq(subMaterial.isDelete, false)
            )
        )
        .leftJoin(progresses,
            and(
                eq(progresses.subMaterialId, subMaterial.id),
                eq(progresses.studentId, studentData.id)
            )
        )
        .where(eq(materials.isDelete, false))
        .groupBy(materials.id)

    return { materials: materialData }
}

export const getAllSubMaterialStudent = async (user: any, materialId: number) => {
    const { sub } = user
    const studentData = await getDataStudent(sub)
    const subMaterialData = await db
        .select({
            id: subMaterial.id,
            title: subMaterial.title,
            contentCategory: subMaterial.contentCategory,
            contentUrl: subMaterial.contentUrl,
            content: subMaterial.content,
            isDone: sql<boolean>`CASE WHEN ${progresses.id} IS NOT NULL THEN true ELSE false END`
        })
        .from(subMaterial)
        .leftJoin(progresses,
            and(
                eq(progresses.subMaterialId, subMaterial.id),
                eq(progresses.studentId, studentData.id)
            )
        )
        .where(
            and(
                eq(subMaterial.materialId, materialId),
                eq(subMaterial.isDelete, false)
            )
        )
        .orderBy(subMaterial.id)

    return subMaterialData
}

export const postProgresSubMaterialStudent = async (user: any, materialId: number, subMaterialId: number) => {
    const { sub } = user
    const studentData = await getDataStudent(sub)
    const [existingSubMaterial] = await db
        .select()
        .from(subMaterial)
        .where(
            and(
                eq(subMaterial.materialId, materialId),
                eq(subMaterial.id, subMaterialId),
                eq(subMaterial.isDelete, false)
            )
        )

    if (existingSubMaterial == null) {
        throw new HttpError(404, "Sub Materi tidak ditemukan")
    }

    const [existingProgresses] = await db
        .select()
        .from(progresses)
        .where(
            and(
                eq(progresses.studentId, studentData.id),
                eq(progresses.subMaterialId, existingSubMaterial.id)
            )
        )

    if (existingProgresses != null) {
        throw new HttpError(500, "Sub Materi sudah pernah dibaca")
    }

    const [result] = await db
        .insert(progresses)
        .values({
            studentId: studentData.id,
            subMaterialId: existingSubMaterial.id,
        })
        .returning()

    return result
}