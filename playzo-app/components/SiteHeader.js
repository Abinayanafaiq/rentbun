import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-paper border-b-[2.5px] border-ink">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center gap-7">
        <Link href="/" className="font-display font-extrabold text-2xl tracking-tight">
          Rentzo<span className="text-red">!</span>
        </Link>
        <nav className="hidden sm:flex gap-6 ml-auto font-semibold text-[0.95rem]">
          <Link href="/#katalog" className="hover:border-b-[3px] hover:border-red pb-0.5">
            Katalog
          </Link>
          <Link href="/#cara" className="hover:border-b-[3px] hover:border-red pb-0.5">
            Cara sewa
          </Link>
        </nav>
        <Link
          href="/#katalog"
          className="ml-auto sm:ml-0 inline-flex items-center font-bold text-sm px-4 py-2.5 rounded-full border-[2.5px] border-ink bg-reddeep text-paper2 shadow-hard-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Sewa sekarang
        </Link>
      </div>
    </header>
  );
}
