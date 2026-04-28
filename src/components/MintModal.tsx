"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Sparkles, Image as ImageIcon, Zap, Activity, Info } from "lucide-react";
import { useToast } from "./Toast";
import Input from "./Input";
import Button from "./Button";
import GlassCard from "./GlassCard";
import { createNFTAction } from "@/app/actions/nft";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorAddress: string;
}

export default function MintModal({ isOpen, onClose, creatorAddress }: MintModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    royalty: "2000", 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creatorAddress) {
      toast("Please connect your wallet first", "error");
      return;
    }

    if (!formData.imageUrl) {
      setError("Image is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createNFTAction({
        ...formData,
        tokenId: Math.floor(Math.random() * 1000000), 
        creator: creatorAddress,
        status: "pending",
      });

      if (result.success) {
        toast("Asset successfully submitted to the protocol", "success");
        onClose();
        setFormData({ name: "", description: "", imageUrl: "", price: "", royalty: "2000" });
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (err: any) {
      toast(err.message, "error");
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0f1e]/80 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl z-10"
          >
            <GlassCard className="!rounded-[48px] overflow-hidden border-white/10">
              <div className="flex flex-col lg:flex-row">
                {/* Left Side: Preview */}
                <div className="lg:w-2/5 bg-white/[0.02] p-10 border-r border-white/5 flex flex-col items-center justify-center gap-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Asset Preview</h3>
                    <p className="text-xs font-bold text-accent-cyan">Verify your creation before minting</p>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="nft-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, imageUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label 
                    htmlFor="nft-upload"
                    className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center gap-6 cursor-pointer hover:bg-white/[0.05] hover:border-accent-violet/50 transition-all group overflow-hidden relative shadow-2xl"
                  >
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <div className="p-6 bg-accent-violet/10 rounded-3xl group-hover:scale-110 transition-transform text-accent-violet border border-accent-violet/20">
                          <ImageIcon size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Select Artwork</p>
                          <p className="text-[10px] font-bold text-white/20 uppercase">High fidelity PNG/JPG only</p>
                        </div>
                      </>
                    )}
                  </label>

                  <div className="w-full bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center gap-3 text-white/40">
                      <Shield size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Protocol Guard Enabled</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/40">
                      <Activity size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Global Royalty Indexing</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-3/5 p-12 relative overflow-y-auto max-h-[80vh]">
                   <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex items-center gap-4 mb-12">
                    <div className="bg-accent-violet/20 text-accent-violet p-4 rounded-2xl border border-accent-violet/20 shadow-violet-glow">
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-outfit font-black text-white uppercase tracking-tighter">Mint Asset</h2>
                      <p className="text-white/40 font-dm-sans">Launch your creation into the global ledger</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-10">
                      <Input 
                        label="Asset Name"
                        placeholder="e.g. Bolt Genesis #001"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />

                      <div className="grid grid-cols-2 gap-6">
                        <Input 
                          label="Initial Price (XLM)"
                          placeholder="100"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                        <div className="relative">
                           <Input 
                            label="Royalty Basis Points"
                            placeholder="2000"
                            type="number"
                            value={formData.royalty}
                            onChange={(e) => setFormData({ ...formData, royalty: e.target.value })}
                            required
                          />
                          <div className="absolute top-1/2 -translate-y-1/2 right-6">
                            <span className="text-[10px] font-black text-accent-cyan uppercase tracking-widest">20% Total</span>
                          </div>
                        </div>
                      </div>

                      <Input 
                        isTextArea
                        label="Description"
                        placeholder="Detail the utility, provenance, and narrative of this asset..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="bg-accent-violet/10 rounded-[32px] p-8 border border-accent-violet/20 space-y-4">
                      <div className="flex items-center gap-3 text-accent-violet">
                        <Zap size={20} fill="currentColor" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Automated Royalty Engine</span>
                      </div>
                      <p className="text-sm font-medium text-white/50 leading-relaxed font-dm-sans">
                        Payments are split instantly between all stakeholders on every secondary sale. 
                        Settlement occurs in real-time on the Stellar network.
                      </p>
                    </div>

                    <Button 
                      type="submit"
                      isLoading={isSubmitting}
                      className="w-full !py-6 !text-lg"
                      icon={<Plus size={24} />}
                    >
                      Initialize Asset
                    </Button>
                  </form>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Shield({ size, className }: { size: number, className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
