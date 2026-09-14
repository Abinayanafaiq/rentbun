import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { refreshPaymentStatus } from "@/lib/orders";
import { canViewOrder } from "@/lib/orderAccess";
import { rateLimit, clientIp } from "@/lib/rateLimit";

// Dipoll otomatis dari halaman order tiap beberapa detik selama status pending.
// Dilindungi: hanya admin / pemilik order / pembuat order (cookie akses).
export async function GET(request, { params }) {
  const ip = await clientIp(request);
  if (!rateLimit(`order-status:${ip}`, 60, 60 * 1000)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  const { code } = await params;
  const { rows } = await q("SELECT * FROM orders WHERE code = $1", [code]);
  const order = rows[0];
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!(await canViewOrder(order))) {
    // Sama seperti 404: jangan bocorkan bahwa order itu ada
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const status = await refreshPaymentStatus(order);
  return NextResponse.json({ status });
}
