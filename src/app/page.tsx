"use client";

import { useStellar } from "@/context/StellarContext";
import { Zap, Shield, Rocket, Globe, ArrowRight, Sparkles, Activity, Layers, Cpu, Database, Network } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { triggerClickEffect } from "@/lib/effects";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import CountUp from "@/components/CountUp";
import GlassCard from "@/components/GlassCard";

export default function Home() {
  const { address } = useStellar();

  const featuresReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const bentoFeatures = [
    {
      title: "Soroban Runtime",
      desc: "Built on Stellar's state-of-the-art smart contract platform for ultra-fast, predictable execution.",
      icon: <Cpu className="text-accent-violet" size={32} />,
      span: "md:col-span-2",
      bg: "bg-gradient-to-br from-accent-violet/10 to-transparent",
    },
    {
      title: "Protocol Speed",
      desc: "Lightning-fast transactions on the Stellar network.",
      icon: <Zap className="text-accent-cyan" size={32} />,
      span: "md:col-span-1",
      bg: "bg-gradient-to-br from-accent-cyan/10 to-transparent",
    },
    {
      title: "Global Reach",
      desc: "Instant access to Stellar's world-wide liquidity pools.",
      icon: <Globe className="text-white" size={32} />,
      span: "md:col-span-1",
      bg: "bg-white/5",
    },
    {
      title: "Royalty Engine",
      desc: "Programmable royalty splits that automatically distribute payments to all stakeholders upon every sale, settled instantly on-chain.",
      icon: <Database className="text-accent-violet" size={32} />,
      span: "md:col-span-2",
      bg: "bg-gradient-to-tr from-accent-violet/10 to-transparent",
    },
    {
      title: "Mesh Networking",
      desc: "Federated asset distribution.",
      icon: <Network className="text-accent-cyan" size={32} />,
      span: "md:col-span-1",
      bg: "bg-white/5",
    },
  ];

  const metrics = [
    { label: "Total Volume", value: 1240000, suffix: "+", prefix: "$", decimals: 0 },
    { label: "Active Nodes", value: 850, suffix: "", prefix: "", decimals: 0 },
    { label: "NFTs Minted", value: 12400, suffix: "", prefix: "", decimals: 0 },
    { label: "Protocol Fee", value: 0.1, suffix: "%", prefix: "", decimals: 1 },
  ];

  const headline = "THE NEW ERA OF DIGITAL ASSETS";
  const headlineWords = headline.split(" ");

  return (
    <div className="relative min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-6 z-10">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
            animate={{ opacity: 1, rotate: -5, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[20%] -left-20 w-[400px] h-[300px] bg-accent-violet/5 blur-[120px] rounded-full"
          />
          <motion.div 
            initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 15, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="absolute bottom-[20%] -right-20 w-[500px] h-[350px] bg-accent-cyan/5 blur-[120px] rounded-full"
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
          }}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full font-bold mb-10 text-sm tracking-widest uppercase border border-white/10"
          >
            <Sparkles size={16} className="text-accent-cyan" />
            Decentralized Royalty Ledger
          </motion.div>

          <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-outfit font-black mb-12 leading-[0.85] tracking-tightest">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                className={`inline-block mr-[0.2em] ${
                  word === "DIGITAL" || word === "ASSETS" 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]" 
                    : "text-white"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-2xl font-medium text-white/40 max-w-3xl mx-auto mb-16 leading-relaxed font-dm-sans"
          >
            A high-fidelity protocol for minting, trading, and managing NFTs with 
            built-in royalty splitting on the Bolt-NFT&apos;s network.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-wrap justify-center gap-8 mb-24"
          >
            <Link href="/marketplace">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => triggerClickEffect(e)}
                className="shimmer-sweep bg-accent-violet text-white text-xl px-16 py-6 rounded-2xl font-bold shadow-violet-glow flex items-center gap-3 group"
              >
                Enter Marketplace
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-white/10 pt-16"
          >
            {metrics.map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-outfit font-black text-white">
                  <CountUp end={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
                </div>
                <div className="text-xs font-black text-white/20 uppercase tracking-[0.2em]">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="glass-wave" />

      {/* Bento Features */}
      <section 
        ref={featuresReveal.ref}
        className={`relative py-32 px-6 z-10 transition-all duration-1000 ${
          featuresReveal.isVisible ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-5xl md:text-7xl font-outfit font-black text-white tracking-tight">PROTOCOL UTILITY</h2>
            <p className="text-white/40 text-xl font-dm-sans">Architected for scale and security</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {bentoFeatures.map((f, i) => (
              <GlassCard
                key={i}
                className={`${f.span} ${f.bg} group`}
              >
                <div className="p-10 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-2xl w-fit border border-white/10 group-hover:scale-110 group-hover:border-accent-violet/30 transition-all duration-500">
                      {f.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-outfit font-bold text-white">{f.title}</h3>
                      <p className="text-lg text-white/40 leading-relaxed font-dm-sans line-clamp-3">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <div className="glass-wave rotate-180" />

      {/* CTA */}
      <section 
        ref={ctaReveal.ref}
        className={`relative py-32 px-6 z-10 transition-all duration-1000 ${
          ctaReveal.isVisible ? "reveal-visible" : "reveal-hidden"
        }`}
      >
        <GlassCard className="max-w-7xl mx-auto p-16 md:p-32 text-center border-white/10 bg-gradient-to-br from-accent-violet/10 to-accent-cyan/5 rounded-[64px] overflow-hidden group">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan px-4 py-1 rounded-full text-xs font-bold mb-8 tracking-widest uppercase border border-accent-cyan/20">
              <Activity size={14} />
              Protocol Live on Testnet
            </div>
            
            <h2 className="text-6xl md:text-8xl font-outfit font-black mb-12 leading-tight text-white">READY TO JOIN THE <br/>REVOLUTION?</h2>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/marketplace">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => triggerClickEffect(e)}
                  className="bg-accent-cyan text-[#0a0f1e] text-xl px-16 py-6 rounded-2xl font-bold shadow-cyan-glow flex items-center gap-3 shimmer-sweep"
                >
                  <Rocket size={24} />
                  Launch Marketplace
                </motion.button>
              </Link>
            </div>
          </div>
          
          <div className="absolute top-0 left-0 p-12 opacity-10">
            <Layers size={200} className="text-white" />
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
