import { z } from 'zod'

export const createMaterialSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    description: z.string().nonempty("Deskripsi Harus Diisi").max(255, "Maksimal 255 karakter")
})

export const updateMaterialSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    description: z.string().nonempty("Deskripsi Harus Diisi").max(255, "Maksimal 255 karakter")
})

export const createSubMaterialSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    videoUrl: z.string().optional(),
    content: z.string().nonempty("Konten Harus Diisi")
})

export const updateSubMateriSchema = z.object({
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    videoUrl: z.string().optional(),
    content: z.string().nonempty("Konten Harus Diisi")
})