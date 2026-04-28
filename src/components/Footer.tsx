"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Globe, Send, MessageCircle } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Globe, href: "#", label: "Website" },
    { icon: Send, href: "#", label: "Telegram" },
    { icon: MessageCircle, href: "#", label: "Discord" },
  ];

  return (
    <footer className="relative mt-20 px-6 pb-20 pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel p-12 md:p-16 relative overflow-hidden border-white/5 bg-white/[0.02]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {/* Brand */}
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-3 font-outfit font-black text-2xl text-white">
                <Zap size={24} className="text-accent-violet" fill="currentColor" />
                BOLT-NFT&apos;S
              </div>
              <p className="font-dm-sans text-white/50 max-w-sm leading-relaxed">
                The next-generation NFT protocol built on Stellar. Automated royalties, 
                high-speed execution, and deep space aesthetics.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-accent-cyan hover:border-accent-cyan/50 transition-all"
                  >
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-6">
              <h4 className="font-outfit font-bold text-white text-lg">Protocol</h4>
              <ul className="space-y-4 font-dm-sans text-sm text-white/40">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Governance</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-outfit font-bold text-white text-lg">Support</h4>
              <ul className="space-y-4 font-dm-sans text-sm text-white/40">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Brand Assets</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-dm-sans font-bold text-white/20 uppercase tracking-widest">
            <span>© 2026 BOLT-NFT&apos;S PROTOCOL</span>
            <div className="flex gap-8">
              <span>Built on Soroban</span>
              <span>Stellar Mainnet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
