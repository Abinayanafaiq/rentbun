import crypto from "crypto";
import { cookies } from "next/headers";

export function adminToken() {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SECRET || "dev-secret")
    .update("rentzo-admin")
    .digest("hex");
}

export async function isAdmin() {
  const store = await cookies();
  return store.get("pz_session")?.value === adminToken();
}
