import { db } from "@/db/connection";
import { quiz, users } from "@/db/schema";
import { hash } from 'bcryptjs'

export async function runSeed() {
    console.log("🌱 Seeding database...");

    await db
        .insert(users)
        .values([
            {
                name: "Farhan",
                username: "farhan",
                password: await hash("Farhan1029", 10),
                role: 'teacher',
            },

        ])
        .returning();

    await db
        .insert(quiz)
        .values({
            duration: 30,
            title: "Quiz",
            description: "Deskripsi quiz",
            isActive: false
        })
        .returning()

    console.log("✅ Seeding selesai!");
}

if (import.meta.main) {
    runSeed().finally(() => process.exit(0));
}