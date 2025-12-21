import z from "zod";
import { db } from "@/db"
import { quiz, quizQuestion, questionAnswer } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";
import { updateQuizSchema } from "@/modules/quiz/quiz.validator";

type updateQuizInput = z.infer<typeof updateQuizSchema>

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