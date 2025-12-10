import { pgTable, serial, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { quizQuestion } from "./quiz-question.schema";

export const quiz = pgTable("quiz", {
    id: serial("id").primaryKey(),
    duration: integer("duration").notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 150 }),
    isActive: boolean("is_active").notNull().default(false),
    isDelete: boolean("is_delete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
})

export const quizRelation = relations(quiz, ({ many }) => ({
    questions: many(quizQuestion)
}))