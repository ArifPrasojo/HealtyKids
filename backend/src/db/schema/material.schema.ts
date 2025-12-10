import { pgTable, serial, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { subMaterial } from './sub-material.schema'

export const materials = pgTable("materials", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: varchar("description", { length: 150 }),
    isDelete: boolean("is_delete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
});

export const materialRelation = relations(materials, ({ many }) => ({
    subMaterial: many(subMaterial)
}))