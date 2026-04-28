"use client";

import { useStellar } from "@/context/StellarContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Menu, X, ArrowRight, Zap, Globe } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
  const { address, connect } = useStellar();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Protocol", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const truncatedAddress = address 
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? "py-4 bg-[#0a0f1e]/40 backdrop-blur-2xl border-b border-white/5" 
        : "py-8 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-accent-violet blur-lg rounded-full"
            />
            <div className="relative bg-accent-violet p-2 rounded-xl text-white shadow-violet-glow group-hover:scale-110 transition-transform duration-500">
              <Zap size={24} fill="currentColor" />
            </div>
          </div>
          <span className="text-2xl font-outfit font-black tracking-tighter text-white group-hover:tracking-normal transition-all duration-500 uppercase">
            Bolt-NFT&apos;s
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-accent-cyan transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-xl">
             <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Testnet Active</span>
          </div>
          
          <AnimatePresence mode="wait">
            {address ? (
              <motion.div
                key="connected"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pr-6 rounded-2xl hover:border-accent-violet/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white shadow-violet-glow">
                  <Wallet size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Identity</span>
                  <span className="text-xs font-bold text-white group-hover:text-accent-cyan transition-colors">{truncatedAddress}</span>
                </div>
              </motion.div>
            ) : (
              <Button 
                key="connect"
                onClick={connect}
                icon={<Wallet size={18} />}
                className="!py-3 !px-6"
              >
                Connect
              </Button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0a0f1e]/80 backdrop-blur-xl md:hidden z-[90]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-[#0a0f1e] border-l border-white/5 p-12 flex flex-col gap-12 md:hidden z-[100]"
            >
              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-outfit font-black uppercase tracking-widest text-white/40 hover:text-white flex items-center justify-between group"
                  >
                    {link.name}
                    <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-accent-cyan" />
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-4">
                 <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
                   <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
                     <Globe size={18} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Network</p>
                     <p className="text-xs font-bold text-white">Stellar Testnet</p>
                   </div>
                 </div>
                 <Button onClick={address ? undefined : connect} icon={<Wallet size={18} />}>
                   {address ? truncatedAddress : "Connect Wallet"}
                 </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
