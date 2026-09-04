// Pengaturan utama — ganti nomor di sini, berlaku ke seluruh situs
export const WA_NUMBER = "6281234567890";
export const WA_DISPLAY = "+62 812-3456-7890";
export const PAYMENT = {
  method: "DANA",
  number: "0812-3456-7890",
  name: "Rentzo",
};

export function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
