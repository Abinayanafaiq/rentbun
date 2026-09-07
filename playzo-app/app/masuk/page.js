import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/userAuth";
import { getDict } from "@/lib/i18n";
import UserLoginForm from "@/components/UserLoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Masuk — Rentzo" };

export default async function MasukPage() {
  if (await getUserId()) redirect("/profil");

  const t = await getDict();

  return (
    <div className="auth-page max-w-6xl mx-auto px-4 py-10 sm:py-16 lg:py-20">
      <div className="auth-layout grid lg:grid-cols-[1fr_440px] gap-10 lg:gap-20 items-center">
        <section className="auth-intro hidden lg:block">
          <div className="auth-emblem mb-9"><span>R</span><i aria-hidden="true" /></div>
          <p className="eyebrow mb-4">{t.auth.eyebrow}</p>
          <h1 className="auth-title font-display font-extrabold text-[clamp(3.5rem,6vw,6rem)] leading-[.92] tracking-[-.06em] text-text max-w-[8ch]">
            {t.auth.title}
          </h1>
          <p className="text-lg text-soft leading-relaxed max-w-[38ch] mt-7">
            {t.auth.summary}
          </p>
          <div className="auth-trust flex flex-wrap gap-3 mt-10">
            <span><b>01</b> {t.auth.trust1}</span>
            <span><b>02</b> {t.auth.trust2}</span>
          </div>
        </section>

        <section className="auth-panel">
          <div className="flex items-center justify-between mb-9">
            <Link href="/" className="font-display font-extrabold text-lg text-text lg:hidden">rentzo<span className="text-accent">.</span></Link>
            <span className="text-xs font-bold text-faint ml-auto">{t.auth.notMember}</span>
            <Link href="/daftar" className="ml-2 text-sm font-extrabold text-accent hover:text-accent2">{t.auth.register}</Link>
          </div>
          <div className="mb-8">
            <p className="eyebrow mb-3">{t.auth.welcome}</p>
            <h2 className="font-display font-extrabold text-4xl tracking-[-.04em] text-text">{t.auth.loginTitle}</h2>
            <p className="text-soft mt-3">{t.auth.loginSub}</p>
          </div>
          <UserLoginForm t={t.auth} />
          <p className="auth-caption text-center text-xs text-faint mt-7">{t.auth.caption}</p>
        </section>
      </div>
    </div>
  );
}
