import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Rentzo — Rental Akun Mobile Legends",
  description:
    "Sewa akun Mobile Legends full skin dan rank tinggi mulai Rp1.500 per jam. Pilih akun, chat admin, langsung main.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${archivo.variable}`}>
      <body className="font-body bg-bg text-text antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
