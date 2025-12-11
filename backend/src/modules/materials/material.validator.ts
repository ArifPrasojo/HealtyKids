import { z } from 'zod'

export const createMaterialSchema = z.object({
    title: z.string().min(1, "Nama harus diisi").max(255, "Maksimal 255 karakter"),
    desctiption: z.string().min(1, "Nama harus diisi").max(255, "Maksimal 255 karakter")
})

export const updateMaterialSchema = z.object({
    title: z.string().min(1, "Nama harus diisi").max(255, "Maksimal 255 karakter"),
    desctiption: z.string().min(1, "Nama harus diisi").max(255, "Maksimal 255 karakter")
})