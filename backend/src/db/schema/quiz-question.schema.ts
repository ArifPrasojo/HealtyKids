import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { quiz } from './quiz.schema'
import { questionAnswer } from './question-answer.schema'

export const quizQuestion = pgTable("quiz_question", {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
        .notNull()
        .references(() => quiz.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    photo: text("photo"),
    question: text("question").notNull(),
    explanation: text("explanation").notNull(),
    isDelete: boolean("is_delete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
})

export const quizQuestionRelation = relations(quizQuestion, ({ one, many }) => ({
    quiz: one(quiz, {
        fields: [quizQuestion.quizId],
        references: [quiz.id]
    }),
    answers: many(questionAnswer)
}))