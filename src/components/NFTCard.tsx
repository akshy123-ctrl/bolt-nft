"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import GlassCard from "./GlassCard";

interface NFTCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  status: string;
  index?: number;
  onBuy?: () => void;
}

export default function NFTCard({ name, price, image, status, index = 0, onBuy }: NFTCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <GlassCard className="group h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-[24px] m-4">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4 bg-[#0a0f1e]/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 pt-2 flex flex-col flex-1 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={12} className="text-accent-violet" />
              Verified Protocol Asset
            </div>
            <h3 className="text-2xl font-outfit font-black text-white group-hover:text-accent-cyan transition-colors truncate">
              {name}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Floor Price</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-outfit font-black text-white">{price}</span>
                <span className="text-sm font-bold text-accent-cyan uppercase">XLM</span>
              </div>
            </div>
            
            {onBuy && status === "listed" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onBuy();
                }}
                className="bg-accent-violet text-white p-4 rounded-xl shadow-violet-glow shimmer-sweep"
              >
                <ShoppingBag size={20} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute bottom-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={12} className="text-white/20" />
        </div>
      </GlassCard>
    </motion.div>
  );
}

function ArrowUpRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
