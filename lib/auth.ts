import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "city_session_token";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
const SECRET = process.env.NEXTAUTH_SECRET || "dev-fallback-secret-city-builder-key-32chars";

export interface SessionPayload {
  userId: string;
  username: string;
  exp: number; // Expiration timestamp in seconds
}

// -------------------------------------------------------------
// Cryptographically Secure Password Hashing (Scrypt + Salt)
// -------------------------------------------------------------
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, "hex");
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Tamper-Proof HMAC-SHA256 Session Tokens
// -------------------------------------------------------------
function base64UrlEncode(data: string | Buffer): string {
  return Buffer.from(data)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function signToken(payload: { userId: string; username: string }): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const body = JSON.stringify({ ...payload, exp });

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(body);
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(dataToSign)
    .digest();
  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(dataToSign)
      .digest();
    const expectedSigBase64 = base64UrlEncode(expectedSignature);

    if (signature !== expectedSigBase64) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired token
    }

    return payload;
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// Next.js Cookie Session Management
// -------------------------------------------------------------
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAuthenticatedUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      city: {
        include: {
          buildings: true,
        },
      },
    },
  });

  return user;
}
