import { redirect } from "next/navigation";
import { getCurrentMarketer } from "@/lib/marketerAuth";
import { getVoucherBonusDays, getUsdRate } from "@/lib/marketers";
import { q } from "@/lib/db";
import { rp, usd, tanggal } from "@/lib/format";
import { logoutMarketer, toggleCoupon, deleteCoupon } from "@/app/actions";
import { getDict, getLang } from "@/lib/i18n";
import { fill } from "@/lib/dict";
import StatusBadge from "@/components/StatusBadge";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import CouponForm from "@/components/CouponForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard Marketer — Rentzo" };

const BTN = "text-xs font-bold px-3.5 py-1.5 rounded-md border border-line transition-colors";

export default async function MarketerDashboard() {
  const [m, t, lang] = await Promise.all([getCurrentMarketer(), getDict(), getLang()]);
  if (!m) redirect("/marketer/login");

  const [bonusDays, { rows: coupons }, { rows: orders }, { rows: commRows }, usdRate] = await Promise.all([
    getVoucherBonusDays(),
    q(
      `SELECT c.*,
         count(o.id) FILTER (WHERE o.status IN ('paid', 'done')) AS used_count
       FROM coupons c
       LEFT JOIN orders o ON o.coupon_code = c.code AND o.marketer_id = c.marketer_id
       WHERE c.marketer_id = $1
       GROUP BY c.id
       ORDER BY c.id DESC`,
      [m.id]
    ),
    q(
      "SELECT * FROM orders WHERE marketer_id = $1 ORDER BY created_at DESC LIMIT 50",
      [m.id]
    ),
    q(
      `SELECT
         coalesce(sum(commission) FILTER (WHERE o.currency = 'IDR'), 0) AS total_idr,
         coalesce(sum(commission) FILTER (WHERE o.currency = 'USD'), 0) AS total_usd
       FROM orders o
       WHERE o.marketer_id = $1 AND o.status IN ('paid', 'done')`,
      [m.id]
    ),
  ]);

  const activeCoupons = coupons.filter((c) => c.active).length;
  const totalUsed = coupons.reduce((sum, c) => sum + Number(c.used_count), 0);
  const totalCommissionIdr = Number(commRows[0]?.total_idr || 0);
  const totalCommissionUsd = Number(commRows[0]?.total_usd || 0);
  // USD dikonversi ke Rupiah (kurs tetap) lalu dijumlahkan ke total
  const totalCommission = totalCommissionIdr + totalCommissionUsd * usdRate;
  const commissionValue = rp(totalCommission);
  const cards = [
    { label: t.marketer.statActive, value: activeCoupons },
    { label: t.marketer.statUsed, value: `${totalUsed}x` },
    { label: t.marketer.statBonus, value: fill(t.marketer.bonusDaysValue, { days: bonusDays }) },
    { label: t.marketer.statCommission, value: commissionValue },
    { label: t.marketer.statCommissionUsd, value: usd(totalCommissionUsd) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-9">
        <div>
          <h1 className="font-display font-extrabold text-[clamp(1.9rem,4vw,2.6rem)] text-text">{fill(t.marketer.hello, { name: m.name })}</h1>
          <p className="text-soft">{t.marketer.sub}</p>
        </div>
        <form action={logoutMarketer}>
          <button className="font-bold text-sm px-5 py-2.5 rounded-md border border-line text-text hover:bg-surface2 transition-colors">
            {t.marketer.logout}
          </button>
        </form>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-11">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface border border-line rounded-lg p-5">
            <p className="text-sm font-semibold text-soft">{c.label}</p>
            <p className="font-display font-extrabold text-3xl mt-1 text-text">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Buat kupon */}
      <div className="bg-surface border border-line rounded-lg p-5 mb-8">
        <h2 className="font-display font-bold text-lg text-text mb-1">{t.marketer.createTitle}</h2>
        <p className="text-sm text-soft mb-4">
          {fill(t.marketer.createDesc, { days: bonusDays })}
        </p>
        <CouponForm t={t.marketer} />
      </div>

      {/* Daftar kupon */}
      <h2 className="font-display font-extrabold text-2xl text-text mb-4">{t.marketer.yourCoupons}</h2>
      {coupons.length === 0 ? (
        <p className="text-soft bg-surface border border-line rounded-lg p-6 mb-11">
          {t.marketer.noCoupons}
        </p>
      ) : (
        <div className="bg-surface border border-line rounded-lg divide-y divide-line/50 mb-11">
          {coupons.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <span className="font-mono font-bold text-text bg-surface2 border border-line rounded px-2 py-1">
                  {c.code}
                </span>
                <span
                  className={`inline-flex text-xs font-bold px-2.5 py-1 rounded border ml-2 ${
                    c.active ? "bg-livebg text-live border-live/60" : "bg-surface2 text-faint border-line2"
                  }`}
                >
                  {c.active ? t.marketer.active : t.marketer.inactive}
                </span>
                <span className="text-soft text-xs block mt-1.5">{fill(t.marketer.createdAt, { date: tanggal(c.created_at) })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-text mr-2">{fill(t.marketer.usedTimes, { n: c.used_count })}</span>
                <form action={toggleCoupon.bind(null, c.id)}>
                  <button className={`${BTN} text-text hover:bg-surface2`}>
                    {c.active ? t.marketer.deactivate : t.marketer.activate}
                  </button>
                </form>
                <ConfirmSubmit
                  action={deleteCoupon.bind(null, c.id)}
                  label={t.marketer.delete}
                  message={fill(t.marketer.deleteMsg, { code: c.code })}
                  className={`${BTN} text-soft hover:bg-surface2`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pemakaian kupon */}
      <h2 className="font-display font-extrabold text-2xl text-text mb-4">{t.marketer.usageTitle}</h2>
      {orders.length === 0 ? (
        <p className="text-soft bg-surface border border-line rounded-lg p-6">
          {t.marketer.noUsage}
        </p>
      ) : (
        <div className="overflow-x-auto bg-surface border border-line rounded-lg">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-line text-left text-soft">
                <th className="p-4 font-display">{t.marketer.thOrder}</th>
                <th className="p-4 font-display">{t.marketer.thAccount}</th>
                <th className="p-4 font-display">{t.marketer.thCoupon}</th>
                <th className="p-4 font-display">{t.marketer.thBonus}</th>
                <th className="p-4 font-display">{t.marketer.thCommission}</th>
                <th className="p-4 font-display">{t.marketer.thStatus}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line/50 last:border-0 align-top">
                  <td className="p-4">
                    <span className="font-bold block text-text">{o.code}</span>
                    <span className="text-soft text-xs">{tanggal(o.created_at)}</span>
                  </td>
                  <td className="p-4 text-text">{o.account_title}</td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-text">{o.coupon_code}</span>
                  </td>
                  <td className="p-4 text-ok font-semibold">{fill(t.marketer.bonusDaysValue, { days: Math.round(o.bonus_hours / 24) })}</td>
                  <td className="p-4 font-semibold text-text">
                    {o.commission > 0 ? (o.currency === "USD" ? usd(o.commission) : rp(o.commission)) : "-"}
                    {o.status === "pending" && <span className="block text-[10px] font-normal text-faint">estimasi</span>}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={o.status} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
