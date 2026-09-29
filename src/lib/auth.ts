import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "sde_guide_super_secret_jwt_key_2026_prod_ready";
const TOKEN_NAME = "sde_auth_token";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export function signJwtToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUserFromRequest(req?: NextRequest): Promise<JWTPayload | null> {
  let token: string | undefined;

  // 1. Try Authorization header
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  // 2. Try cookie if header token not present
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(TOKEN_NAME)?.value;
    } catch {
      // ignore
    }
  }

  if (!token) return null;
  return verifyJwtToken(token);
}

export { TOKEN_NAME };
