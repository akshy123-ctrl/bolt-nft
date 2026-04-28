"use client";

import { useStellar } from "@/context/StellarContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layout, 
  CheckCircle, 
  ShoppingBag, 
  Zap, 
  Search, 
  Package,
  TrendingUp,
  Wallet,
  Trash2,
  Loader2,
  Copy,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { triggerClickEffect, triggerSuccessBurst } from "@/lib/effects";
import NFTCard from "@/components/NFTCard";
import GlassCard from "@/components/GlassCard";
import TerminalCard from "@/components/TerminalCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { MARKETPLACE_ID, NETWORK_PASSPHRASE, sorobanRpc, NFTMKT_ASSET_CODE, NFTMKT_ISSUER, horizon, addrToScVal, idToScVal } from "@/lib/stellar";
import { TransactionBuilder, Contract, Asset, Operation } from "@stellar/stellar-sdk";

export default function UserDashboard() {
  const { address, connect, sign } = useStellar();
  const [myNfts, setMyNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [hasTrustline, setHasTrustline] = useState<boolean>(true);
  const [isCheckingTrustline, setIsCheckingTrustline] = useState(true);

  const waitTransaction = async (hash: string) => {
    let attempts = 0;
    while (attempts < 60) {
      const res = await sorobanRpc.getTransaction(hash);
      if (res.status === "SUCCESS") return res;
      if (res.status === "FAILED") throw new Error("Transaction failed on-chain");
      await new Promise(r => setTimeout(r, 2000));
      attempts++;
    }
    throw new Error("Confirmation timed out");
  };

  const handleDeList = async (nft: any) => {
    setActionStatus(`Removing ${nft.name}...`);
    try {
      if (nft.status === "listed") {
        const marketplace = new Contract(MARKETPLACE_ID);
        const delistOp = marketplace.call(
          "delist_nft",
          addrToScVal(address!),
          idToScVal(nft.tokenId || nft.id)
        );

        const tx = new TransactionBuilder(await sorobanRpc.getAccount(address!), {
          fee: "2000",
          networkPassphrase: NETWORK_PASSPHRASE,
        })
        .addOperation(delistOp)
        .setTimeout(60)
        .build();

        const prepared = await sorobanRpc.prepareTransaction(tx);
        const signed = await sign(prepared.toXDR());
        const { hash } = await sorobanRpc.sendTransaction(TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE));
        await waitTransaction(hash);
      }

      await fetch(`/api/nfts/${nft.tokenId || nft.id}`, {
        method: "DELETE"
      });

      triggerSuccessBurst();
      fetchMyNfts();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setActionStatus(null);
    }
  };

  const checkTrustline = async () => {
    if (!address) return;
    setIsCheckingTrustline(true);
    try {
      const account = await horizon.loadAccount(address);
      const exists = account.balances.some((b: any) => 
        b.asset_code === NFTMKT_ASSET_CODE && b.asset_issuer === NFTMKT_ISSUER
      );
      setHasTrustline(exists);
    } catch (err) {
      console.error("Trustline check failed:", err);
    } finally {
      setIsCheckingTrustline(false);
    }
  };

  const handleAddTrustline = async () => {
    setActionStatus("Adding Reward Trustline...");
    try {
      const account = await sorobanRpc.getAccount(address!);
      const tx = new TransactionBuilder(account, {
        fee: "1000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(Operation.changeTrust({
        asset: new Asset(NFTMKT_ASSET_CODE, NFTMKT_ISSUER)
      }))
      .setTimeout(60)
      .build();

      const signed = await sign(tx.toXDR());
      const { hash } = await sorobanRpc.sendTransaction(TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE));
      await waitTransaction(hash);
      
      setHasTrustline(true);
      triggerSuccessBurst();
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setActionStatus(null);
    }
  };

  const fetchMyNfts = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/nfts");
      const data = await res.json();
      if (Array.isArray(data)) {
        const filtered = data.filter((n: any) => n.creator === address || n.owner === address);
        setMyNfts(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyNfts();
    checkTrustline();
  }, [address]);

  const stats = {
    total: myNfts.filter(n => n.creator === address).length,
    listed: myNfts.filter(n => n.status === "listed" && n.creator === address).length,
    sold: myNfts.filter(n => n.status === "sold" && n.creator === address).length,
    owned: myNfts.filter(n => n.owner === address).length,
    revenue: myNfts.filter(n => n.status === "sold" && n.creator === address).reduce((acc, curr) => acc + parseFloat(curr.price), 0)
  };

  const filteredNfts = myNfts.filter(n => {
    if (filter === "all") return true;
    if (filter === "owned") return n.owner === address;
    return n.status === filter && n.creator === address;
  });

  if (!address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full p-12 text-center space-y-8">
          <div className="bg-accent-violet w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-violet-glow">
            <Wallet size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-outfit font-black text-white">Connect Wallet</h1>
            <p className="text-white/40 font-dm-sans">Access your decentralized asset management hub.</p>
          </div>
          <button 
            onClick={connect}
            className="w-full bg-accent-violet text-white py-5 rounded-[24px] font-bold shadow-violet-glow hover:bg-accent-violet/90 transition-all shimmer-sweep"
          >
            Connect Wallet
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16">
        <div className="space-y-8 w-full lg:w-auto">
          <div className="space-y-2">
            <h1 className="text-5xl font-outfit font-black text-white tracking-tighter uppercase">Dashboard</h1>
            <p className="text-white/40 font-dm-sans text-lg">Real-time protocol analytics and inventory.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TerminalCard label="Identity" value={address} />
            <TerminalCard label="Protocol Node" value={MARKETPLACE_ID} />
          </div>

          {!hasTrustline && !isCheckingTrustline && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleAddTrustline}
              className="flex items-center gap-2 bg-accent-cyan text-[#0a0f1e] px-6 py-3 rounded-xl text-xs font-bold shadow-cyan-glow shimmer-sweep"
            >
              <Zap size={14} />
              Enable Reward Stream
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          {[
            { label: "Created", value: stats.total, icon: Package, color: "violet" },
            { label: "Live", value: stats.listed, icon: Zap, color: "cyan" },
            { label: "Liquidity", value: stats.sold, icon: ShoppingBag, color: "pink" },
            { label: "Revenue", value: `${stats.revenue} XLM`, icon: TrendingUp, color: "violet" },
          ].map((stat, i) => (
            <GlassCard 
              key={i}
              className="p-6 flex flex-col gap-2 min-w-[150px]"
            >
              <div className={`text-accent-${stat.color} mb-2`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-outfit font-black text-white">{stat.value}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-12 bg-white/5 p-2 rounded-[32px] w-fit border border-white/10 backdrop-blur-xl">
        {["all", "pending", "listed", "sold", "owned"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${
              filter === f 
                ? "bg-accent-violet text-white shadow-violet-glow" 
                : "text-white/40 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SkeletonLoader className="h-96" count={3} />
        </div>
      ) : filteredNfts.length === 0 ? (
        <GlassCard className="p-20 text-center space-y-6 border-white/5 bg-white/[0.01]">
          <Search size={40} className="mx-auto text-white/10" />
          <div className="space-y-2">
            <h3 className="text-2xl font-outfit font-bold text-white">Void detected</h3>
            <p className="text-white/40 font-dm-sans">No assets matching the current signature.</p>
          </div>
          <Link href="/marketplace">
            <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/10 shimmer-sweep">
              Browse Marketplace
            </button>
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredNfts.map((nft, i) => (
              <motion.div
                key={nft.id || i}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <NFTCard {...nft} index={i} />
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                   <div className="bg-[#0a0f1e]/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-accent-cyan border border-accent-cyan/20 shadow-xl">
                    {nft.owner === address ? "Identity Owner" : nft.status}
                  </div>
                  {nft.status !== "sold" && (
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeList(nft)}
                      className="p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white/40 hover:text-white transition-all shadow-xl"
                    >
                      {actionStatus?.includes(nft.name) ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Log Feed (List Style) */}
      <div className="mt-32 space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-outfit font-black text-white uppercase tracking-tighter">Transaction Registry</h2>
          <p className="text-white/40 font-dm-sans">Historical protocol activity for your identity.</p>
        </div>
        
        <GlassCard className="overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Asset</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Registry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredNfts.length > 0 ? filteredNfts.map((nft, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-violet/10 rounded-lg text-accent-violet group-hover:scale-110 transition-transform">
                          {nft.status === 'sold' ? <ShoppingBag size={14} /> : <Zap size={14} />}
                        </div>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">{nft.status === 'sold' ? 'Liquidity' : 'Registry'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-white/80">{nft.name}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-accent-cyan">{nft.price} XLM</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${nft.status === 'sold' ? 'bg-green-500' : 'bg-accent-violet'}`} />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{nft.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-white/20 hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-white/20 font-dm-sans text-sm">No registry entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {actionStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] glass-panel px-8 py-4 border-accent-violet/30 bg-accent-violet/10 backdrop-blur-xl flex items-center gap-4"
        >
          <Loader2 size={20} className="text-accent-violet animate-spin" />
          <span className="font-bold text-white text-sm uppercase tracking-widest">{actionStatus}</span>
        </motion.div>
      )}
    </div>
  );
}
