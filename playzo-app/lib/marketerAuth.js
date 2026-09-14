import crypto from "crypto";
import { cookies } from "next/headers";
import { MARKETER_SECRET, safeEqual } from "@/lib/secrets";

export function marketerToken(marketerId) {
  return crypto
    .createHmac("sha256", MARKETER_SECRET)
    .update(`rentzo-marketer-${marketerId}`)
    .digest("hex");
}

export async function setMarketerSession(marketerId) {
  const store = await cookies();
  store.set("pz_marketer", `${marketerToken(marketerId)}.${marketerId}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 hari
  });
}

export async function clearMarketerSession() {
  const store = await cookies();
  store.delete("pz_marketer");
}

export async function getMarketerId() {
  const store = await cookies();
  const token = store.get("pz_marketer")?.value;
  if (!token) return null;

  // token format: "hmac.marketerId"
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const hmac = token.slice(0, dot);
  const marketerId = Number(token.slice(dot + 1));
  if (!marketerId) return null;
  if (!safeEqual(marketerToken(marketerId), hmac)) return null;
  return marketerId;
}

// Marketer yang sedang login. Marketer nonaktif otomatis dianggap tidak login.
export async function getCurrentMarketer() {
  const id = await getMarketerId();
  if (!id) return null;
  const { q } = await import("@/lib/db");
  const { rows } = await q(
    "SELECT id, name, email, wa, created_at, commission_reset_at FROM marketers WHERE id = $1 AND active",
    [id]
  );
  return rows[0] || null;
}
