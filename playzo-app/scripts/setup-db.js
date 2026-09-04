/* Script setup database Rentzo:
   1. BERSIHKAN semua tabel lama di schema public
   2. Buat tabel accounts & orders
   3. Seed contoh akun Mobile Legends

   Jalankan: node scripts/setup-db.js
*/
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// Baca DATABASE_URL dari .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const env = fs.readFileSync(envPath, "utf8");
const match = env.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error("DATABASE_URL tidak ditemukan di .env.local");
  process.exit(1);
}
const DATABASE_URL = match[1].trim();

const SCHEMA = `
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  rank TEXT NOT NULL,
  heroes INT NOT NULL DEFAULT 0,
  skins INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 0,
  price_per_hour INT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ready',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  wa TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  account_id INT REFERENCES accounts(id) ON DELETE SET NULL,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  account_title TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_wa TEXT NOT NULL,
  hours INT NOT NULL,
  total INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);
`;

const SEED = `
INSERT INTO accounts (title, rank, heroes, skins, level, price_per_hour, description, email, password, status) VALUES
('Sultan Immortal Full Collector', 'Mythical Immortal', 122, 410, 30, 5000,
 'Akun paling sultan di katalog. Skin collector hampir lengkap, emblem max semua, winrate 68 persen. Cocok buat konten atau push leaderboard.',
 'sultan01@rentzo.id', 'Pz!imortal91', 'ready'),
('Mythic Glory 320 Skin', 'Mythic Glory', 120, 320, 30, 3000,
 'Rank Mythic Glory murni hasil push, bukan joki. Skin epic dan legend banyak, hero lengkap tinggal pilih.',
 'glory02@rentzo.id', 'Pz!glory320', 'ready'),
('Mythic Honor Siap Push', 'Mythic Honor', 115, 250, 30, 2500,
 'Selangkah lagi ke Glory. MMR hero tinggi, cocok buat yang mau lanjutin push sampai puncak.',
 'honor03@rentzo.id', 'Pz!honor250', 'ready'),
('Mythic Biasa Harga Kaki Lima', 'Mythic', 118, 280, 30, 2800,
 'Rank Mythic dengan koleksi skin lumayan. Pilihan paling seimbang antara gengsi dan harga.',
 'mythic04@rentzo.id', 'Pz!mythic280', 'ready'),
('Legend Buat Mabar', 'Legend', 108, 210, 28, 2000,
 'Pas buat mabar sama teman tanpa takut ketemu smurf. Skin favorit marksman dan assassin lengkap.',
 'legend05@rentzo.id', 'Pz!legend210', 'ready'),
('Epic Kantong Pelajar', 'Epic', 100, 180, 26, 1500,
 'Paling hemat di katalog. Cocok buat coba-coba hero baru atau sekadar main santai setelah sekolah.',
 'epic06@rentzo.id', 'Pz!epic180', 'ready');
`;

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("Terhubung ke database.");

  // 1. Bersihkan semua tabel lama
  const { rows } = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
  );
  for (const { tablename } of rows) {
    await client.query(`DROP TABLE IF EXISTS "${tablename}" CASCADE`);
    console.log(`Tabel lama dihapus: ${tablename}`);
  }

  // 2. Buat schema baru
  await client.query(SCHEMA);
  console.log("Tabel accounts, orders & users dibuat.");

  // 3. Seed
  await client.query(SEED);
  console.log("6 akun contoh Mobile Legends ditambahkan.");

  await client.end();
  console.log("Selesai. Database bersih dan siap dipakai.");
}

main().catch((err) => {
  console.error("Gagal:", err.message);
  process.exit(1);
});
