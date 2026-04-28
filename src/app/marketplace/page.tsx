"use client";

import { useStellar } from "@/context/StellarContext";
import NFTCard from "@/components/NFTCard";
import { Plus, Zap, Search, Layout, ShoppingBag, Filter, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { RPC_URL, NFT_ID, MARKETPLACE_ID, SPLITTER_ID, NATIVE_TOKEN_ID, NETWORK_PASSPHRASE, sorobanRpc, addrToScVal, idToScVal } from "@/lib/stellar";
import { TransactionBuilder, Address, Contract, nativeToScVal, xdr, StrKey } from "@stellar/stellar-sdk";
import { useState, useEffect } from "react";
import Link from "next/link";
import { triggerClickEffect, triggerSuccessBurst } from "@/lib/effects";
import MintModal from "@/components/MintModal";
import GlassCard from "@/components/GlassCard";
import SkeletonLoader from "@/components/SkeletonLoader";
import { ADMIN_WALLET } from "@/lib/stellar";

export default function Marketplace() {
  const { address, connect, sign } = useStellar();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string | null>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = address === ADMIN_WALLET;

  const waitTransaction = async (hash: string) => {
    let attempts = 0;
    while (attempts < 60) {
      const res = await sorobanRpc.getTransaction(hash);
      if (res.status === "SUCCESS") return res;
      if (res.status === "FAILED") throw new Error("Transaction failed on-chain");
      await new Promise(r => setTimeout(r, 2000));
      attempts++;
    }
    throw new Error("Transaction confirmation timed out");
  };

  const fetchNFTs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/nfts");
      const data = await res.json();
      if (Array.isArray(data)) {
        const visibleNfts = data
          .filter((n: any) => n.status === "listed")
          .map((n: any) => ({ ...n, id: n.tokenId || n.id }));
        setNfts(visibleNfts);
      }
    } catch (err) {
      console.error("Failed to fetch NFTs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  const handleBuy = async (id: number) => {
    if (!address) {
      connect();
      return;
    }

    const nft = nfts.find(n => n.id === id);
    if (!nft) return;

    setIsMinting(true);
    setMintStatus(`Purchasing ${nft.name}...`);
    
    try {
      const paymentToken = new Contract(NATIVE_TOKEN_ID);
      const marketplace = new Contract(MARKETPLACE_ID);

      const priceInStroops = (parseFloat(nft.price) * 10000000).toString();

      const approveOp = paymentToken.call(
        "approve",
        addrToScVal(address!), 
        addrToScVal(MARKETPLACE_ID),
        nativeToScVal(BigInt(priceInStroops), { type: "i128" }),
        nativeToScVal(2500000, { type: "u32" }) 
      );

      const approveTx = new TransactionBuilder(await sorobanRpc.getAccount(address!), {
        fee: "2000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(approveOp)
      .setTimeout(60)
      .build();

      const preparedApprove = await sorobanRpc.prepareTransaction(approveTx);
      const signedApprove = await sign(preparedApprove.toXDR());
      const { hash: appHash } = await sorobanRpc.sendTransaction(TransactionBuilder.fromXDR(signedApprove, NETWORK_PASSPHRASE));
      await waitTransaction(appHash);

      const buyOp = marketplace.call(
        "buy_nft",
        addrToScVal(address!), 
        idToScVal(id),
        addrToScVal(SPLITTER_ID)
      );

      const buyTx = new TransactionBuilder(await sorobanRpc.getAccount(address!), {
        fee: "3000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(buyOp)
      .setTimeout(60)
      .build();

      const preparedBuy = await sorobanRpc.prepareTransaction(buyTx);
      const signedBuy = await sign(preparedBuy.toXDR());
      const { hash: buyHash } = await sorobanRpc.sendTransaction(TransactionBuilder.fromXDR(signedBuy, NETWORK_PASSPHRASE));
      await waitTransaction(buyHash);

      triggerSuccessBurst();
      
      await fetch(`/api/nfts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: address, isListed: false, status: "sold" })
      });

      fetchNFTs();
      setMintStatus(`Purchase successful!`);
      setTimeout(() => setMintStatus(null), 5000);
    } catch (err: any) {
      console.error(err);
      setMintStatus(`Purchase Error: ${err.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <GlassCard hover={false} className="relative flex-1 md:w-[480px] !rounded-2xl border-white/10 bg-white/5">
            <div className="flex items-center">
              <Search className="ml-6 text-white/30" size={18} />
              <input 
                type="text" 
                placeholder="Search decentralized assets..." 
                className="w-full bg-transparent border-none py-5 px-6 text-white font-dm-sans focus:outline-none placeholder:text-white/20"
              />
              <button className="mr-4 p-3 bg-accent-violet/10 rounded-xl text-accent-violet hover:bg-accent-violet/20 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              triggerClickEffect(e);
              setIsMintModalOpen(true);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 px-8 rounded-2xl transition-all shimmer-sweep"
          >
            <Plus size={18} />
            MINT ASSET
          </motion.button>

          <Link href="/dashboard" className="flex-1 md:flex-none">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 bg-accent-violet text-white font-bold py-5 px-8 rounded-2xl shadow-violet-glow shimmer-sweep"
            >
              <Layout size={18} />
              DASHBOARD
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-accent-cyan font-black text-xs uppercase tracking-[0.3em] mb-4">
            <Zap size={14} fill="currentColor" />
            Registry Active
          </div>
          <h1 className="text-6xl font-outfit font-black text-white tracking-tighter uppercase">Marketplace</h1>
          <p className="text-white/40 font-dm-sans text-xl">The global ledger of authenticated digital assets.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Total Floor</p>
            <p className="text-2xl font-outfit font-black text-white">0.1 XLM</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Items</p>
            <p className="text-2xl font-outfit font-black text-white">{nfts.length}</p>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SkeletonLoader className="h-[450px]" count={6} />
        </div>
      ) : nfts.length === 0 ? (
        <GlassCard className="p-32 text-center space-y-8 border-white/5 bg-white/[0.01]">
          <ShoppingBag size={64} className="mx-auto text-white/5" />
          <div className="space-y-2">
            <h2 className="text-4xl font-outfit font-black text-white uppercase">Market Empty</h2>
            <p className="text-white/40 font-dm-sans text-lg">Be the first to mint and list an asset on the protocol.</p>
          </div>
          <button 
            onClick={() => setIsMintModalOpen(true)}
            className="bg-accent-violet text-white px-12 py-5 rounded-2xl font-bold shadow-violet-glow shimmer-sweep"
          >
            MINT FIRST ASSET
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {nfts.map((nft, i) => (
            <NFTCard 
              key={nft.id}
              {...nft} 
              index={i} 
              onBuy={() => handleBuy(nft.id)}
            />
          ))}
        </div>
      )}

      {/* Mint Modal */}
      <MintModal 
        isOpen={isMintModalOpen} 
        onClose={() => {
          setIsMintModalOpen(false);
          fetchNFTs();
        }}
        creatorAddress={address || ""}
      />

      {/* Global Status Toast */}
      {mintStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] glass-panel px-8 py-4 border-accent-violet/30 bg-accent-violet/10 backdrop-blur-xl flex items-center gap-4"
        >
          <Zap size={20} className="text-accent-violet animate-pulse" />
          <span className="font-bold text-white text-sm uppercase tracking-widest">{mintStatus}</span>
        </motion.div>
      )}
    </div>
  );
}
