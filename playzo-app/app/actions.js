"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { q } from "@/lib/db";
import { isAdmin, adminToken } from "@/lib/auth";
import { getTransactionDetail } from "@/lib/pakasir";
import { markOrderPaid } from "@/lib/orders";
import { uploadPhoto, deletePhoto } from "@/lib/storage";

/* ---------- Auth admin ---------- */

export async function login(prev, formData) {
  const password = String(formData.get("password") || "");
  if (password === process.env.ADMIN_PASSWORD) {
    const store = await cookies();
    store.set("pz_session", adminToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });
    redirect("/admin");
  }
  return { error: "Password salah. Coba lagi." };
}

export async function logout() {
  const store = await cookies();
  store.delete("pz_session");
  redirect("/admin/login");
}

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/* ---------- Order (sisi pembeli) ---------- */

export async function createOrder(prev, formData) {
  const accountId = Number(formData.get("account_id")) || 0;
  const packageId = Number(formData.get("package_id")) || 0;
  const name = String(formData.get("name") || "").trim();
  const wa = String(formData.get("wa") || "").trim();

  if (!name || !wa) {
    return { error: "Nama dan nomor WhatsApp wajib diisi." };
  }

  const { rows } = await q("SELECT * FROM accounts WHERE id = $1 AND status = 'ready'", [accountId]);
  const account = rows[0];
  if (!account) {
    return { error: "Akun baru saja disewa orang lain. Pilih akun lain, ya." };
  }

  let hours, total, packageLabel = null;

  if (packageId > 0) {
    // Paket: harga & durasi selalu diambil dari database, jangan percaya client
    const { rows: pkgs } = await q("SELECT * FROM packages WHERE id = $1", [packageId]);
    const pkg = pkgs[0];
    if (!pkg) {
      return { error: "Paket tidak ditemukan. Muat ulang halaman lalu coba lagi." };
    }
    hours = pkg.duration_hours;
    total = pkg.price;
    packageLabel = pkg.label;
  } else {
    hours = Math.max(1, Math.min(72, Number(formData.get("hours")) || 1));
    total = account.price_per_hour * hours;
  }

  const code = "RZ-" + crypto.randomBytes(3).toString("hex").toUpperCase();

  await q(
    `INSERT INTO orders (code, account_id, account_title, buyer_name, buyer_wa, hours, total, package_label)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [code, accountId, account.title, name, wa, hours, total, packageLabel]
  );

  redirect(`/order/${code}`);
}

/* ---------- Cek status bayar (sisi pembeli) ---------- */

export async function cekBayar(code) {
  const { rows } = await q("SELECT * FROM orders WHERE code = $1", [code]);
  const order = rows[0];
  if (!order) redirect("/");

  if (order.status === "pending") {
    // Tanya langsung ke API Pakasir
    const trx = await getTransactionDetail(order);
    if (trx && trx.status === "completed" && Number(trx.amount) === order.total) {
      await markOrderPaid(code, trx.payment_method);
    }
  }

  revalidatePath(`/order/${code}`);
  revalidatePath("/");
  redirect(`/order/${code}`);
}

/* ---------- Order (sisi admin) ---------- */

export async function markPaid(orderId) {
  await guard();
  const { rows } = await q(
    `UPDATE orders SET status = 'paid', paid_at = now(), payment_method = coalesce(payment_method, 'manual')
     WHERE id = $1 AND status = 'pending'
     RETURNING account_id, code`,
    [orderId]
  );
  if (rows[0]) {
    await q("UPDATE accounts SET status = 'rented' WHERE id = $1", [rows[0].account_id]);
    revalidatePath(`/order/${rows[0].code}`);
  }
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function markDone(orderId) {
  await guard();
  const { rows } = await q(
    `UPDATE orders SET status = 'done'
     WHERE id = $1 AND status = 'paid'
     RETURNING account_id`,
    [orderId]
  );
  if (rows[0]) {
    await q("UPDATE accounts SET status = 'ready' WHERE id = $1", [rows[0].account_id]);
  }
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function cancelOrder(orderId) {
  await guard();
  const { rows } = await q(
    `UPDATE orders SET status = 'cancelled'
     WHERE id = $1 AND status IN ('pending', 'paid')
     RETURNING account_id, status`,
    [orderId]
  );
  // Kembalikan stok kalau order sudah terlanjur lunas
  if (rows[0] && rows[0].status !== undefined) {
    await q(
      "UPDATE accounts SET status = 'ready' WHERE id = $1 AND status = 'rented'",
      [rows[0].account_id]
    );
  }
  revalidatePath("/admin");
  revalidatePath("/");
}

/* ---------- Stok akun (sisi admin) ---------- */

export async function saveAccount(formData) {
  await guard();

  const id = Number(formData.get("id")) || null;
  const values = [
    String(formData.get("title") || "").trim(),
    String(formData.get("rank") || "Epic"),
    Math.max(0, Number(formData.get("heroes")) || 0),
    Math.max(0, Number(formData.get("skins")) || 0),
    Math.max(1, Number(formData.get("level")) || 1),
    Math.max(0, Number(formData.get("price_per_hour")) || 0),
    String(formData.get("description") || "").trim(),
    String(formData.get("email") || "").trim(),
    String(formData.get("password") || "").trim(),
    String(formData.get("status") || "ready"),
  ];

  // --- Foto: pertahankan yang dicentang + upload yang baru (maks 10 total) ---
  const keep = formData.getAll("keep_photos").map(String).slice(0, 10);
  const files = formData
    .getAll("photos")
    .filter((f) => f && typeof f.arrayBuffer === "function" && f.size > 0);

  const newKeys = [];
  for (const f of files) {
    if (keep.length + newKeys.length >= 10) break; // mentok 10 foto
    if (!f.type?.startsWith("image/")) continue; // wajib gambar
    if (f.size > 5 * 1024 * 1024) continue; // maks 5MB per foto
    const ext = (f.type.split("/")[1] || "jpg").replace("jpeg", "jpg").replace(/[^a-z0-9]/g, "");
    const key = `akun/${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await f.arrayBuffer());
    newKeys.push(await uploadPhoto(buffer, f.type, key));
  }
  const photos = [...keep, ...newKeys];

  if (id) {
    // Hapus di storage untuk foto yang dibuang admin
    const { rows: old } = await q("SELECT photos FROM accounts WHERE id = $1", [id]);
    const oldPhotos = old[0]?.photos || [];
    for (const key of oldPhotos) {
      if (!keep.includes(key)) await deletePhoto(key);
    }

    await q(
      `UPDATE accounts SET
        title = $1, rank = $2, heroes = $3, skins = $4, level = $5,
        price_per_hour = $6, description = $7, email = $8, password = $9, status = $10,
        photos = $11::jsonb
       WHERE id = $12`,
      [...values, JSON.stringify(photos), id]
    );
  } else {
    await q(
      `INSERT INTO accounts (title, rank, heroes, skins, level, price_per_hour, description, email, password, status, photos)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)`,
      [...values, JSON.stringify(photos)]
    );
  }

  revalidatePath("/admin/akun");
  revalidatePath("/");
  redirect("/admin/akun");
}

export async function deleteAccount(accountId) {
  await guard();
  const { rows } = await q("DELETE FROM accounts WHERE id = $1 RETURNING photos", [accountId]);
  for (const key of rows[0]?.photos || []) {
    await deletePhoto(key);
  }
  revalidatePath("/admin/akun");
  revalidatePath("/");
}

/* ---------- Paket sewa (sisi admin) ---------- */

export async function savePackage(formData) {
  await guard();

  const id = Number(formData.get("id")) || null;
  const label = String(formData.get("label") || "").trim();
  const durationHours = Math.max(1, Math.min(720, Number(formData.get("duration_hours")) || 0));
  const price = Math.max(0, Number(formData.get("price")) || 0);

  if (!label || !durationHours || !price) {
    redirect(id ? `/admin/paket/${id}` : "/admin/paket/baru");
  }

  if (id) {
    await q("UPDATE packages SET label = $1, duration_hours = $2, price = $3 WHERE id = $4", [
      label, durationHours, price, id,
    ]);
  } else {
    await q("INSERT INTO packages (label, duration_hours, price) VALUES ($1, $2, $3)", [
      label, durationHours, price,
    ]);
  }

  revalidatePath("/admin/paket");
  redirect("/admin/paket");
}

export async function deletePackage(packageId) {
  await guard();
  await q("DELETE FROM packages WHERE id = $1", [packageId]);
  revalidatePath("/admin/paket");
}
