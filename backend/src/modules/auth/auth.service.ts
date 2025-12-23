import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/utils/jwt';

export class AuthService {
    static async login(username: string, password: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.username, username),
                    eq(users.isActive, true)
                )
            )

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        const accessToken = generateToken({
            sub: user.id,
            username: user.username,
            role: user.role,
        });

        return {
            accessToken,
            user: {
                id: user.id,
                nama: user.name,
                role: user.role
            },
        };
    }
}
