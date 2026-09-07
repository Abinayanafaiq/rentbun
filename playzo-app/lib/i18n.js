import { cookies } from "next/headers";
import { dict } from "./dict";

// Bahasa aktif dari cookie pz_lang (default: id)
export async function getLang() {
  const store = await cookies();
  return store.get("pz_lang")?.value === "en" ? "en" : "id";
}

// Ambil kamus bahasa aktif — dipakai di server components & actions
export async function getDict() {
  return dict[await getLang()];
}
