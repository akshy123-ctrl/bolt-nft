"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import GlassCard from "./GlassCard";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-8 right-8 z-[300] flex flex-col gap-4 max-w-md w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              layout
            >
              <GlassCard className="!rounded-2xl border-white/10 overflow-hidden">
                <div className="flex items-center gap-4 p-5 pr-12 relative">
                  <div className={`
                    p-2 rounded-xl flex-shrink-0
                    ${t.type === "success" ? "bg-green-500/10 text-green-500" : ""}
                    ${t.type === "error" ? "bg-red-500/10 text-red-500" : ""}
                    ${t.type === "info" ? "bg-accent-violet/10 text-accent-violet" : ""}
                  `}>
                    {t.type === "success" && <CheckCircle size={20} />}
                    {t.type === "error" && <AlertCircle size={20} />}
                    {t.type === "info" && <Info size={20} />}
                  </div>
                  <p className="text-sm font-bold text-white leading-relaxed">{t.message}</p>
                  <button 
                    onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                    className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                {/* Progress bar */}
                <motion.div 
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`
                    h-1 w-full origin-left
                    ${t.type === "success" ? "bg-green-500" : ""}
                    ${t.type === "error" ? "bg-red-500" : ""}
                    ${t.type === "info" ? "bg-accent-violet" : ""}
                  `}
                />
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
