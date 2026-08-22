"use client";

import { AlertTriangle, Check, TriangleAlert } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type Confirmation = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

type FeedbackContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const value = useMemo<FeedbackContextValue>(
    () => ({
      confirm: (options) =>
        new Promise<boolean>((resolve) =>
          setConfirmation({ ...options, resolve }),
        ),
    }),
    [],
  );

  const closeConfirmation = (confirmed: boolean) => {
    confirmation?.resolve(confirmed);
    setConfirmation(null);
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "border bg-card text-card-foreground shadow-lg",
            title: "text-sm font-semibold",
            description: "text-xs text-muted-foreground",
          },
        }}
        icons={{
          success: <Check className="size-4 text-emerald-600" />,
          error: <TriangleAlert className="size-4 text-red-600" />,
        }}
      />
      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-5"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            className="w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl shadow-black/20"
          >
            <div
              className={`mb-5 flex size-11 items-center justify-center rounded-full ${confirmation.destructive ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
            >
              <AlertTriangle size={21} />
            </div>
            <h2 id="confirmation-title" className="text-lg font-semibold">
              {confirmation.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {confirmation.description}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => closeConfirmation(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                {confirmation.cancelLabel ?? "Cancel"}
              </button>
              <button
                autoFocus
                onClick={() => closeConfirmation(true)}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white ${confirmation.destructive ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:opacity-90"}`}
              >
                {confirmation.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context)
    throw new Error("useFeedback must be used inside FeedbackProvider");
  return context;
}

export { toast };
