import type { Context, Next } from "hono";

export const authorize = (allowedRoles: string[]) => {
    return async (c: Context, next: Next) => {
        const user = c.get("user");

        if (!user || !allowedRoles.includes(user.role)) {
            return c.json({ message: "Forbidden" }, 403);
        }

        await next();
    };
};