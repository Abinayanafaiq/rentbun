import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { rp, money, tanggal } from "@/lib/format";
import { waLink } from "@/lib/site";
import { pakasirPayUrl } from "@/lib/pakasir";
import { oxapayEnabled } from "@/lib/oxapay";
import { getDict, getLang } from "@/lib/i18n";
import { fill } from "@/lib/dict";
import StatusBadge from "@/components/StatusBadge";
import CopyField from "@/components/CopyField";
import CryptoPayButton from "@/components/CryptoPayButton";
import OrderStatusPoller from "@/components/OrderStatusPoller";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const [{ code }, t, lang] = await Promise.all([params, getDict(), getLang()]);
  const { rows } = await q(
    `SELECT o.*, a.email, a.password AS account_password
     FROM orders o
     LEFT JOIN accounts a ON a.id = o.account_id
     WHERE o.code = $1`,
    [code]
  );
  const order = rows[0];
  if (!order) notFound();

  const isUsd = order.currency === "USD";

  const baseDuration = order.package_label
    ? fill(t.order.pkg, { label: order.package_label })
    : fill(t.order.hours, { n: order.hours });
  const bonusDays = Math.round((order.bonus_hours || 0) / 24);
  const durationText =
    bonusDays > 0
      ? baseDuration + fill(t.order.bonusConcat, { days: bonusDays, code: order.coupon_code })
      : baseDuration;

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      {/* Polling otomatis selama menunggu pembayaran */}
      {order.status === "pending" && <OrderStatusPoller code={order.code} />}

      <div className="text-center mb-9">
        <p className="text-sm font-semibold text-soft mb-1">{t.order.codeLabel}</p>
        <h1 className="font-display font-extrabold text-[clamp(2rem,5vw,3rem)] tracking-tight text-text">{order.code}</h1>
        <div className="mt-3">
          <StatusBadge status={order.status} lang={lang} />
        </div>
      </div>

      {/* Ringkasan order */}
      <div className="bg-surface border border-line rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-y-3 text-[0.97rem]">
          <span className="text-soft font-semibold">{t.order.account}</span>
          <span className="font-bold text-right text-text">{order.account_title}</span>
          <span className="text-soft font-semibold">{t.order.renter}</span>
          <span className="font-bold text-right text-text">{order.buyer_name}</span>
          <span className="text-soft font-semibold">{t.order.duration}</span>
          <span className="font-bold text-right text-text">
            {baseDuration}
            {bonusDays > 0 && (
              <span className="block text-xs font-semibold text-ok">
                {fill(t.order.bonusLine, { days: bonusDays, code: order.coupon_code })}
              </span>
            )}
          </span>
          <span className="text-soft font-semibold">{t.order.created}</span>
          <span className="font-bold text-right text-text">{tanggal(order.created_at)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4 mt-4">
          <span className="font-semibold">{t.order.total}</span>
          <span className="font-display font-extrabold text-3xl text-text">{money(order.total, order.currency)}</span>
        </div>
      </div>

      {/* Status: menunggu pembayaran */}
      {order.status === "pending" && (
        <div className="bg-surface border border-line rounded-lg p-6">
          <h2 className="font-display font-bold text-xl text-text mb-2">{t.order.pendingTitle}</h2>
          <p className="text-sm text-soft mb-5">
            {isUsd ? t.order.pendingUsdDesc : t.order.pendingDesc}
          </p>
          {!isUsd && (
            <a
              href={pakasirPayUrl(order)}
              className="block text-center font-bold px-6 py-4 rounded-md bg-accent text-onaccent hover:bg-accent2 transition-colors"
            >
              {fill(t.order.pay, { total: rp(order.total) })}
            </a>
          )}
          {oxapayEnabled() && (
            <CryptoPayButton
              code={order.code}
              label={t.order.cryptoPay}
              loadingLabel={t.order.cryptoLoading}
            />
          )}
          <p className="text-xs text-soft mt-4 text-center">
            {t.order.autoCheck}
          </p>
          <p className="text-sm text-soft mt-4 text-center">
            {oxapayEnabled() ? t.order.processedBoth : t.order.processedPakasir} {t.order.needHelp}{" "}
            <a
              href={waLink(fill(t.order.waIssue, { code: order.code }))}
              className="underline underline-offset-2 font-semibold text-accent hover:text-accent2"
            >
              {t.order.chatAdmin}
            </a>
          </p>
        </div>
      )}

      {/* Status: lunas — tampilkan kredensial */}
      {order.status === "paid" && (
        <div className="bg-surface border border-line rounded-lg p-6">
          <h2 className="font-display font-bold text-xl text-text mb-1">{t.order.paidTitle}</h2>
          <p className="text-sm text-soft mb-5">
            {fill(t.order.paidDesc, { duration: durationText })}
          </p>
          {bonusDays > 0 && (
            <p className="mb-5 text-sm font-semibold text-ok bg-ok/10 border border-ok/40 rounded-md px-4 py-2.5">
              {fill(t.order.paidBonus, { code: order.coupon_code, days: bonusDays })}
            </p>
          )}
          <div className="space-y-3">
            <CopyField label={t.order.emailAcc} value={order.email || t.order.contactAdmin} copyLabel={t.common.copy} copiedLabel={t.common.copied} />
            <CopyField label={t.order.password} value={order.account_password || t.order.contactAdmin} copyLabel={t.common.copy} copiedLabel={t.common.copied} />
          </div>
          <p className="text-sm text-soft mt-4">
            {t.order.loginIssue}{" "}
            <a href={waLink(fill(t.order.waLogin, { code: order.code }))} className="underline underline-offset-2 font-semibold text-accent hover:text-accent2">
              {t.order.chatAdmin}
            </a>
          </p>
        </div>
      )}

      {/* Status: selesai */}
      {order.status === "done" && (
        <div className="bg-surface border border-line rounded-lg p-6 text-center">
          <h2 className="font-display font-bold text-xl text-text mb-2">{t.order.doneTitle}</h2>
          <p className="text-soft mb-6">
            {t.order.doneDesc}
          </p>
          <Link
            href="/#katalog"
            className="inline-flex font-bold px-6 py-3.5 rounded-md bg-accent text-onaccent hover:bg-accent2"
          >
            {t.order.rentAgain}
          </Link>
        </div>
      )}

      {/* Status: dibatalkan */}
      {order.status === "cancelled" && (
        <div className="bg-surface border border-line rounded-lg p-6 text-center">
          <h2 className="font-display font-bold text-xl text-text mb-2">{t.order.cancelTitle}</h2>
          <p className="text-soft mb-6">
            {t.order.cancelDesc}
          </p>
          <a
            href={waLink(fill(t.order.waCancel, { code: order.code }))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-bold px-6 py-3.5 rounded-md border border-line text-text hover:bg-surface2"
          >
            {t.order.askAdmin}
          </a>
        </div>
      )}
    </div>
  );
}
