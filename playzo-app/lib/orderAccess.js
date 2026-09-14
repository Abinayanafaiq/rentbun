import { cookies } from "next/headers";
import { q } from "@/lib/db";
import { getUserId } from "@/lib/userAuth";
import { isAdmin } from "@/lib/auth";
import { hmacToken, safeEqual } from "@/lib/secrets";

// Cookie akses order: HMAC(ADMIN_SECRET, "rentzo-order-<code>")
// Diset saat pembeli membuat order (httpOnly, tidak terbaca JS),
// jadi halaman kredensial hanya bisa dibuka pembuat order / pemilik akun / admin.
const COOKIE = "pz_order_access";
const MAX_ENTRIES = 20;

function orderAccessToken(code) {
  return hmacToken(process.env.ADMIN_SECRET, "rentzo-order", code);
}

export async function grantOrderAccess(code) {
  const store = await cookies();
  const existing = store.get(COOKIE)?.value || "";
  const tokens = existing ? existing.split(",").filter(Boolean) : [];
  const fresh = `${code}:${orderAccessToken(code)}`;
  const keep = [
    fresh,
    ...tokens.filter((t) => !t.startsWith(`${code}:`)),
  ].slice(0, MAX_ENTRIES);
  store.set(COOKIE, keep.join(","), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 hari
  });
}

async function hasAccessCookie(code) {
  const store = await cookies();
  const tokens = (store.get(COOKIE)?.value || "").split(",").filter(Boolean);
  return tokens.some((t) => {
    const idx = t.indexOf(":");
    if (idx === -1) return false;
    return (
      t.slice(0, idx) === code &&
      safeEqual(t.slice(idx + 1), orderAccessToken(code))
    );
  });
}

// Cek apakah request saat ini boleh melihat order & kredensialnya:
// admin, pemilik order (user terdaftar), atau pembuat order via cookie akses.
export async function canViewOrder(order) {
  if (!order) return false;
  if (await isAdmin()) return true;

  const userId = await getUserId();
  if (userId && Number(order.user_id) === Number(userId)) return true;

  return hasAccessCookie(order.code);
}

// Versi ringan untuk API route: ambil user_id order dulu.
export async function canViewOrderByCode(code) {
  const { rows } = await q("SELECT user_id FROM orders WHERE code = $1", [code]);
  if (!rows[0]) return false;
  return canViewOrder(rows[0]);
}
