import jwt, { type SignOptions } from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET) as jwt.Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN) as SignOptions["expiresIn"];

export interface TokenPayload {
    sub: number;
    role: string;
    username: string;
}

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as unknown as TokenPayload;
    } catch {
        return null;
    }
}
