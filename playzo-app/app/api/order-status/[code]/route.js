import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { refreshPaymentStatus } from "@/lib/orders";

// Dipoll otomatis dari halaman order tiap beberapa detik selama status pending
export async function GET(request, { params }) {
  const { code } = await params;
  const { rows } = await q("SELECT * FROM orders WHERE code = $1", [code]);
  const order = rows[0];
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const status = await refreshPaymentStatus(order);
  return NextResponse.json({ status });
}
