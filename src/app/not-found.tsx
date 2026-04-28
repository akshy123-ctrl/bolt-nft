"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Home, ArrowLeft } from "lucide-react";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-violet/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-cyan/20 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center space-y-12 max-w-2xl"
      >
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-accent-violet to-accent-cyan flex items-center justify-center animate-pulse shadow-violet-glow">
            <Zap size={64} className="text-white" fill="currentColor" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-outfit font-black text-white tracking-tighter">
            404
          </h1>
          <h2 className="text-3xl font-outfit font-bold text-white uppercase tracking-widest">
            Protocol Error
          </h2>
          <p className="text-white/50 font-dm-sans text-xl leading-relaxed">
            The digital asset you are looking for has been moved or doesn&apos;t exist in our protocol. 
            Check your link or return to the main hub.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/">
            <Button variant="primary" className="min-w-[240px]">
              <Home size={20} />
              Return Home
            </Button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/40 hover:text-white font-black uppercase text-xs tracking-widest transition-colors duration-300"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20 pointer-events-none" />
    </div>
  );
}
