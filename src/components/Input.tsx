"use client";

import { useState, InputHTMLAttributes } from "react";
import { Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  isTextArea?: boolean;
}

export default function Input({ 
  label, 
  error, 
  success, 
  isTextArea, 
  className = "", 
  onFocus, 
  onBlur,
  value,
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const statusColor = error 
    ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
    : success 
      ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
      : isFocused 
        ? "border-accent-violet shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
        : "border-white/10";

  const InputComponent = isTextArea ? "textarea" : "input";

  return (
    <div className={`relative w-full group ${error ? "animate-shake" : ""}`}>
      <label 
        className={`
          absolute left-6 transition-all duration-300 pointer-events-none z-20
          ${(isFocused || hasValue) 
            ? "-top-3 text-[10px] font-black text-accent-violet bg-[#0a0f1e] px-2 uppercase tracking-widest" 
            : isTextArea ? "top-4 text-white/20 text-sm font-bold" : "top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold"
          }
        `}
      >
        {label}
      </label>

      <InputComponent
        {...(props as any)}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          w-full bg-white/[0.03] backdrop-blur-md rounded-2xl px-6 py-4 
          text-white font-dm-sans text-sm border-2 transition-all duration-300
          focus:outline-none
          ${statusColor}
          ${isTextArea ? "min-h-[120px] resize-none" : ""}
          ${className}
        `}
      />

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-green-500"
            >
              <Check size={18} className="animate-check" />
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-red-500"
            >
              <AlertCircle size={18} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-2 text-[10px] font-black text-red-500 uppercase tracking-widest"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
