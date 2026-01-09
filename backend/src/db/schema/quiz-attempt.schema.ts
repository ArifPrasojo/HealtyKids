import { pgTable, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./user.schema";
import { quiz } from "./quiz.schema";
import { quizAttemptAnswer } from "./quiz-attempt-answer.schema";

export const quizAttempt = pgTable("quiz_attempt", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    quizId: integer("quiz_id")
        .notNull()
        .references(() => quiz.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    score: integer("score"),
    finishedAt: timestamp("finished_at").notNull().defaultNow()
});

export const quizAttemptRelation = relations(quizAttempt, ({ one, many }) => ({
    student: one(users, {
        fields: [quizAttempt.studentId],
        references: [users.id]
    }),
    quiz: one(quiz, {
        fields: [quizAttempt.quizId],
        references: [quiz.id]
    }),
    answers: many(quizAttemptAnswer)
}));
