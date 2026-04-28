"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import GlassCard from "./GlassCard";

interface TerminalCardProps {
  label: string;
  value: string;
  truncate?: boolean;
}

export default function TerminalCard({ label, value, truncate = true }: TerminalCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayValue = truncate && value.length > 20 
    ? `${value.slice(0, 8)}...${value.slice(-8)}` 
    : value;

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] ml-1">{label}</span>
      <GlassCard hover={false} className="!rounded-xl border-white/5 bg-black/20">
        <div className="flex items-center justify-between gap-4 p-4 font-mono text-sm group">
          <span className="text-accent-cyan break-all">{displayValue}</span>
          <button 
            onClick={handleCopy}
            className="text-white/20 hover:text-white transition-colors flex-shrink-0"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
