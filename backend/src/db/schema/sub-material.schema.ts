import { pgTable, serial, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { materials } from "./material.schema";
import { progresses } from "./progresses.schema";

export const subMaterial = pgTable("sub_material", {
    id: serial("id").primaryKey(),
    materialId: integer("material_id")
        .notNull()
        .references(() => materials.id, {
            onDelete: "cascade",
            onUpdate: "cascade"
        }),
    title: varchar("title").notNull(),
    videoUrl: text("video_url"),
    content: text("content").notNull(),
    isDelete: boolean("is_delete").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
})

export const subMaterialRelation = relations(subMaterial, ({ one, many }) => ({
    material: one(materials, {
        fields: [subMaterial.materialId],
        references: [materials.id]
    }),
    progresses: many(progresses)
}))