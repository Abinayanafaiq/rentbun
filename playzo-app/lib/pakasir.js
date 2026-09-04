// Integrasi Pakasir — https://pakasir.com
const BASE = "https://app.pakasir.com";

// URL halaman pembayaran (Integrasi Via URL, docs bagian B)
export function pakasirPayUrl(order) {
  const redirect = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.code}`;
  const params = new URLSearchParams({
    order_id: order.code,
    redirect,
  });
  return `${BASE}/pay/${process.env.PAKASIR_SLUG}/${order.total}?${params.toString()}`;
}

// Cek status transaksi ke API Pakasir (docs bagian E)
export async function getTransactionDetail(order) {
  const params = new URLSearchParams({
    project: process.env.PAKASIR_SLUG,
    amount: String(order.total),
    order_id: order.code,
    api_key: process.env.PAKASIR_API_KEY,
  });
  try {
    const res = await fetch(`${BASE}/api/transactiondetail?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.transaction || null;
  } catch {
    return null;
  }
}
