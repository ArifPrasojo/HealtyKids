import { db } from "@/db/connection";
import { quiz, users } from "@/db/schema";
import { hash } from 'bcryptjs'

export async function runSeed() {
    console.log("🌱 Seeding database...");

    await db
        .insert(users)
        .values([
            {
                name: "Arif",
                username: "arif",
                password: await hash("123456789", 10),
                role: 'student',
            },
            {
                name: "Fikri",
                username: "fikri",
                password: await hash("123456789", 10),
                role: 'student',
            },
            {
                name: "Aldi",
                username: "aldi",
                password: await hash("123456789", 10),
                role: 'student',
            },
            {
                name: "Guru",
                username: "guru",
                password: await hash("123456789", 10),
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
            isActive: true
        })
        .returning()

    console.log("✅ Seeding selesai!");
}

if (import.meta.main) {
    runSeed().finally(() => process.exit(0));
}