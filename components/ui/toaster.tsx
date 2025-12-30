// components/ui/toaster.tsx
"use client";

import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm rounded-md border px-4 py-3 shadow-md text-sm ${
            t.variant === "destructive"
              ? "border-red-500 bg-red-50 text-red-800"
              : "border-slate-300 bg-white text-slate-900"
          }`}
        >
          <div className="flex justify-between gap-2">
            <div>
              {t.title && <p className="font-semibold">{t.title}</p>}
              {t.description && <p className="mt-1 text-xs">{t.description}</p>}
            </div>
            <button
              className="text-xs text-slate-500 hover:text-slate-800"
              onClick={() => removeToast(t.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
