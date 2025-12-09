import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from './user.schema'
import { subMaterial } from './sub-material.schema'

export const progresses = pgTable("progresses", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    subMaterialId: integer("sub_material_id")
        .notNull()
        .references(() => subMaterial.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    isComplete: boolean("is_complete").default(true).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const progressesRelation = relations(progresses, ({one})=> ({
    student: one(users, {
        fields: [progresses.studentId],
        references: [users.id]
    }),
    subMaterial: one(subMaterial, {
        fields: [progresses.subMaterialId],
        references: [subMaterial.id]
    })
}))