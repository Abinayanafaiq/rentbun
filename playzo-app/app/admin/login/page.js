import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Login Admin — Rentzo" };

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <div className="text-center mb-8">
        <h1 className="font-display font-extrabold text-3xl">Area admin</h1>
        <p className="text-ink/70 mt-1.5">Masuk untuk mengelola stok dan order.</p>
      </div>
      <LoginForm />
    </div>
  );
}
