import { z } from 'zod'

export const updateQuizSchema = z.object({
    duration: z.number().min(1, "Minimal durasi 1 (menit)"),
    title: z.string().nonempty("Title Harus Diisi").max(255, "Maksimal 255 karakter"),
    description: z.string().nonempty("Deskripsi Harus Diisi").max(255, "Maksimal 255 karakter"),
    isActive: z.boolean()
})

export const createQuestionSchema = z.object({
    photo: z.string().regex(/^data:(image\/(png|jpeg|jpg));base64,/).optional(),
    question: z.string().nonempty("Pertanyaan Harus Diisi").max(255, "Maksimal 255 karakter"),
    explanation: z.string().nonempty("Penjelasan Harus Diisi").max(255, "Maksimal 255 karakter"),
})