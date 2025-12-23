import * as fs from "fs";
import { join } from "path";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function saveFileBase64(base64: string, folder: string, allowedTypes: string[] = ["image/png", "image/jpeg", "image/jpg"]) {
    if (!base64) throw new Error("File tidak boleh kosong");

    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
        throw new Error("Format base64 tidak valid");
    }

    const mimeType = matches[1];
    const data = matches[2];

    if (!allowedTypes.includes(mimeType)) {
        throw new Error(`Format file tidak valid. Hanya: ${allowedTypes.join(", ")}`);
    }

    const buffer = Buffer.from(data, "base64");

    if (buffer.length > MAX_SIZE) {
        throw new Error("Ukuran file maksimal 2 MB");
    }

    const uploadDir = join(process.cwd(), "src", "storage", "uploads", folder);
    if (!fs.existsSync(uploadDir)) {
        await fs.promises.mkdir(uploadDir, { recursive: true });
    }

    const ext = mimeType.split("/")[1];
    const uniqueName = `${crypto.randomUUID()}.${ext}`;
    const dest = join(uploadDir, uniqueName);

    await fs.promises.writeFile(dest, buffer);

    return `/uploads/${folder}/${uniqueName}`;
}