const STYLES = {
  // status akun
  ready: "bg-tealsoft text-tealdark border-tealdark",
  rented: "bg-ambersoft text-amberdark border-amberdark",
  maintenance: "bg-ink/10 text-ink/70 border-ink/40",
  // status order
  pending: "bg-ambersoft text-amberdark border-amberdark",
  paid: "bg-tealsoft text-tealdark border-tealdark",
  done: "bg-ink text-paper border-ink",
  cancelled: "bg-ink/10 text-ink/70 border-ink/40",
};

const LABELS = {
  ready: "Tersedia",
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
      className={`inline-block text-xs font-bold px-3 py-1 rounded-full border-2 whitespace-nowrap ${STYLES[status] || STYLES.pending} ${className}`}
    >
      {LABELS[status] || status}
    </span>
  );
}
