"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { ToastContainer } from "@/components/Toast";
import { toast } from "@/lib/toast";
import type { Toast } from "@/components/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return (
    <SessionProvider>
      {children}
      <ToastContainer toasts={toasts} onRemove={toast.remove} />
    </SessionProvider>
  );
}
