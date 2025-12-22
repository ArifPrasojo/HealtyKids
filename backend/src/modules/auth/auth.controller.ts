import type { Context } from "hono";
import { AuthService } from "@/modules/auth/auth.service";
import { loginSchema } from "@/modules/auth/auth.validator";

export const login = async (c: Context) => {
    const body = await c.req.json();
    const parse = loginSchema.safeParse(body);

    if (!parse.success) {
        return c.json({ success: false, message: "Invalid input" }, 400);
    }

    const { username, password } = parse.data;
    const result = await AuthService.login(username, password);

    if (!result) return c.json({ success: false, message: "Invalid credentials" }, 401);

    let redirectUrl = "/";
    switch (result.user.role) {
        case "teacher":
            redirectUrl = "/admin/dashboard";
            break;
        case "student":
            redirectUrl = "/dashboard";
            break;
    }

    return c.json({
        success: true,
        access_token: result.accessToken,
        token_type: "bearer",
        user: result.user,
        redirect_url: redirectUrl,
    });
};
