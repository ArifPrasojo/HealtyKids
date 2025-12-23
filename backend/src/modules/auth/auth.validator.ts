import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(3, "Minimal 3 karakter"),
    password: z.string().min(6, "Minimal 6 karakter")
});
