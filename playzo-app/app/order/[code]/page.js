import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp, tanggal } from "@/lib/format";
import { waLink } from "@/lib/site";
import { pakasirPayUrl } from "@/lib/pakasir";
import { cekBayar } from "@/app/actions";
import StatusBadge from "@/components/StatusBadge";
import CopyField from "@/components/CopyField";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { code } = await params;
  const { rows } = await q(
    `SELECT o.*, a.email, a.password AS account_password
     FROM orders o
     LEFT JOIN accounts a ON a.id = o.account_id
     WHERE o.code = $1`,
    [code]
  );
  const order = rows[0];
  if (!order) notFound();

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <div className="text-center mb-9">
        <p className="text-sm font-semibold text-soft mb-1">Kode order</p>
        <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3rem)] tracking-tight text-text">{order.code}</h1>
        <div className="mt-3">
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Ringkasan order */}
      <div className="bg-surface border border-line rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-y-3 text-[0.97rem]">
          <span className="text-soft font-semibold">Akun</span>
          <span className="font-bold text-right text-text">{order.account_title}</span>
          <span className="text-soft font-semibold">Penyewa</span>
          <span className="font-bold text-right text-text">{order.buyer_name}</span>
          <span className="text-soft font-semibold">Durasi</span>
          <span className="font-bold text-right text-text">
            {order.package_label ? `Paket ${order.package_label}` : `${order.hours} jam`}
            {order.bonus_hours > 0 && (
              <span className="block text-xs font-semibold text-ok">
                +{Math.round(order.bonus_hours / 24)} hari bonus kupon {order.coupon_code}
              </span>
            )}
          </span>
          <span className="text-soft font-semibold">Dibuat</span>
          <span className="font-bold text-right text-text">{tanggal(order.created_at)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4 mt-4">
          <span className="font-semibold">Total</span>
          <span className="font-display font-extrabold text-3xl text-text">{rp(order.total)}</span>
        </div>
      </div>

      {/* Status: menunggu pembayaran */}
      {order.status === "pending" && (
        <div className="bg-surface border border-line rounded-lg p-6">
          <h2 className="font-display font-bold text-xl text-text mb-2">Selesaikan pembayaran</h2>
          <p className="text-sm text-soft mb-5">
            Bayar lewat QRIS atau virtual account bank. Setelah pembayaran berhasil, email dan
            password akun otomatis muncul di halaman ini.
          </p>
          <a
            href={pakasirPayUrl(order)}
            className="block text-center font-bold px-6 py-4 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
          >
            Bayar {rp(order.total)}
          </a>
          <form action={cekBayar.bind(null, order.code)} className="mt-3">
            <button
              type="submit"
              className="w-full font-bold px-6 py-3 rounded-md border border-line text-text hover:bg-surface2 transition-colors"
            >
              Sudah bayar? Cek status
            </button>
          </form>
          <p className="text-sm text-soft mt-4 text-center">
            Pembayaran diproses oleh Pakasir. Ada kendala?{" "}
            <a
              href={waLink(`Halo min, ada kendala pembayaran order ${order.code}`)}
              className="underline underline-offset-2 font-semibold text-accent hover:text-accent2"
            >
              Chat admin
            </a>
          </p>
        </div>
      )}

      {/* Status: lunas — tampilkan kredensial */}
      {order.status === "paid" && (
        <div className="bg-surface border border-line rounded-lg p-6">
          <h2 className="font-display font-bold text-xl text-text mb-1">Akun kamu siap</h2>
          <p className="text-sm text-soft mb-5">
            Login pakai data di bawah. Durasi {order.package_label ? `paket ${order.package_label}` : `${order.hours} jam`}
            {order.bonus_hours > 0 && ` + bonus ${Math.round(order.bonus_hours / 24)} hari dari kupon ${order.coupon_code}`} dihitung
            sejak kamu login. Jangan ganti password akun.
          </p>
          {order.bonus_hours > 0 && (
            <p className="mb-5 text-sm font-semibold text-ok bg-ok/10 border border-ok/40 rounded-md px-4 py-2.5">
              Kupon {order.coupon_code} berhasil dipakai — masa aktif sewamu diperpanjang {Math.round(order.bonus_hours / 24)} hari gratis.
            </p>
          )}
          <div className="space-y-3">
            <CopyField label="Email akun" value={order.email || "Hubungi admin"} />
            <CopyField label="Password" value={order.account_password || "Hubungi admin"} />
          </div>
          <p className="text-sm text-soft mt-4">
            Ada masalah saat login?{" "}
            <a href={waLink(`Halo min, ada kendala login untuk order ${order.code}`)} className="underline underline-offset-2 font-semibold text-accent hover:text-accent2">
              Chat admin
            </a>
          </p>
        </div>
      )}

      {/* Status: selesai */}
      {order.status === "done" && (
        <div className="bg-surface border border-line rounded-lg p-6 text-center">
          <h2 className="font-display font-bold text-xl text-text mb-2">Sewa selesai</h2>
          <p className="text-soft mb-6">
            Terima kasih sudah menyewa di Rentzo. Akun sudah kami amankan kembali.
          </p>
          <Link
            href="/#katalog"
            className="inline-flex font-bold px-6 py-3.5 rounded-md bg-accent text-onaccent hover:bg-accent2"
          >
            Sewa lagi
          </Link>
        </div>
      )}

      {/* Status: dibatalkan */}
      {order.status === "cancelled" && (
        <div className="bg-surface border border-line rounded-lg p-6 text-center">
          <h2 className="font-display font-bold text-xl text-text mb-2">Order dibatalkan</h2>
          <p className="text-soft mb-6">
            Order ini tidak aktif. Kalau kamu merasa ini keliru, hubungi admin.
          </p>
          <a
            href={waLink(`Halo min, saya mau tanya soal order ${order.code} yang dibatalkan`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-bold px-6 py-3.5 rounded-md border border-line text-text hover:bg-surface2"
          >
            Tanya admin
          </a>
        </div>
      )}
    </div>
  );
}
