import { z } from 'zod'

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Nama harus diisi").max(255, "Maksimal 255 karakter"),
    username: z.string().min(1, "Username harus diisi").max(30, "Maksimal panjang username 30 karakter"),
    password: z.string().min(1, "Password harus diisi").optional()
})