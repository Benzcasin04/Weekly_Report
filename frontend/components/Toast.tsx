"use client";
import { createContext, useContext, useCallback, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType; icon: string; }

const icons = { success: "✓", error: "✕", info: "ℹ" };

const ToastCtx = createContext<{ show: (msg: string, type?: ToastType) => void }>({
  show: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, icon: icons[type] }]);
    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, removing: true } : t))
      );
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 250);
    }, 3200);
  }, []);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.type} ${"removing" in t && t.removing ? "removing" : ""}`}
          >
            <span style={{ fontSize: 15, opacity: 0.9 }}>{t.icon}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
