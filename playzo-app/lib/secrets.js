import crypto from "crypto";

function getSecret(envVar, fallback) {
  const v = process.env[envVar];
  if (v && v.length >= 16) return v;
  // Fallback dev dengan warning
  if (process.env.NODE_ENV !== "production") return fallback;
  // Produksi tanpa secret = layanan tidak boleh berjalan
  throw new Error(
    `${envVar} must be set to at least 16 characters in production`
  );
}

export const ADMIN_SECRET =
  process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length >= 16
    ? process.env.ADMIN_SECRET
    : process.env.NODE_ENV !== "production"
      ? "dev-secret"
      : undefined;

export const USER_SECRET = getSecret("USER_SECRET", "rentzo-user-secret");
export const MARKETER_SECRET = getSecret(
  "MARKETER_SECRET",
  "rentzo-marketer-secret"
);

export function hmacToken(secret, label, id) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${label}-${id}`)
    .digest("hex");
}

export function safeEqual(a, b) {
  const ba = Buffer.from(String(a || ""));
  const bb = Buffer.from(String(b || ""));
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}
