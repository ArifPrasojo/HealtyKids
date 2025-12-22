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

export const updateQuestionSchema = z.object({
    photo: z.string().regex(/^data:(image\/(png|jpeg|jpg));base64,/).optional(),
    question: z.string().nonempty("Pertanyaan Harus Diisi").max(255, "Maksimal 255 karakter"),
    explanation: z.string().nonempty("Penjelasan Harus Diisi").max(255, "Maksimal 255 karakter"),
})

const answerQuestionItem = z.object({
    answerId: z.number().int().positive(),
    answer: z.string().nonempty("Jawaban Harus Diisi"),
    isCorrect: z.boolean()
})

export const updateAnswerQuestionSchema = z.object({
    answer: z.array(answerQuestionItem).min(5, "Jawaban harus ada 5").max(5, "Jawaban harus ada 5")
})