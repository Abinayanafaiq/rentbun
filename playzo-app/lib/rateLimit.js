// Rate limiter in-memory sederhana (per proses).
// Cukup untuk menahan brute force; kalau nanti deploy multi-instance,
// ganti dengan store bersama (Redis dsb).

const buckets = new Map();

// Bersihkan entri kadaluarsa biar memory tidak menumpuk
function sweep(now) {
  if (buckets.size < 5000) return;
  for (const [k, v] of buckets) {
    if (now > v.resetAt) buckets.delete(k);
  }
}

// Return true kalau masih di bawah batas. false = terlalu sering, tolak.
export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

// request = Request object (API route), atau null (server action → headers())
export async function clientIp(request) {
  if (!request) {
    const { headers } = await import("next/headers");
    const h = await headers();
    return (
      h.get("x-real-ip") ||
      h.get("cf-connecting-ip") ||
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown"
    );
  }
  const h = request.headers;
  return (
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
