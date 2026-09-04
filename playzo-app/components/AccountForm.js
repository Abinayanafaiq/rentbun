import { saveAccount } from "@/app/actions";
import { card, input, span, label, btnPrimary } from "@/components/ui";

const RANKS = ["Epic", "Legend", "Mythic", "Mythic Honor", "Mythic Glory", "Mythical Immortal"];

export default function AccountForm({ account, photoItems = [] }) {
  const a = account || {};
  const sisaSlot = 10 - photoItems.length;

  return (
    <form action={saveAccount} className={`${card} p-6`}>
      {a.id && <input type="hidden" name="id" value={a.id} />}

      <label className={`${label} mb-4`}>
        <span className={span}>Nama akun (tampil di katalog)</span>
        <input name="title" required defaultValue={a.title} placeholder="contoh: Mythic Glory 320 Skin" className={input} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <label className={label}>
          <span className={span}>Rank</span>
          <select name="rank" defaultValue={a.rank || "Epic"} className={input}>
            {RANKS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          <span className={span}>Harga per jam (Rp)</span>
          <input name="price_per_hour" required type="number" min="0" step="500" defaultValue={a.price_per_hour} placeholder="contoh: 3000" className={input} />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <label className={label}>
          <span className={span}>Jumlah hero</span>
          <input name="heroes" type="number" min="0" defaultValue={a.heroes ?? 100} className={input} />
        </label>
        <label className={label}>
          <span className={span}>Jumlah skin</span>
          <input name="skins" type="number" min="0" defaultValue={a.skins ?? 100} className={input} />
        </label>
        <label className={label}>
          <span className={span}>Level</span>
          <input name="level" type="number" min="1" defaultValue={a.level ?? 30} className={input} />
        </label>
      </div>

      <label className={`${label} mb-4`}>
        <span className={span}>Deskripsi (tampil di halaman detail)</span>
        <textarea name="description" rows="3" defaultValue={a.description} placeholder="contoh: Skin collector hampir lengkap, emblem max, cocok buat push rank." className={`${input} resize-y`} />
      </label>

      <div className="border-t border-line pt-5 mt-2 mb-4">
        <p className="font-display font-bold text-lg text-text mb-1">Kredensial akun</p>
        <p className="text-sm text-soft mb-4">
          Hanya terlihat oleh pembeli setelah order berstatus lunas.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={label}>
            <span className={span}>Email akun game</span>
            <input name="email" required defaultValue={a.email} placeholder="contoh: akun01@rentzo.id" className={input} />
          </label>
          <label className={label}>
            <span className={span}>Password akun game</span>
            <input name="password" required defaultValue={a.password} placeholder="Password login akun" className={input} />
          </label>
        </div>
      </div>

      {/* FOTO AKUN */}
      <div className="border-t border-line pt-5 mt-2 mb-6">
        <p className="font-display font-bold text-lg text-text mb-1">Foto akun</p>
        <p className="text-sm text-soft mb-4">
          Maksimal 10 foto, masing-masing maksimal 5MB (JPG/PNG/WebP). Foto pertama jadi sampul.
          Tampil di halaman detail akun.
        </p>

        {photoItems.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
            {photoItems.map((p) => (
              <label key={p.key} className="group relative cursor-pointer">
                <input
                  type="checkbox"
                  name="keep_photos"
                  value={p.key}
                  defaultChecked
                  className="peer sr-only"
                />
                <img
                  src={p.url}
                  alt="Foto akun"
                  className="w-full aspect-square object-cover rounded-md border border-line peer-checked:ring-2 peer-checked:ring-accent peer-[:not(:checked)]:opacity-30 peer-[:not(:checked)]:grayscale"
                />
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded border border-line bg-accent text-onaccent whitespace-nowrap peer-[:not(:checked)]:hidden">
                  Dipakai
                </span>
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded border border-line bg-live text-onaccent whitespace-nowrap hidden peer-[:not(:checked)]:block">
                  Dihapus
                </span>
              </label>
            ))}
          </div>
        )}
        {photoItems.length > 0 && (
          <p className="text-xs text-soft mb-4">
            Centang ungu = foto dipakai. Hilangkan centang untuk menghapus foto saat disimpan.
          </p>
        )}

        {sisaSlot > 0 ? (
          <label className="block">
            <span className={span}>Upload foto baru ({sisaSlot} slot tersisa)</span>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="mt-1.5 w-full border border-dashed border-line2 rounded-md px-4 py-3 bg-bg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-line file:bg-surface2 file:font-bold file:text-sm file:text-text file:cursor-pointer"
            />
          </label>
        ) : (
          <p className="text-sm font-semibold text-warn">Sudah 10 foto. Hapus dulu kalau mau ganti.</p>
        )}
      </div>

      <label className={`${label} mb-6`}>
        <span className={span}>Status</span>
        <select name="status" defaultValue={a.status || "ready"} className={input}>
          <option value="ready">Tersedia</option>
          <option value="maintenance">Perawatan (tidak bisa disewa)</option>
          <option value="rented">Sedang disewa</option>
        </select>
      </label>

      <button type="submit" className={btnPrimary}>
        {a.id ? "Simpan perubahan" : "Tambah akun"}
      </button>
    </form>
  );
}
