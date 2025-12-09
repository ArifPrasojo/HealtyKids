import { pgTable, serial, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from './user.schema'
import { subMaterial } from './sub-material.schema'

export const materials = pgTable("materials", {
    id: serial("id").primaryKey(),
    title: varchar("title").notNull(),
    description: text("description"),
    isDelete: boolean("is_delete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
});

export const materialRelation = relations(materials, ({ many }) => ({
    subMaterial: many(subMaterial)
}))