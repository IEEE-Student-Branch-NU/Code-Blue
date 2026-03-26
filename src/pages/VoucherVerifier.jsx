import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Database } from 'lucide-react';
import Squares from '../components/Backgrounds/Squares/Squares';

const VoucherVerifier = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);

  const calculateVoucher = async (e) => {
    e.preventDefault();
    if (!email) return;

    const secret = "IEEE_CARNIVAL_SBNU_2026"; // MUST MATCH QUANTUMBOOTH.JSX
    const msgUint8 = new TextEncoder().encode(email.toLowerCase().trim() + secret);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const code = "NRM-" + hashHex.slice(0, 8).toUpperCase();
    
    setResult(code);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Squares direction="diagonal" speed={0.2} borderColor="#333" squareSize={40} hoverFillColor="#111" />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md relative z-10 bg-black/80 backdrop-blur-xl border-2 border-[#FFD700] rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(255,215,0,0.2)]"
        >
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#FFD700] rounded-2xl mx-auto flex items-center justify-center mb-6">
                    <ShieldCheck size={32} className="text-black" />
                </div>
                <h1 className="text-white text-3xl font-[1000] tracking-tighter uppercase italic">ADIMN VERIFIER</h1>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-2">IEEE CARNIVAL BOOTH TOOL</p>
            </div>

            <form onSubmit={calculateVoucher} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">STUDENT EMAIL / ID</label>
                    <input 
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. 21bce123@nirmauni.ac.in"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-bold focus:border-[#FFD700] outline-none transition-all"
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full py-4 bg-[#FFD700] text-black font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all transform active:scale-95"
                >
                    GENERATE EXPECTED CODE
                </button>
            </form>

            {result && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-10 p-6 bg-white/5 border-2 border-dashed border-[#FFD700]/30 rounded-2xl text-center"
                >
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">EXPECTED VOUCHER</p>
                    <h2 className="text-[#FFD700] text-4xl font-[1000] tracking-widest italic">{result}</h2>
                </motion.div>
            )}

            <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-center gap-4 text-white/20">
                <Database size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">STATELESS CRYPTO VERIFICATION</span>
            </div>
        </motion.div>
    </div>
  );
};

export default VoucherVerifier;
