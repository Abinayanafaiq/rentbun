import { savePackage } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

export default function PackageForm({ pkg }) {
  const p = pkg || {};

  return (
    <form action={savePackage} className={`${card} p-6`}>
      {p.id && <input type="hidden" name="id" value={p.id} />}

      <label className={`${label} mb-4`}>
        <span className={span}>Nama paket</span>
        <input name="label" required defaultValue={p.label} placeholder="contoh: 3 Hari" className={input} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <label className={label}>
          <span className={span}>Durasi (jam)</span>
          <input
            name="duration_hours"
            required
            type="number"
            min="1"
            max="720"
            defaultValue={p.duration_hours}
            placeholder="contoh: 72 untuk 3 hari"
            className={input}
          />
          <span className="text-xs text-soft mt-1 block">1 hari = 24 jam, 1 minggu = 168 jam</span>
        </label>
        <label className={label}>
          <span className={span}>Harga paket (Rp)</span>
          <input
            name="price"
            required
            type="number"
            min="0"
            step="1000"
            defaultValue={p.price}
            placeholder="contoh: 150000"
            className={input}
          />
        </label>
      </div>

      <label className={`${label} mb-6`}>
        <span className={span}>Komisi marketer untuk paket ini (%)</span>
        <input
          name="commission_rate"
          type="number"
          min="0"
          max="100"
          defaultValue={p.commission_rate ?? 0}
          placeholder="contoh: 10"
          className={input}
        />
        <span className="text-xs text-soft mt-1 block">
          Persen dari harga paket yang menjadi pendapatan marketer saat pembeli pakai kuponnya. Kosongkan / 0 untuk tanpa komisi.
        </span>
      </label>

      <button type="submit" className={btnPrimary}>
        {p.id ? "Simpan perubahan" : "Tambah paket"}
      </button>
    </form>
  );
}
