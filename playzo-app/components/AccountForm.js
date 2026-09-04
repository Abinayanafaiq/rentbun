import { saveAccount } from "@/app/actions";

const RANKS = ["Epic", "Legend", "Mythic", "Mythic Honor", "Mythic Glory", "Mythical Immortal"];

const INPUT =
  "mt-1.5 w-full border-[2.5px] border-ink rounded-xl px-4 py-3 bg-paper font-medium focus:outline-none focus:ring-3 focus:ring-teal/50";
const LABEL = "block";
const SPAN = "font-semibold text-sm";

export default function AccountForm({ account, photoItems = [] }) {
  const a = account || {};
  const sisaSlot = 10 - photoItems.length;

  return (
    <form action={saveAccount} className="bg-paper2 border-[2.5px] border-ink rounded-2xl p-6 shadow-hard">
      {a.id && <input type="hidden" name="id" value={a.id} />}

      <label className={`${LABEL} mb-4`}>
        <span className={SPAN}>Nama akun (tampil di katalog)</span>
        <input name="title" required defaultValue={a.title} placeholder="contoh: Mythic Glory 320 Skin" className={INPUT} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <label className={LABEL}>
          <span className={SPAN}>Rank</span>
          <select name="rank" defaultValue={a.rank || "Epic"} className={INPUT}>
            {RANKS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className={LABEL}>
          <span className={SPAN}>Harga per jam (Rp)</span>
          <input name="price_per_hour" required type="number" min="0" step="500" defaultValue={a.price_per_hour} placeholder="contoh: 3000" className={INPUT} />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <label className={LABEL}>
          <span className={SPAN}>Jumlah hero</span>
          <input name="heroes" type="number" min="0" defaultValue={a.heroes ?? 100} className={INPUT} />
        </label>
        <label className={LABEL}>
          <span className={SPAN}>Jumlah skin</span>
          <input name="skins" type="number" min="0" defaultValue={a.skins ?? 100} className={INPUT} />
        </label>
        <label className={LABEL}>
          <span className={SPAN}>Level</span>
          <input name="level" type="number" min="1" defaultValue={a.level ?? 30} className={INPUT} />
        </label>
      </div>

      <label className={`${LABEL} mb-4`}>
        <span className={SPAN}>Deskripsi (tampil di halaman detail)</span>
        <textarea name="description" rows="3" defaultValue={a.description} placeholder="contoh: Skin collector hampir lengkap, emblem max, cocok buat push rank." className={`${INPUT} resize-y`} />
      </label>

      <div className="border-t-[2.5px] border-dashed border-ink/25 pt-5 mt-2 mb-4">
        <p className="font-display font-extrabold text-lg mb-1">Kredensial akun</p>
        <p className="text-sm text-ink/60 mb-4">
          Hanya terlihat oleh pembeli setelah order berstatus lunas.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={LABEL}>
            <span className={SPAN}>Email akun game</span>
            <input name="email" required defaultValue={a.email} placeholder="contoh: akun01@rentzo.id" className={INPUT} />
          </label>
          <label className={LABEL}>
            <span className={SPAN}>Password akun game</span>
            <input name="password" required defaultValue={a.password} placeholder="Password login akun" className={INPUT} />
          </label>
        </div>
      </div>

      {/* FOTO AKUN */}
      <div className="border-t-[2.5px] border-dashed border-ink/25 pt-5 mt-2 mb-6">
        <p className="font-display font-extrabold text-lg mb-1">Foto akun</p>
        <p className="text-sm text-ink/60 mb-4">
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
                  className="w-full aspect-square object-cover rounded-xl border-[2.5px] border-ink peer-checked:ring-3 peer-checked:ring-teal/60 peer-[:not(:checked)]:opacity-30 peer-[:not(:checked)]:grayscale"
                />
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-ink bg-tealsoft text-tealdark whitespace-nowrap peer-[:not(:checked)]:hidden">
                  Dipakai
                </span>
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-ink bg-red text-paper2 whitespace-nowrap hidden peer-[:not(:checked)]:block">
                  Dihapus
                </span>
              </label>
            ))}
          </div>
        )}
        {photoItems.length > 0 && (
          <p className="text-xs text-ink/60 mb-4">
            Centang hijau = foto dipakai. Hilangkan centang untuk menghapus foto saat disimpan.
          </p>
        )}

        {sisaSlot > 0 ? (
          <label className="block">
            <span className={SPAN}>Upload foto baru ({sisaSlot} slot tersisa)</span>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="mt-1.5 w-full border-[2.5px] border-dashed border-ink/40 rounded-xl px-4 py-3 bg-paper text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-2 file:border-ink file:bg-yellow file:font-bold file:text-sm hover:file:-translate-y-0.5 file:transition-transform file:cursor-pointer"
            />
          </label>
        ) : (
          <p className="text-sm font-semibold text-amberdark">Sudah 10 foto. Hapus dulu kalau mau ganti.</p>
        )}
      </div>

      <label className={`${LABEL} mb-6`}>
        <span className={SPAN}>Status</span>
        <select name="status" defaultValue={a.status || "ready"} className={INPUT}>
          <option value="ready">Tersedia</option>
          <option value="maintenance">Perawatan (tidak bisa disewa)</option>
          <option value="rented">Sedang disewa</option>
        </select>
      </label>

      <button
        type="submit"
        className="w-full font-bold px-6 py-4 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-y-0.5"
      >
        {a.id ? "Simpan perubahan" : "Tambah akun"}
      </button>
    </form>
  );
}
