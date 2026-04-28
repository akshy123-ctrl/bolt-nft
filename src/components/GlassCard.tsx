"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ 
  children, 
  className = "", 
  hover = true,
  onClick 
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.02,
        borderColor: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 0 30px rgba(124, 58, 237, 0.2)" 
      } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/[0.05] backdrop-blur-[16px]
        border border-white/10
        shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        rounded-[32px]
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
