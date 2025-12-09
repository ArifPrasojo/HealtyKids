import { pgTable, serial, varchar, boolean, timestamp, char, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { materials } from "./material.schema";
import { progresses } from "./progresses.schema";

export const roleEnum = pgEnum("role", ["student", "teacher"])

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    username: char("username", { length: 30 }).unique(),
    password: varchar("password").notNull(),
    role: roleEnum("role").default('student').notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
})

export const userRelation = relations(users, ({ many }) => ({
    materials: many(materials),
    progresses: many(progresses)
}))