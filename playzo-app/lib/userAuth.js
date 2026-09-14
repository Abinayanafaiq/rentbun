import crypto from "crypto";
import { cookies } from "next/headers";
import { USER_SECRET, safeEqual } from "@/lib/secrets";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(derived, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function userToken(userId) {
  return crypto
    .createHmac("sha256", USER_SECRET)
    .update(`rentzo-user-${userId}`)
    .digest("hex");
}

export async function setUserSession(userId) {
  const store = await cookies();
  store.set("pz_user", `${userToken(userId)}.${userId}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 hari
  });
}

export async function clearUserSession() {
  const store = await cookies();
  store.delete("pz_user");
}

export async function getUserId() {
  const store = await cookies();
  const token = store.get("pz_user")?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

function verifyUserToken(token) {
  // token format: "hmac.userId"
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const hmac = token.slice(0, dot);
  const userId = Number(token.slice(dot + 1));
  if (!userId) return null;
  if (!safeEqual(userToken(userId), hmac)) return null;
  return userId;
}

export async function getCurrentUser() {
  const id = await getUserId();
  if (!id) return null;
  const { q } = await import("@/lib/db");
  const { rows } = await q("SELECT id, name, email, wa, created_at FROM users WHERE id = $1", [id]);
  return rows[0] || null;
}
