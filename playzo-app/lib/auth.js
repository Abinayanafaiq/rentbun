import { ADMIN_SECRET, hmacToken, safeEqual } from "@/lib/secrets";

export function adminToken() {
  return hmacToken(ADMIN_SECRET, "rentzo-admin", 0);
}

export async function isAdmin() {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return safeEqual(store.get("pz_session")?.value, adminToken());
}
