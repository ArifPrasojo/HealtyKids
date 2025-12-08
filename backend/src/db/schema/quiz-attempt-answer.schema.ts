import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { quizAttempt } from "./quiz-attempt.schema";
import { quizQuestion } from "./quiz-question.schema";
import { questionAnswer } from "./question-answer.schema";

export const quizAttemptAnswer = pgTable("quiz_attempt_answer", {
    id: serial("id").primaryKey(),
    attemptId: integer("attempt_id")
        .notNull()
        .references(() => quizAttempt.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    questionId: integer("question_id")
        .notNull()
        .references(() => quizQuestion.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    selectedAnswerId: integer("selected_answer_id")
        .references(() => questionAnswer.id, {
            onDelete: "set null",
            onUpdate: "set null"
        }),
    isCorrect: boolean("is_correct").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow()
});

export const quizAttemptAnswerRelation = relations(quizAttemptAnswer, ({ one }) => ({
    attempt: one(quizAttempt, {
        fields: [quizAttemptAnswer.attemptId],
        references: [quizAttempt.id]
    }),
    question: one(quizQuestion, {
        fields: [quizAttemptAnswer.questionId],
        references: [quizQuestion.id]
    }),
    selectedAnswer: one(questionAnswer, {
        fields: [quizAttemptAnswer.selectedAnswerId],
        references: [questionAnswer.id]
    })
}));
