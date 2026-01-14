import { z } from 'zod'

export const createMaterialSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    description: z.string().nonempty("Deskripsi Harus Diisi").max(255, "Maksimal 255 karakter")
})

export const updateMaterialSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    description: z.string().nonempty("Deskripsi Harus Diisi").max(255, "Maksimal 255 karakter")
})

export const createSubMaterialVideoSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    contentCategory: z.literal('video'),
    contentUrl: z.string(),
    content: z.string().nonempty("Konten Harus Diisi")
})

export const createSubMaterialPhotoSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    contentCategory: z.literal('photo'),
    contentUrl: z.string().regex(/^data:(image\/(png|jpeg|jpg));base64,/),
    content: z.string().nonempty("Konten Harus Diisi")
})

export const updateSubMaterialVideoSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    contentCategory: z.enum(["video", "photo"]),
    contentUrl: z.string(),
    content: z.string().nonempty("Konten Harus Diisi")
})

export const updateSubMaterialPhotoSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    contentCategory: z.literal('photo'),
    contentUrl: z.string().regex(/^data:(image\/(png|jpeg|jpg));base64,/).optional(),
    content: z.string().nonempty("Konten Harus Diisi")
})