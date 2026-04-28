"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { triggerClickEffect } from "@/lib/effects";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  icon?: ReactNode;
  className?: string;
}

export default function Button({ 
  children, 
  variant = "primary", 
  isLoading, 
  icon, 
  className = "", 
  onClick,
  ...props 
}: ButtonProps) {
  const baseStyles = "relative flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-outfit font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-violet-glow shimmer-sweep",
    secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    ghost: "bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30",
  };

  const handleClick = (e: any) => {
    triggerClickEffect(e);
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={!props.disabled && !isLoading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!props.disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={handleClick}
      {...props}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {icon && <span className="group-hover:translate-x-1 transition-transform">{icon}</span>}
          {children}
        </>
      )}
      
      {/* Glossy overlay for all variants */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.1] to-transparent pointer-events-none" />
    </motion.button>
  );
}
