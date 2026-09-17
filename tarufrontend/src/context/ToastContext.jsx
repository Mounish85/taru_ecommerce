import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (msg, dur) => addToast({ message: msg, type: "success", duration: dur }),
    error: (msg, dur) => addToast({ message: msg, type: "error", duration: dur }),
    info: (msg, dur) => addToast({ message: msg, type: "info", duration: dur }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Brutalist Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 border border-[#1E1E1E] shadow-[4px_4px_0px_#1E1E1E] transition-all duration-300 animate-slide-up ${
              item.type === "success"
                ? "bg-[#E4E2DD] text-[#1E1E1E] border-l-8 border-l-[#DB4A2B]"
                : item.type === "error"
                ? "bg-[#1E1E1E] text-[#E4E2DD] border-l-8 border-l-[#FF89A9]"
                : "bg-[#ECEAE5] text-[#1E1E1E] border-l-8 border-l-[#F8A348]"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-[#DB4A2B]" />
              )}
              {item.type === "error" && (
                <AlertCircle className="w-5 h-5 text-[#FF89A9]" />
              )}
              {item.type === "info" && (
                <Info className="w-5 h-5 text-[#F8A348]" />
              )}
            </div>
            <div className="flex-1 font-satoshi text-sm font-medium tracking-wide">
              {item.message}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 text-current hover:opacity-60 transition-opacity p-0.5"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

