import z from "zod";
import { db } from "@/db"
import { quiz, quizQuestion, questionAnswer } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";
import { updateQuizSchema, createQuestionSchema, updateQuestionSchema } from "@/modules/quiz/quiz.validator";
import { saveFileBase64 } from "@/utils/fileUpload";

type updateQuizInput = z.infer<typeof updateQuizSchema>
type createQuestionInput = z.infer<typeof createQuestionSchema>
type updateQuestionInput = z.infer<typeof updateQuestionSchema>

export const getQuiz = async () => {
    const [result] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.isDelete, false))
        .orderBy(quiz.createdAt)

    return result
}

export const updateQuiz = async (data: updateQuizInput) => {
    const { duration, title, description, isActive } = data
    const existingQuiz = await getQuiz()

    const [result] = await db
        .update(quiz)
        .set({
            duration: duration,
            title: title,
            description: description,
            isActive: isActive,
            updatedAt: new Date(Date.now())
        })
        .where(eq(quiz.id, existingQuiz.id))
        .returning()

    return result
}

export const getAllQuestion = async () => {
    const existingQuiz = await getQuiz()
    const result = await db
        .select()
        .from(quizQuestion)
        .where(
            and(
                eq(quizQuestion.quizId, existingQuiz.id),
                eq(quizQuestion.isDelete, false)
            )
        )

    return result
}

export const getQuestionById = async (questionId: number) => {
    const [existingQuestion] = await db
        .select()
        .from(quizQuestion)
        .where(
            and(
                eq(quizQuestion.id, questionId),
                eq(quizQuestion.isDelete, false)
            )
        )

    if (existingQuestion == null) {
        throw new HttpError(404, "Pertanyaan tidak ditemukan")
    }

    return existingQuestion
}

export const createQuestion = async (data: createQuestionInput) => {
    const existingQuiz = await getQuiz()
    const { photo, question, explanation } = data
    let photoUrl: string | null = null
    if (typeof photo === "string") {
        photoUrl = await saveFileBase64(photo, "question-photos")
    }

    const [result] = await db
        .insert(quizQuestion)
        .values({
            quizId: existingQuiz.id,
            photo: photoUrl,
            question: question,
            explanation: explanation
        })
        .returning()

    return result
}

export const updateQuestion = async (questionId: number, data: updateQuestionInput) => {
    const [existingQuestion] = await db
        .select()
        .from(quizQuestion)
        .where(
            and(
                eq(quizQuestion.id, questionId),
                eq(quizQuestion.isDelete, false)
            )
        )

    if (existingQuestion == null) {
        throw new HttpError(404, "Pertanyaan tidak ditemukan")
    }

    const { photo, question, explanation } = data
    let photoUrl: string | null = null
    if (typeof photo === "string") {
        photoUrl = await saveFileBase64(photo, "question-photos")
    }

    const [result] = await db
        .update(quizQuestion)
        .set({
            photo: photoUrl,
            question: question,
            explanation: explanation,
            updatedAt: new Date(Date.now())

        })
        .where(eq(quizQuestion.id, existingQuestion.id))
        .returning()

    return result
}

export const deleteQuestion = async (questionId: number) => {
    const [existingQuestion] = await db
        .select()
        .from(quizQuestion)
        .where(
            and(
                eq(quizQuestion.id, questionId),
                eq(quizQuestion.isDelete, false)
            )
        )

    if (existingQuestion == null) {
        throw new HttpError(404, "Pertanyaan tidak ditemukan")
    }

    const [result] = await db
        .update(quizQuestion)
        .set({
            isDelete: true,
            updatedAt: new Date(Date.now())
        })
        .where(eq(quizQuestion.id, existingQuestion.id))
        .returning()

    return
}