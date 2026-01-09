import z from "zod";
import { db } from "@/db";
import { quiz, quizQuestion, questionAnswer, quizAttempt, quizAttemptAnswer, users } from "@/db/schema";
import { eq, and, inArray } from 'drizzle-orm';
import { HttpError } from "@/utils/httpError";
import { getDataAdmin, getDataStudent } from '@/utils/userData';

// SERVICE ADMIN/TEACHER
export const getProfileAdmin = async (user: any) => {
    const { sub } = user
    const adminData = await getDataAdmin(sub)

    return {
        name: adminData.name,
        username: adminData.username
    }
}