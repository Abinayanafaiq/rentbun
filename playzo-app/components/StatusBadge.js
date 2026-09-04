const STYLES = {
  // status akun
  ready: "bg-livebg text-live border-live/60",
  rented: "bg-surface2 text-warn border-warn/50",
  maintenance: "bg-surface2 text-faint border-line2",
  // status order
  pending: "bg-surface2 text-warn border-warn/50",
  paid: "bg-surface2 text-ok border-ok/50",
  done: "bg-surface2 text-soft border-line2",
  cancelled: "bg-surface2 text-faint border-line2",
};

const LABELS = {
  ready: "LIVE · Tersedia",
  rented: "Sedang disewa",
  maintenance: "Perawatan",
  pending: "Menunggu pembayaran",
  paid: "Lunas",
  done: "Selesai",
  cancelled: "Dibatalkan",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded border whitespace-nowrap ${STYLES[status] || STYLES.pending} ${className}`}
    >
      {status === "ready" && (
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" aria-hidden="true" />
      )}
      {LABELS[status] || status}
    </span>
  );
}
