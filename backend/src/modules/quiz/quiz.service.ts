import z from "zod";
import { db } from "@/db"
import { quiz, quizQuestion, questionAnswer } from "@/db/schema"
import { eq, and, ne, sql } from 'drizzle-orm'
import { HttpError } from "@/utils/httpError";

export const getQuiz = async () => {
    const [result] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.isDelete, false))
        .orderBy(quiz.createdAt)

    return result
}