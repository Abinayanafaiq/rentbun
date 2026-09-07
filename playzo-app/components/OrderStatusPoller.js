"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Poll status order tiap beberapa detik; refresh halaman begitu status berubah
export default function OrderStatusPoller({ code, intervalMs = 8000 }) {
  const router = useRouter();

  useEffect(() => {
    let stopped = false;

    async function poll() {
      try {
        const res = await fetch(`/api/order-status/${code}`, { cache: "no-store" });
        const data = await res.json().catch(() => null);
        if (!stopped && data?.status && data.status !== "pending") {
          router.refresh();
        }
      } catch {
        // jaringan putus sesaat — coba lagi di interval berikutnya
      }
    }

    const timer = window.setInterval(poll, intervalMs);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [code, intervalMs, router]);

  return null;
}
