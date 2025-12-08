import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { quizQuestion } from "./quiz-question.schema";

export const questionAnswer = pgTable("question_answer", {
    id: serial("id").primaryKey(),
    questionId: integer("question_id")
        .notNull()
        .references(() => quizQuestion.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    answer: text("answer").notNull(),
    isCorrect: boolean("is_correct").default(false),

    isDelete: boolean("is_delete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
})

export const questionAnswerRelation = relations(questionAnswer, ({ one }) => ({
    quizQuestion: one(quizQuestion, {
        fields: [questionAnswer.questionId],
        references: [quizQuestion.id]
    })
}))