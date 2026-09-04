import { savePackage } from "@/app/actions";

const INPUT =
  "mt-1.5 w-full border-[2.5px] border-ink rounded-xl px-4 py-3 bg-paper font-medium focus:outline-none focus:ring-3 focus:ring-teal/50";

export default function PackageForm({ pkg }) {
  const p = pkg || {};

  return (
    <form action={savePackage} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
      {p.id && <input type="hidden" name="id" value={p.id} />}

      <label className="block mb-4">
        <span className="font-semibold text-sm">Nama paket</span>
        <input name="label" required defaultValue={p.label} placeholder="contoh: 3 Hari" className={INPUT} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <label className="block">
          <span className="font-semibold text-sm">Durasi (jam)</span>
          <input
            name="duration_hours"
            required
            type="number"
            min="1"
            max="720"
            defaultValue={p.duration_hours}
            placeholder="contoh: 72 untuk 3 hari"
            className={INPUT}
          />
          <span className="text-xs text-ink/60 mt-1 block">1 hari = 24 jam, 1 minggu = 168 jam</span>
        </label>
        <label className="block">
          <span className="font-semibold text-sm">Harga paket (Rp)</span>
          <input
            name="price"
            required
            type="number"
            min="0"
            step="1000"
            defaultValue={p.price}
            placeholder="contoh: 150000"
            className={INPUT}
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-full font-bold px-6 py-4 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-y-0.5"
      >
        {p.id ? "Simpan perubahan" : "Tambah paket"}
      </button>
    </form>
  );
}
