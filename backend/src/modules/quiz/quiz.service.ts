import z from "zod";
import { db } from "@/db"
import { quiz, quizQuestion, questionAnswer } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";
import { updateQuizSchema, createQuestionSchema, updateQuestionSchema, updateAnswerQuestionSchema } from "@/modules/quiz/quiz.validator";
import { saveFileBase64 } from "@/utils/fileUpload";

type updateQuizInput = z.infer<typeof updateQuizSchema>
type createQuestionInput = z.infer<typeof createQuestionSchema>
type updateQuestionInput = z.infer<typeof updateQuestionSchema>
type updateQuestionAnswerInput = z.infer<typeof updateAnswerQuestionSchema>

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

    const result = await db.transaction(async (tx) => {
        const [createQuestion] = await tx
            .insert(quizQuestion)
            .values({
                quizId: existingQuiz.id,
                photo: photoUrl,
                question: question,
                explanation: explanation
            })
            .returning()

        const createAnswer = await tx
            .insert(questionAnswer)
            .values([
                {
                    questionId: createQuestion.id,
                    answer: "Ini Jawaban 1",
                    isCorrect: true
                },
                {
                    questionId: createQuestion.id,
                    answer: "Ini Jawaban 2",
                    isCorrect: false
                },
                {
                    questionId: createQuestion.id,
                    answer: "Ini Jawaban 3",
                    isCorrect: false
                },
                {
                    questionId: createQuestion.id,
                    answer: "Ini Jawaban 4",
                    isCorrect: false
                },
                {
                    questionId: createQuestion.id,
                    answer: "Ini Jawaban 5",
                    isCorrect: false
                }
            ])
            .returning()

        return createQuestion
    })

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

export const getAllAnswer = async (questionId: number) => {
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

    const result = await db
        .select()
        .from(questionAnswer)
        .where(eq(questionAnswer.questionId, existingQuestion.id))

    return result
}

export const updateQuestionAnswer = async (questionId: number, data: updateQuestionAnswerInput) => {
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

    const result = await db.transaction(async (tx) => {
        const resultUpdate = []
        for (const item of data.answer) {
            const updateAnswer = await tx
                .update(questionAnswer)
                .set({
                    answer: item.answer,
                    isCorrect: item.isCorrect,
                    updatedAt: new Date(Date.now())
                })
                .where(eq(questionAnswer.id, item.answerId))
                .returning()

            resultUpdate.push(...updateAnswer)
        }
        return resultUpdate
    })

    return result
}

// SERVICE STUDENT
export const getQuizStudent = async () => {
    const [result] = await db.query.quiz.findMany({
        columns: {
            duration: true,
            title: true,
            description: true,
            isActive: true,
        },
        where: (q, { eq }) => eq(q.isDelete, false),
        with: {
            questions: {
                columns: {
                    id: true,
                    photo: true,
                    question: true,
                    explanation: true,
                },
                where: (qq, { eq }) => eq(qq.isDelete, false),
                with: {
                    answers: {
                        columns: {
                            id: true,
                            questionId: true,
                            answer: true,
                        },
                        where: (qa, { eq }) => eq(qa.isDelete, false)
                    }
                }
            }
        }
    })

    if (result.isActive == false) {
        throw new HttpError(404, "Quiz Belum Dimulai")
    }

    return result
}